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
import com.ciu.sys.Model.StudentEnrollment;
import com.ciu.sys.Model.Submission;
import com.ciu.sys.Model.TeacherAnnouncement;
import com.ciu.sys.Repository.AssignmentRepository;
import com.ciu.sys.Repository.CourseRepository;
import com.ciu.sys.Repository.ExamResultRepository;
import com.ciu.sys.Repository.InvoiceRepository;
import com.ciu.sys.Repository.MessageRepository;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentEnrollmentRepository;
import com.ciu.sys.Repository.SubmissionRepository;
import com.ciu.sys.Repository.TeacherAnnouncementRepository;

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

  // ---------- Courses / Enrollments ----------

  public List<Map<String, Object>> getEnrollments(StudentAccount student) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentEnrollment e : studentEnrollmentRepository.findByStudent_Email(student.getEmail())) {
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
    for (TeacherAnnouncement a : teacherAnnouncementRepository.findAll()) {
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
    List<String> codes = enrollCodes(student);
    List<String> majors = nz(student.getMajor()).isBlank() ? List.of() : List.of(student.getMajor());
    List<Map<String, Object>> result = new ArrayList<>();
    for (Schedule s : scheduleRepository.findAll()) {
      boolean matched = codes.isEmpty() || codes.contains(s.getCourse());
      if (!matched)
        continue;
      if (!majors.isEmpty() && !nz(s.getMajor()).isBlank() && !majors.contains(s.getMajor()))
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
    List<StudentAttendance> att = student.getAttendance() == null ? List.of() : student.getAttendance();
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
    List<String> codes = enrollCodes(student);
    List<Map<String, Object>> result = new ArrayList<>();
    for (Assignment a : assignmentRepository.findAll()) {
      boolean matched = codes.isEmpty() || codes.contains(a.getCourseCode());
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
