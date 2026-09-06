package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.Repository.NotificationRepository;
import com.ciu.sys.Service.PaymentService;
import com.ciu.sys.Service.StudentPortalService;
import com.ciu.sys.Service.TuitionService;

@RestController
@RequestMapping("/api/students")
public class StudentPortalController {

  @Autowired
  private StudentRepository repository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Autowired
  private StudentPortalService service;

  @Autowired
  private TuitionService tuitionService;

  @Autowired
  private PaymentService paymentService;

  @GetMapping("/profile")
  public ResponseEntity<?> getProfile(Authentication authentication) {
    String email = authentication.getName();

    Optional<StudentAccount> found = repository.findByEmail(email);

    if (found.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    StudentAccount s = found.get();
    return ResponseEntity.ok(Map.of(
        "id", s.getId(),
        "username", s.getUsername() == null ? "" : s.getUsername(),
        "email", s.getEmail(),
        "phone", s.getPhone() == null ? "" : s.getPhone(),
        "role", s.getRole() == null ? "STUDENT" : s.getRole(),
        "isActive", s.isActive()));
  }

  @GetMapping("/card")
  public ResponseEntity<?> getCard(Authentication authentication) {
    Optional<StudentAccount> found = repository.findByEmail(authentication.getName());
    if (found.isEmpty())
      return ResponseEntity.noContent().build();
    StudentAccount s = found.get();
    return ResponseEntity.ok(Map.of(
        "id", s.getId(),
        "username", s.getUsername() == null ? "" : s.getUsername(),
        "email", s.getEmail(),
        "phone", s.getPhone() == null ? "" : s.getPhone(),
        "major", s.getMajor() == null ? "" : s.getMajor(),
        "address", s.getAddress() == null ? "" : s.getAddress(),
        "year", s.getYear(),
        "semester", s.getSemester(),
        "cardCode", s.getCardCode() == null ? String.format("%06d", s.getId()) : s.getCardCode(),
        "photoUrl", s.getPhotoUrl() == null ? "" : s.getPhotoUrl()));
  }

  @GetMapping("/progression")
  public ResponseEntity<?> progression(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    return me.<ResponseEntity<?>>map(s -> ResponseEntity.ok(Map.of(
        "year", s.getYear(),
        "semester", s.getSemester())))
        .orElseGet(() -> ResponseEntity.noContent().build());
  }

  @GetMapping("/notifications")
  public ResponseEntity<?> notifications() {
    List<Map<String, Object>> rows = new java.util.ArrayList<>();
    for (com.ciu.sys.Model.Notification n : notificationRepository.findByTargetRoleIn(List.of("STUDENT", "ALL"))) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("id", n.getId());
      m.put("title", n.getTitles() == null ? "" : n.getTitles());
      m.put("body", n.getMessage() == null ? "" : n.getMessage());
      m.put("date", n.getCreaeteAt() == null ? "" : n.getCreaeteAt());
      m.put("read", n.isRead());
      rows.add(m);
    }
    return ResponseEntity.ok(rows);
  }

  // ---------- Student portal data ----------

  @GetMapping("/enrollments")
  public ResponseEntity<?> enrollments(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getEnrollments(me.get()));
  }

  @GetMapping("/class-info")
  public ResponseEntity<?> classInfo(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.myClass(me.get()));
  }

  @GetMapping("/grades")
  public ResponseEntity<?> grades(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getGrades(me.get()));
  }

  @GetMapping("/announcements")
  public ResponseEntity<?> announcements() {
    return ResponseEntity.ok(service.getAnnouncements());
  }

  @GetMapping("/schedule")
  public ResponseEntity<?> schedule(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getSchedule(me.get()));
  }

  @GetMapping("/attendance")
  public ResponseEntity<?> attendance(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getAttendance(me.get()));
  }

  @GetMapping("/assignments")
  public ResponseEntity<?> assignments(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getAssignments(me.get()));
  }

  @PostMapping("/assignments/submit")
  public ResponseEntity<?> submit(Authentication auth, @RequestBody Map<String, Object> body) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.submitAssignment(me.get(), body));
  }

  @GetMapping("/messages")
  public ResponseEntity<?> messages(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getMessages(me.get()));
  }

  @PostMapping("/messages")
  public ResponseEntity<?> sendMessage(Authentication auth, @RequestBody Map<String, Object> body) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.sendMessage(me.get(), body));
  }

  @GetMapping("/invoices")
  public ResponseEntity<?> invoices(Authentication auth) {
    Optional<StudentAccount> me = repository.findByEmail(auth.getName());
    if (me.isEmpty())
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(service.getInvoices(me.get()));
  }

  @PostMapping("/notifications/read")
  public ResponseEntity<?> markNotificationsRead() {
    return ResponseEntity.ok(Map.of("message", "ok"));
  }

  @PostMapping("/tuition/quote")
  public ResponseEntity<?> tuitionQuote(@RequestBody Map<String, Object> body) {
    Object sid = body.get("studentId");
    if (sid == null)
      return ResponseEntity.badRequest().body(Map.of("error", "studentId required"));
    Optional<StudentAccount> found = repository.findById(Long.valueOf(sid.toString()));
    if (found.isEmpty())
      return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
    return ResponseEntity.ok(tuitionService.quote(found.get()));
  }

  @PostMapping("/tuition/pay")
  public ResponseEntity<?> tuitionPay(Authentication auth) {
    Optional<StudentAccount> students = repository.findByEmail(auth.getName());

    if (students.isEmpty()) {

      return ResponseEntity.noContent().build();
    }

    return ResponseEntity.ok(paymentService.payTuition(students.get()));
  }

  @GetMapping("/my-class")
  public ResponseEntity<?> myClasses(Authentication auth) {

    Optional<StudentAccount> students = repository.findByEmail(auth.getName());
    if (students.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.classStatus(students.get()));
  }

  @PostMapping("/pay-and-join")
  public ResponseEntity<?> payAndJoin(Authentication auth) {

    Optional<StudentAccount> students = repository.findByEmail(auth.getName());
    if (students.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.payAndJoin(students.get()));
  }

  @GetMapping("/class/{code}")
  public ResponseEntity<?> getClassCode(@PathVariable String code) {

    return ResponseEntity.ok(service.classByCode(code));
  }

  @PostMapping("/join")
  public ResponseEntity<?> join(Authentication auth, @RequestBody Map<String, String> body) {

    Optional<StudentAccount> students = repository.findByEmail(auth.getName());
    if (students.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.join(students.get(), body.get("code")));
  }

}
