package com.ciu.sys.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Assignment;
import com.ciu.sys.Model.Course;
import com.ciu.sys.Model.ExamResult;
import com.ciu.sys.Model.Invoice;
import com.ciu.sys.Model.Message;
import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentAttendance;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Model.StudentEnrollment;
import com.ciu.sys.Model.Submission;
import com.ciu.sys.Model.TeacherAnnouncement;
import com.ciu.sys.Repository.AssignmentRepository;
import com.ciu.sys.Repository.CourseRepository;
import com.ciu.sys.Repository.ExamResultRepository;
import com.ciu.sys.Repository.InvoiceRepository;
import com.ciu.sys.Repository.MessageRepository;
import com.ciu.sys.Repository.PaymentRepository;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentClassRepository;
import com.ciu.sys.Repository.StudentEnrollmentRepository;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.Repository.SubmissionRepository;
import com.ciu.sys.Repository.TeacherAnnouncementRepository;
import com.ciu.sys.Repository.studentAttendanceRepository;

@Service
public class StudentPortalService {

  @Autowired
  private StudentEnrollmentRepository studentEnrollmentRepository;

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private ExamResultRepository examResultRepository;

  @Autowired
  private TeacherAnnouncementRepository teacherAnnouncementRepository;

  @Autowired
  private AssignmentRepository assignmentRepository;

  @Autowired
  private SubmissionRepository submissionRepository;

  @Autowired
  private MessageRepository messageRepository;

  @Autowired
  private InvoiceRepository invoiceRepository;

  @Autowired
  private TuitionService tuitionService;

  @Autowired
  private PaymentService paymentService;

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private studentAttendanceRepository studentAttendanceRepository;

  // ---------- Courses / Enrollments ----------

  public List<Map<String, Object>> getEnrollments(StudentAccount student) {
    List<String> allowed = currentClassCourseCodes(student);
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentEnrollment e : studentEnrollmentRepository.findByStudent_Email(student.getEmail())) {
      if (!allowed.isEmpty() && !allowed.contains(nz(e.getCourseCode())))
        continue;
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", e.getId());
      m.put("code", nz(e.getCourseCode()));
      m.put("title", nz(e.getCourseTitle()));
      // enrich from course table when available
      Optional<Course> course = courseRepository.findByCode(e.getCourseCode());
      m.put("description", course.map(Course::getDescription).orElse(""));
      m.put("instructor", course.map(Course::getInstructor).orElse(""));
      m.put("credits", course.map(Course::getCredits).orElse(0));
      result.add(m);
    }
    return result;
  }

  // ---------- Grades ----------

  public List<Map<String, Object>> getGrades(StudentAccount student) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (ExamResult g : examResultRepository.findByStudentEmail(student.getEmail())) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", g.getId());
      m.put("title", nz(g.getCourseName()));
      m.put("code", nz(g.getCode()));
      m.put("instructor", nz(g.getTeacherEmail()));
      m.put("score", g.getScore() > 0 ? g.getScore() : g.getMark());
      m.put("grade", nz(g.getLetter()).isEmpty() ? nz(g.getGrade()) : nz(g.getLetter()));
      result.add(m);
    }
    return result;
  }

  // ---------- Announcements ----------

  public List<Map<String, Object>> getAnnouncements() {
    List<Map<String, Object>> result = new ArrayList<>();
    for (TeacherAnnouncement a : teacherAnnouncementRepository.findAllByActiveTrue()) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", a.getId());
      m.put("title", nz(a.getTitle()));
      m.put("body", nz(a.getMessage()));
      m.put("date", a.getCreateAt() == null ? "" : a.getCreateAt().toString().substring(0, 10));
      result.add(m);
    }
    return result;
  }

  // ---------- Schedule ----------

  public List<Map<String, Object>> getSchedule(StudentAccount student) {
    List<String> codes = currentClassCourseCodes(student);
    List<Map<String, Object>> result = new ArrayList<>();
    for (Schedule s : scheduleRepository.findActive()) {
      boolean matched = codes.contains(s.getCourse());
      if (!matched)
        continue;
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("day", nz(s.getStartDay()).isBlank() ? nz(s.getDay()) : nz(s.getStartDay()));
      m.put("endDay", nz(s.getEndDay()));
      m.put("code", nz(s.getCourse()));
      m.put("title", nz(s.getSubject()).isBlank() ? nz(s.getCourse()) : nz(s.getSubject()));
      m.put("semester", nz(s.getSemester()));
      m.put("major", nz(s.getMajor()));
      m.put("field", nz(s.getField()));
      m.put("level", nz(s.getLevel()));
      m.put("time", nz(s.getTime()));
      m.put("room", nz(s.getRoom()));
      m.put("teacher", nz(s.getTeacher()));
      m.put("joinCode", nz(s.getJoinCode()));
      result.add(m);
    }
    return result;
  }

  // ---------- Attendance ----------

  public List<Map<String, Object>> getAttendance(StudentAccount student) {
    List<Map<String, Object>> result = new ArrayList<>();
    List<StudentAttendance> att = studentAttendanceRepository.findByStudentsId(student.getId());
    long present = att.stream().filter(StudentAttendance::isPresent).count();
    int total = att.size();
    int pct = total == 0 ? 0 : (int) Math.round(present * 100.0 / total);
    Map<String, Object> m = new java.util.HashMap<>();
    m.put("title", "Attendance");
    m.put("code", "");
    m.put("present", present);
    m.put("total", total);
    m.put("percent", pct);
    result.add(m);
    return result;
  }

  // ---------- Assignments ----------

  public List<Map<String, Object>> getAssignments(StudentAccount student) {
    StudentClass cls = student.getClasses();
    String classCode = cls != null ? nz(cls.getGroup()) : "";
    List<Map<String, Object>> result = new ArrayList<>();
    for (Assignment a : assignmentRepository.findAllByActiveTrue()) {
      boolean matched = classCode.isEmpty() || classCode.equalsIgnoreCase(nz(a.getCourseCode()));
      if (!matched)
        continue;
      boolean submitted = submissionRepository.findByStudentEmail(student.getEmail()).stream()
          .anyMatch(s -> s.getAssignmentId() != null && s.getAssignmentId().equals(a.getId()));
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", a.getId());
      m.put("code", nz(a.getCourseCode()));
      m.put("title", nz(a.getTitle()));
      m.put("due", a.getDueDate() == null ? "" : a.getDueDate().toString());
      m.put("submitted", submitted);
      result.add(m);
    }
    return result;
  }

  public Map<String, Object> submitAssignment(StudentAccount student, Map<String, Object> body) {
    Long assignmentId = null;
    if (body.get("assignmentId") != null) {
      assignmentId = Long.valueOf(body.get("assignmentId").toString());
    }
    Submission sub = new Submission();
    sub.setStudentEmail(student.getEmail());
    sub.setAssignmentId(assignmentId);
    sub.setContent(body.get("note") == null ? "" : body.get("note").toString());
    sub.setSubmittedAt(new java.sql.Date(System.currentTimeMillis()));
    submissionRepository.save(sub);
    return Map.of("message", "Submitted");
  }

  // ---------- Messages ----------

  public List<Map<String, Object>> getMessages(StudentAccount student) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (Message msg : messageRepository.findByReceiverEmail(student.getEmail())) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", msg.getId());
      m.put("mine", false);
      m.put("from", nz(msg.getSenderEmail()));
      m.put("text", nz(msg.getContent()));
      m.put("time", nz(msg.getCreateAt()));
      result.add(m);
    }
    return result;
  }

  public Map<String, Object> sendMessage(StudentAccount student, Map<String, Object> body) {
    Message msg = new Message();
    msg.setSenderEmail(student.getEmail());
    msg.setSenderRole("STUDENT");
    msg.setReceiverEmail(body.get("course") == null ? "" : body.get("course").toString());
    msg.setContent(body.get("text") == null ? "" : body.get("text").toString());
    msg.setRead(false);
    msg.setCreateAt(new Date().toString());
    messageRepository.save(msg);
    return Map.of("message", "Sent");
  }

  // ---------- Invoices ----------

  public List<Map<String, Object>> getInvoices(StudentAccount student) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (Invoice inv : invoiceRepository.findByStudentEmail(student.getEmail())) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", inv.getId());
      m.put("title", nz(inv.getDescription()));
      m.put("due", inv.getDueTime() == null ? "" : inv.getDueTime().toString());
      m.put("amount", inv.getAmount());
      m.put("status", nz(inv.getStatus()));
      result.add(m);
    }
    return result;
  }

  public Map<String, Object> classStatus(StudentAccount student) {
    Map<String, Object> q = tuitionService.quote(student);
    boolean passed = Boolean.TRUE.equals(q.get("passed"));
    int nextYear = (int) q.get("nextYear");
    int nextSemester = (int) q.get("nextSemester");

    double avg = examResultRepository.findByStudentEmail(student.getEmail()).stream()
        .mapToDouble(ExamResult::getMark)
        .average()
        .orElse(0);

    boolean paid = paymentRepository.findAll().stream()
        .filter(p -> p.getStudentId() != null && p.getStudentId().equals(student.getId()))
        .filter(p -> "TUITION".equalsIgnoreCase(p.getType()))
        .count() > 0;

    Schedule nextRow = scheduleFor(student.getMajor(), nextYear, nextSemester);

    Map<String, Object> out = new java.util.HashMap<>();
    out.put("classLabel", "Year " + student.getYear() + " Semester " + student.getSemester());
    out.put("year", student.getYear());
    out.put("semester", student.getSemester());
    out.put("major", student.getMajor());
    out.put("avgScore", Math.round(avg * 100.0) / 100.0);
    out.put("passed", passed);
    out.put("nextLabel", "Year " + nextYear + " Semester " + nextSemester);
    out.put("price", ((Number) q.get("total")).doubleValue());
    out.put("scheduleReady", nextRow != null);
    out.put("paid", paid);
    out.put("joined", paid);
    out.put("joinCode", paid ? joinCodeFor(student) : null);
    return out;
  }

  @org.springframework.transaction.annotation.Transactional
  public Map<String, Object> payAndJoin(StudentAccount student) {
    boolean paid = paymentRepository.findAll().stream()
        .filter(p -> p.getStudentId() != null && p.getStudentId().equals(student.getId()))
        .filter(p -> "TUITION".equalsIgnoreCase(p.getType()))
        .count() > 0;

    if (!paid) {
      paymentService.payTuition(student); // records the payment + advances the class
    }
    return classStatus(student);
  }

  public Map<String, Object> classByCode(String code) {
    Optional<Schedule> row = scheduleRepository.findByJoinCode(code);
    if (row.isEmpty())
      return Map.of("message", "No class found for that code");
    return classInfo(row.get(), code);
  }

  public Map<String, Object> join(StudentAccount student, String code) {
    List<Schedule> rows = scheduleRepository.findActive().stream()
        .filter(s -> code.equalsIgnoreCase(nz(s.getJoinCode())))
        .collect(Collectors.toList());
    if (rows.isEmpty())
      return Map.of("error", true, "message", "No class found for that code");

    StudentClass existing = student.getClasses();
    if (existing != null) {
      if (code.equalsIgnoreCase(nz(existing.getGroup())))
        return Map.of("error", true, "message", "You already joined this class.");
      return Map.of("error", true, "message",
          "You already joined a class. A student can only be in one class at a time.");
    }

    enrollIn(rows, student);
    linkStudentToClass(student, code, rows.get(0));
    return classInfo(rows.get(0), code);
  }

  public Map<String, Object> myClass(StudentAccount student) {
    StudentClass cls = student.getClasses();
    if (cls == null)
      return Map.of("joined", false, "message", "You have not joined a class yet. Use the join key to get started.");
    String code = nz(cls.getGroup());
    Optional<Schedule> row = scheduleRepository.findByJoinCode(code);
    Map<String, Object> out = row.isPresent() ? new java.util.HashMap<>(classInfo(row.get(), code))
        : new java.util.HashMap<>();
    out.put("joined", true);
    out.put("joinCode", code);
    out.put("group", code);
    out.put("friends", classmates(cls));
    return out;
  }

  private void linkStudentToClass(StudentAccount student, String code, Schedule s) {
    if (student.getClasses() != null
        && code.equalsIgnoreCase(student.getClasses().getGroup())) {
      return;
    }
    StudentClass cls = studentClassRepository.findByGroup(code).stream().findFirst().orElse(null);
    if (cls == null) {
      cls = new StudentClass();
      cls.setGroup(code);
      cls.setMajor(s.getMajor());
      cls.setYear(s.getLevel());
      cls.setShift(s.getSemester());
      cls = studentClassRepository.save(cls);
    }
    student.setClasses(cls);
    studentRepository.save(student);
  }

  private void enrollIn(List<Schedule> rows, StudentAccount student) {
    List<String> already = studentEnrollmentRepository.findByStudent_Email(student.getEmail()).stream()
        .map(StudentEnrollment::getCourseCode)
        .collect(Collectors.toList());
    for (Schedule s : rows) {
      String courseCode = nz(s.getCourse());
      if (courseCode.isBlank() || already.contains(courseCode))
        continue;
      StudentEnrollment en = new StudentEnrollment();
      en.setStudent(student);
      en.setCourseCode(courseCode);
      en.setCourseTitle(nz(s.getSubject()).isBlank() ? courseCode : nz(s.getSubject()));
      en.setStatus("ACTIVE");
      en.setDate(new java.sql.Date(System.currentTimeMillis()));
      studentEnrollmentRepository.save(en);
    }
  }

  private Map<String, Object> classInfo(Schedule s, String code) {
    Map<String, Object> out = new java.util.HashMap<>();
    out.put("code", nz(s.getCourse()));
    out.put("joinCode", code);
    out.put("classLabel", nz(s.getLevel()).isBlank() ? nz(s.getSubject())
        : nz(s.getLevel()) + " Semester " + nz(s.getSemester()));
    out.put("level", nz(s.getLevel()));
    out.put("semester", nz(s.getSemester()));
    out.put("year", nz(s.getLevel()));
    out.put("course", nz(s.getSubject()).isBlank() ? nz(s.getCourse()) : nz(s.getSubject()));
    out.put("major", nz(s.getMajor()));
    out.put("teacher", nz(s.getTeacher()).isBlank() ? nz(s.getInstructor()) : nz(s.getTeacher()));
    out.put("days", nz(s.getStartDay()).isBlank() ? nz(s.getDay()) : nz(s.getStartDay()));
    out.put("time", nz(s.getTime()));
    out.put("room", nz(s.getRoom()));
    StudentClass cls = studentClassRepository.findByGroup(code).stream().findFirst().orElse(null);
    if (cls != null)
      out.put("friends", classmates(cls));
    return out;
  }

  private List<Map<String, Object>> classmates(StudentClass cls) {
    List<Map<String, Object>> list = new ArrayList<>();
    for (StudentAccount s : studentRepository.findByClasses(cls)) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", s.getId());
      m.put("name", nz(s.getUsername()).isBlank() ? nz(s.getEmail()) : nz(s.getUsername()));
      list.add(m);
    }
    return list;
  }

  private List<String> currentClassCourseCodes(StudentAccount student) {
    StudentClass cls = student.getClasses();
    if (cls == null)
      return List.of();
    String code = nz(cls.getGroup());
    if (code.isBlank())
      return List.of();
    return scheduleRepository.findActive().stream()
        .filter(s -> code.equalsIgnoreCase(nz(s.getJoinCode())))
        .map(s -> nz(s.getCourse()))
        .filter(c -> !c.isBlank())
        .collect(Collectors.toList());
  }

  private Schedule scheduleFor(String major, int year, int semester) {
    String level = "Year " + year;
    String sem = "Semester " + semester;
    return scheduleRepository.findActive().stream()
        .filter(s -> nz(s.getLevel()).equals(level))
        .filter(s -> nz(s.getSemester()).equals(sem))
        .filter(s -> TuitionService.sameProgram(s.getMajor(), major))
        .findFirst().orElse(null);
  }

  private String joinCodeFor(StudentAccount student) {
    if (student.getClasses() != null && !nz(student.getClasses().getGroup()).isBlank())
      return student.getClasses().getGroup();
    Schedule row = scheduleFor(student.getMajor(), student.getYear(), student.getSemester());
    if (row == null || nz(row.getJoinCode()).isBlank())
      return null;
    return row.getJoinCode();
  }
  // ---------- helpers ----------

  private List<String> enrollCodes(StudentAccount student) {
    return studentEnrollmentRepository.findByStudent_Email(student.getEmail()).stream()
        .map(e -> e.getCourseCode() == null ? "" : e.getCourseCode())
        .filter(c -> !c.isEmpty())
        .collect(Collectors.toList());
  }

  private static String nz(String v) {
    return v == null ? "" : v;
  }
}
