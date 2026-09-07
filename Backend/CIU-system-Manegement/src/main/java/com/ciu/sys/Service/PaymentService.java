package com.ciu.sys.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Payment;
import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Repository.PaymentRepository;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentClassRepository;
import com.ciu.sys.Repository.StudentRepository;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private TuitionService tuitionService;

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @Autowired
  private StudentRepository studentRepository;

  public Payment paymentInstitute(Payment payment) {

    return paymentRepository.save(payment);
  }

  public Map<String, Object> portalLookup(StudentAccount student) {

    Map<String, Object> q = tuitionService.quote(student);
    int nextYear = (int) q.get("nextYear");
    int nextSem = (int) q.get("nextSemester");

    boolean paid = paymentRepository.findAll().stream()
        .anyMatch(p -> p.getStudentId() != null && p.getStudentId().equals(student.getId())
            && "TUITION".equalsIgnoreCase(p.getType()));

    StudentClass cls = matchClass(student.getMajor(), student.getDegree(), student.getField(), nextYear, nextSem);
    Schedule sched = cls == null ? null : scheduleRepository.findByJoinCode(cls.getGroup())
        .orElse(null);

    Map<String, Object> out = new java.util.HashMap<>();
    out.put("studentId", student.getId());
    out.put("username", student.getUsername() == null ? "" : student.getUsername());
    out.put("major", student.getMajor() == null ? "" : student.getMajor());
    out.put("degree", student.getDegree() == null ? "" : student.getDegree());
    out.put("field", student.getField() == null ? "" : student.getField());
    out.put("year", student.getYear());
    out.put("semester", student.getSemester());
    out.put("classLabel", classTitle(student));
    out.put("nextLabel", sched != null ? scheduleTitle(sched)
        : "Year " + nextYear + " Semester " + nextSem);
    out.put("price", q.get("total"));
    out.put("passed", q.get("passed"));
    out.put("paid", paid);
    out.put("scheduleReady", cls != null);
    return out;
  }

  public Map<String, Object> portalPayment(StudentAccount student, Double amount, String type) {

    String t = type == null || type.trim().isEmpty() ? "TUITION" : type.trim().toUpperCase();

    if ("TUITION".equalsIgnoreCase(t)) {

      Map<String, Object> q = tuitionService.quote(student);
      int nextYear = (int) q.get("nextYear");
      int nextSem = (int) q.get("nextSemester");

      boolean paid = paymentRepository.findAll().stream()
          .anyMatch(p -> p.getStudentId() != null && p.getStudentId().equals(student.getId())
              && "TUITION".equalsIgnoreCase(p.getType()));

      StudentClass cls = matchClass(student.getMajor(), student.getDegree(), student.getField(), nextYear, nextSem);

      if (cls == null) {
        return Map.of("error", true,
            "message", "Your next class has not been created yet. Payment cannot be accepted.");
      }
      if (paid) {
        return Map.of("error", true,
            "message", "Tuition for this semester has already been paid.");
      }

      Payment p = new Payment();
      p.setAmount(amount != null ? amount : ((Number) q.get("total")).doubleValue());
      p.setStudentId(student.getId());
      p.setType("TUITION");
      p.setDate(new java.sql.Date(System.currentTimeMillis()));
      paymentRepository.save(p);

      student.setClasses(cls);
      student.setYear(nextYear);
      student.setSemester(nextSem);
      student.setDegree(cls.getDegree());
      student.setField(cls.getField());
      studentRepository.save(student);

      return Map.of(
          "ok", true,
          "message", "Payment successful.",
          "joinCode", cls.getGroup() == null ? "" : cls.getGroup(),
          "nextLabel", scheduleTitle(cls));
    }

    Payment p = new Payment();
    p.setAmount(amount != null ? amount : 0);
    p.setStudentId(student.getId());
    p.setType(t);
    p.setDate(new java.sql.Date(System.currentTimeMillis()));
    paymentRepository.save(p);
    return Map.of("ok", true, "message", "Payment successful.");
  }

  public Map<String, Object> payTuition(StudentAccount student) {

    Map<String, Object> q = tuitionService.quote(student);
    int nextYear = (int) q.get("nextYear");
    int nextSem = (int) q.get("nextSemester");

    Payment p = new Payment();

    p.setAmount(((Number) q.get("total")).doubleValue());
    p.setStudentId(student.getId());
    p.setType("TUITION");
    p.setDate(new java.sql.Date(System.currentTimeMillis()));
    paymentRepository.save(p);

    StudentClass cls = matchClass(student.getMajor(), student.getDegree(), student.getField(), nextYear, nextSem);

    if (cls != null) {
      student.setClasses(cls);
      student.setYear(nextYear);
      student.setSemester(nextSem);
      if ((student.getDegree() == null || student.getDegree().isBlank())
          && cls.getDegree() != null) {
        student.setDegree(cls.getDegree());
      }
      studentRepository.save(student);
    }
    return q;
  }

  public StudentClass matchClass(String major, String degree, String field, int year, int semester) {

    String level = "Year " + year;
    String sem = "Semester " + semester;
    List<Schedule> candidates = scheduleRepository.findActive().stream()
        .filter(s -> Objects.equals(s.getLevel(), level))
        .filter(s -> Objects.equals(s.getSemester(), sem))
        .filter(s -> TuitionService.sameProgram(s.getMajor(), major))
        .filter(s -> matchesDegree(s.getDegree(), degree))
        .filter(s -> matchesField(s.getField(), field))
        .filter(s -> s.getJoinCode() != null && !s.getJoinCode().isBlank())
        .toList();

    // Prefer the field the student is in; otherwise fall back to any class of this
    // major/degree/semester so legacy students still resolve a next class.
    Schedule chosen = candidates.stream()
        .filter(s -> !isBlank(s.getField()))
        .findFirst()
        .orElse(null);
    if (chosen == null && !candidates.isEmpty())
      chosen = candidates.get(0);
    if (chosen == null)
      return null;

    return studentClassRepository.findByGroup(chosen.getJoinCode())
        .stream().findFirst().orElse(null);
  }

  private boolean matchesDegree(String scheduleDegree, String studentDegree) {
    boolean hasSchedule = scheduleDegree != null && !scheduleDegree.isBlank();
    boolean hasStudent = studentDegree != null && !studentDegree.isBlank();
    if (!hasSchedule)
      return true; // legacy rows without a degree match any student
    if (!hasStudent)
      return true; // student without a degree matches any class
    return scheduleDegree.trim().equalsIgnoreCase(studentDegree.trim());
  }

  private boolean matchesField(String scheduleField, String studentField) {
    boolean hasSchedule = scheduleField != null && !scheduleField.isBlank();
    boolean hasStudent = studentField != null && !studentField.isBlank();
    if (!hasSchedule)
      return true;
    if (!hasStudent)
      return true;
    return scheduleField.trim().equalsIgnoreCase(studentField.trim());
  }

  private boolean isBlank(String v) {
    return v == null || v.trim().isEmpty();
  }

  private String classTitle(StudentAccount student) {
    String degree = nz(student.getDegree());
    String field = nz(student.getField());
    String name = !degree.isBlank() && !field.isBlank() ? degree + " " + field
        : !field.isBlank() ? field
        : !degree.isBlank() ? degree
        : nz(student.getMajor());
    return name + " Year " + student.getYear() + " Semester " + student.getSemester();
  }

  private String scheduleTitle(Schedule s) {
    String degree = nz(s.getDegree());
    String field = nz(s.getField());
    String name = !degree.isBlank() && !field.isBlank() ? degree + " " + field
        : !field.isBlank() ? field
        : !degree.isBlank() ? degree
        : nz(s.getMajor());
    return name + " " + nz(s.getLevel()) + " " + nz(s.getSemester());
  }

  private String scheduleTitle(StudentClass c) {
    String degree = nz(c.getDegree());
    String field = nz(c.getField());
    String name = !degree.isBlank() && !field.isBlank() ? degree + " " + field
        : !field.isBlank() ? field
        : !degree.isBlank() ? degree
        : nz(c.getMajor());
    return name + " " + nz(c.getYear());
  }

  private String nz(String v) {
    return v == null ? "" : v;
  }
}
