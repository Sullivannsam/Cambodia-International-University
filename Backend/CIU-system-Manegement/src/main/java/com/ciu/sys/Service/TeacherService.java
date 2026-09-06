
package com.ciu.sys.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Message;
import com.ciu.sys.Model.Notification;
import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentAttendance;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Model.Teacher;
import com.ciu.sys.Model.TeacherAnnouncement;
import com.ciu.sys.Repository.AssignmentRepository;
import com.ciu.sys.Repository.ExamResultRepository;
import com.ciu.sys.Repository.MessageRepository;
import com.ciu.sys.Repository.NotificationRepository;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentClassRepository;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.Repository.SubmissionRepository;
import com.ciu.sys.Repository.TeacherAnnouncementRepository;
import com.ciu.sys.Repository.TeacherRepository;
import com.ciu.sys.Repository.studentAttendanceRepository;
import com.ciu.sys.common.ResourceNotFoundException;

@Service
public class TeacherService {

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private TeacherAnnouncementRepository announcementRepository;

  @Autowired
  private AssignmentRepository assignmentRepository;

  @Autowired
  private SubmissionRepository submissionRepository;

  @Autowired
  private ExamResultRepository examResultRepository;

  @Autowired
  private MessageRepository messageRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Autowired
  private studentAttendanceRepository studentAttendanceRepository;

  @Autowired
  private TeacherRepository repository;

  public Teacher register(Teacher teacher) {
    return repository.save(teacher);
  }

  public List<Teacher> findAllTeacher() {
    return repository.findAll();
  }

  public Optional<Teacher> findAllByEmail(String email) {
    return repository.findByEmail(email);
  }

  public Optional<Teacher> findteacherbyemail(String email) {
    return repository.findByEmail(email);
  }

  public Optional<Teacher> findTeacherByEmail(String email) {
    return repository.findByEmail(email);
  }

  public Teacher findAllById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User Not Found with id: " + id));
  }

  public List<Map<String, Object>> getClasses(Teacher teacher) {
    List<StudentClass> classes = teacher.getClasses() == null ? List.of() : teacher.getClasses();
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentClass c : classes) {
      long count = studentRepository.findAll().stream()
          .filter(s -> s.getClasses() != null && c.getId() != null
              && c.getId().equals(s.getClasses().getId()))
          .count();
      result.add(Map.of(
          "id", c.getId(),
          "code", c.getGroup() == null ? "" : c.getGroup(),
          "title", (c.getMajor() == null ? "" : c.getMajor()) + " " + (c.getYear() == null ? "" : c.getYear()),
          "schedule", c.getShift() == null ? "" : c.getShift(),
          "students", count,
          "credits", 3));
    }
    return result;
  }

  // ---------- Students (roster) ----------

  public List<Map<String, Object>> getStudents(Teacher teacher) {
    List<StudentClass> classes = teacher.getClasses() == null ? List.of() : teacher.getClasses();
    List<Long> classIds = classes.stream().map(StudentClass::getId).collect(Collectors.toList());
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentAccount s : studentRepository.findAll()) {
      if (s.getClasses() == null || !classIds.contains(s.getClasses().getId())) {
        continue;
      }
      result.add(studentRow(s, null));
    }
    return result;
  }

  // ---------- Students of one class (by join code / group) ----------

  public List<Map<String, Object>> getStudentsByClassCode(String code) {
    String c = code == null ? "" : code.trim();
    List<Long> classIds = studentClassRepository.findByGroup(c).stream()
        .map(StudentClass::getId)
        .collect(Collectors.toList());
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentAccount s : studentRepository.findAll()) {
      if (s.getClasses() == null || s.getClasses().getId() == null || !classIds.contains(s.getClasses().getId())) {
        continue;
      }
      result.add(studentRow(s, c));
    }
    return result;
  }

  private Map<String, Object> studentRow(StudentAccount s, String classCode) {
    List<StudentAttendance> att = classCode == null || classCode.isBlank()
        ? (s.getAttendance() == null ? List.of() : s.getAttendance())
        : studentAttendanceRepository.findByStudentsIdAndClassCode(s.getId(), classCode);
    long present = att.stream().filter(StudentAttendance::isPresent).count();
    int pct = att.isEmpty() ? 0 : (int) Math.round(present * 100.0 / att.size());
    return Map.of(
        "id", s.getId(),
        "name", s.getUsername() == null ? s.getEmail() : s.getUsername(),
        "major", s.getMajor() == null ? "" : s.getMajor(),
        "att", pct);
  }

  // ---------- Announcements ----------

  public List<Map<String, Object>> getAnnouncements(Teacher teacher) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (TeacherAnnouncement a : announcementRepository.findByTeacherEmailOrderByIdDesc(teacher.getEmail())) {
      Map<String, Object> m = new HashMap<>();
      m.put("id", a.getId());
      m.put("title", a.getTitle() == null ? "" : a.getTitle());
      m.put("body", a.getMessage() == null ? "" : a.getMessage());
      m.put("date", a.getCreateAt() == null ? "" : a.getCreateAt().toString().substring(0, 10));
      result.add(m);
    }
    return result;
  }

  public Map<String, Object> postAccountcement(Teacher teacher, List<Map<String, Object>> entries) {
    String title = "";
    String body = "";
    if (entries != null && !entries.isEmpty()) {
      title = String.valueOf(entries.get(0).getOrDefault("title", ""));
      body = String.valueOf(entries.get(0).getOrDefault("body", ""));
    }
    TeacherAnnouncement a = new TeacherAnnouncement();
    a.setTeacherEmail(teacher.getEmail());
    a.setTitle(title);
    a.setMessage(body);
    TeacherAnnouncement saved = announcementRepository.save(a);
    return Map.of(
        "id", saved.getId(),
        "title", saved.getTitle() == null ? "" : saved.getTitle(),
        "body", saved.getMessage() == null ? "" : saved.getMessage(),
        "date", saved.getCreateAt() == null ? "" : saved.getCreateAt().toString().substring(0, 10));
  }

  public void deleteAnnouncementById(Long id) {
    announcementRepository.findById(id).ifPresent(a -> {
      a.setActive(false);
      announcementRepository.save(a);
    });
  }

  // ---------- Attendance ----------

  public int saveAttendance(List<Map<String, Object>> entries) {
    int saved = 0;
    if (entries != null) {
      for (Map<String, Object> e : entries) {
        Object sid = e.get("studentId");
        if (sid == null) {
          continue;
        }
        Optional<StudentAccount> st = studentRepository.findById(Long.valueOf(sid.toString()));
        if (st.isEmpty()) {
          continue;
        }
        StudentAttendance att = new StudentAttendance();
        att.setStudents(st.get());
        att.setPresent(!"absent".equalsIgnoreCase(String.valueOf(e.getOrDefault("status", "present"))));
        att.setAttendance(1L);
        att.setClassCode(String.valueOf(e.getOrDefault("classCode", "")));
        att.setAttDate(String.valueOf(e.getOrDefault("date", "")));
        try {
          studentAttendanceRepository.save(att);
          saved++;
        } catch (Exception ex) {
          // skip a single failing row
        }
      }
    }
    return saved;
  }

  // ---------- Grades ----------

  public int saveGrades(List<Map<String, Object>> entries) {
    int saved = 0;
    if (entries != null) {
      for (Map<String, Object> e : entries) {
        Object sid = e.get("studentId");
        Object score = e.get("score");
        if (sid == null || score == null) {
          continue;
        }
        Optional<StudentAccount> st = studentRepository.findById(Long.valueOf(sid.toString()));
        if (st.isEmpty()) {
          continue;
        }
        com.ciu.sys.Model.ExamResult r = new com.ciu.sys.Model.ExamResult();
        r.setStudentEmail(st.get().getEmail());
        r.setTeacherEmail("");
        r.setCode(String.valueOf(e.getOrDefault("classCode", "")));
        r.setScore(Double.parseDouble(score.toString()));
        r.setMark(Double.parseDouble(score.toString()));
        try {
          examResultRepository.save(r);
          saved++;
        } catch (Exception ex) {
          // skip a single failing row
        }
      }
    }
    return saved;
  }

  // ---------- Assignments ----------

  public List<Map<String, Object>> getAssignments(Teacher teacher) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (com.ciu.sys.Model.Assignment a : assignmentRepository.findByTeacherEmail(teacher.getEmail())) {
      Map<String, Object> m = new HashMap<>();
      m.put("id", a.getId());
      m.put("code", a.getCourseCode() == null ? "" : a.getCourseCode());
      m.put("title", a.getTitle() == null ? "" : a.getTitle());
      m.put("due", a.getDueDate() == null ? "" : a.getDueDate().toString());
      m.put("submissions", submissionRepository.findByAssignmentId(a.getId()).size());
      result.add(m);
    }
    return result;
  }

  public Map<String, Object> createAssignment(Teacher teacher, Map<String, String> body) {
    com.ciu.sys.Model.Assignment a = new com.ciu.sys.Model.Assignment();
    a.setCourseCode(body.getOrDefault("code", ""));
    a.setTitle(body.getOrDefault("title", ""));
    a.setTeacherEmail(teacher.getEmail());
    if (body.get("due") != null && !body.get("due").isBlank()) {
      a.setDueDate(java.time.LocalDate.parse(body.get("due")));
    }
    com.ciu.sys.Model.Assignment saved = assignmentRepository.save(a);
    return Map.of(
        "id", String.valueOf(saved.getId()),
        "code", saved.getCourseCode() == null ? "" : saved.getCourseCode(),
        "title", saved.getTitle() == null ? "" : saved.getTitle(),
        "due", saved.getDueDate() == null ? "" : saved.getDueDate().toString(),
        "submissions", String.valueOf(0));
  }

  public void deleteAssignment(Long id) {
    assignmentRepository.findById(id).ifPresent(a -> {
      a.setActive(false);
      assignmentRepository.save(a);
    });
  }

  // ---------- Messages ----------

  public List<Map<String, Object>> getMessages(Teacher teacher) {
    String email = teacher.getEmail();
    List<Map<String, Object>> result = new ArrayList<>();
    for (Message m : messageRepository.findByReceiverEmail(email)) {
      result.add(Map.of(
          "id", m.getId(),
          "from", m.getSenderEmail() == null ? "" : m.getSenderEmail(),
          "course", "General",
          "text", m.getContent() == null ? "" : m.getContent(),
          "time", m.getCreateAt() == null ? "" : m.getCreateAt(),
          "mine", false));
    }
    for (Message m : messageRepository.findBySenderEmailAndReceiverEmail(email, "")) {
      result.add(Map.of(
          "id", m.getId(),
          "from", email,
          "course", "General",
          "text", m.getContent() == null ? "" : m.getContent(),
          "time", m.getCreateAt() == null ? "" : m.getCreateAt(),
          "mine", true));
    }
    return result;
  }

  public Map<String, Object> sendMessage(Teacher teacher, Map<String, String> body) {
    Message m = new Message();
    m.setSenderEmail(teacher.getEmail());
    m.setSenderRole("TEACHER");
    m.setReceiverEmail("");
    m.setContent(body.getOrDefault("text", ""));
    m.setCreateAt(java.time.LocalDateTime.now().toString());
    Message saved = messageRepository.save(m);
    return Map.of(
        "id", saved.getId(),
        "course", body.getOrDefault("course", "General"),
        "text", saved.getContent() == null ? "" : saved.getContent(),
        "time", saved.getCreateAt() == null ? "" : saved.getCreateAt(),
        "mine", true);
  }

  // ---------- Notifications ----------

  public List<Map<String, Object>> getNotifications() {
    List<Map<String, Object>> result = new ArrayList<>();
    for (Notification n : notificationRepository.findByTargetRoleIn(List.of("TEACHER", "ALL"))) {
      Map<String, Object> m = new HashMap<>();
      m.put("id", n.getId());
      m.put("title", n.getTitles() == null ? "" : n.getTitles());
      m.put("body", n.getMessage() == null ? "" : n.getMessage());
      m.put("date", n.getCreaeteAt() == null ? "" : n.getCreaeteAt());
      m.put("read", n.isRead());
      result.add(m);
    }
    return result;
  }

  // ---------- Join class ----------

  public Map<String, Object> joinClass(Teacher teacher, String code) {

    String c = code == null ? "" : code.trim();
    if (c.isBlank()) {
      return Map.of("message", "Enter a class code.", "joined", false);
    }

    StudentClass cls = studentClassRepository.findByGroup(c).stream().findFirst().orElse(null);
    if (cls != null) {
      cls.setTeacher(teacher);
      studentClassRepository.save(cls);
      return Map.of("message", "Class joined successfully.", "joined", true);
    }

    List<Schedule> rows = scheduleRepository.findActive().stream()
        .filter(s -> c.equals(s.getJoinCode()))
        .collect(Collectors.toList());
    if (rows.isEmpty()) {
      return Map.of("message", "No class found for that code.", "joined", false);
    }

    boolean owned = rows.stream().anyMatch(s -> teacherOwns(s, teacher));
    if (!owned) {
      return Map.of("message", "This class is assigned to another teacher.", "joined", false);
    }

    Schedule s = rows.stream().filter(row -> teacherOwns(row, teacher)).findFirst().orElse(rows.get(0));
    StudentClass newCls = new StudentClass();
    newCls.setGroup(c);
    newCls.setMajor(s.getMajor());
    newCls.setYear(s.getLevel());
    newCls.setTeacher(teacher);
    studentClassRepository.save(newCls);
    return Map.of("message", "Class joined successfully.", "joined", true);
  }

  private boolean teacherOwns(Schedule s, Teacher teacher) {
    String t = s.getTeacher() == null || s.getTeacher().isBlank() ? s.getInstructor() : s.getTeacher();
    return t != null && !t.isBlank() && t.equalsIgnoreCase(teacher.getEmail());
  }
}
