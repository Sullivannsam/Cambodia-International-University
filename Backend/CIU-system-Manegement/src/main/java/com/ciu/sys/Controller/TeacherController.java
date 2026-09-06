package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Teacher;
import com.ciu.sys.Service.TeacherService;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

  @Autowired
  private TeacherService service;

  @GetMapping("/classes")
  public ResponseEntity<?> getClass(Authentication auth) {

    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());

    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.getClasses(teacher.get()));
  }

  @GetMapping("/students")
  public ResponseEntity<?> getstudents(Authentication auth) {

    Optional<Teacher> teacher = service.findteacherbyemail(auth.getName());

    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.getStudents(teacher.get()));
  }

  @GetMapping("/announcements")
  public ResponseEntity<?> getAnnouncements(Authentication auth) {

    Optional<Teacher> teacher = service.findteacherbyemail(auth.getName());

    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.getAnnouncements(teacher.get()));
  }

  @PostMapping("/announcements")
  public ResponseEntity<?> postAnnouncemnets(@RequestBody Map<String, Object> entries, Authentication auth) {

    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());

    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();

    }
    return ResponseEntity.ok(service.postAccountcement(teacher.get(), List.of(entries)));
  }

  @DeleteMapping("/announcements/{id}")
  public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {

    service.deleteAnnouncementById(id);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("message", "Delete Successful"));

  }

  @PostMapping("/attendance")
  public ResponseEntity<?> saveAttendance(@RequestBody List<Map<String, Object>> entries) {

    int saved = service.saveAttendance(entries);
    return ResponseEntity.ok(Map.of("Saved", saved));
  }

  @PostMapping("/grades")
  public ResponseEntity<?> submitGrades(@RequestBody List<Map<String, Object>> entries, Authentication auth) {

    Optional<Teacher> teacher = service.findAllByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();

    }
    int saved = service.saveGrades(entries);
    return ResponseEntity.ok(Map.of("saved", saved));
  }

  @GetMapping("/assignments")
  public ResponseEntity<?> getAssignments(Authentication auth) {
    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.getAssignments(teacher.get()));
  }

  @PostMapping("/assignments")
  public ResponseEntity<?> createAssignment(@RequestBody Map<String, String> body,
      Authentication auth) {
    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.createAssignment(teacher.get(), body));
  }

  @DeleteMapping("/assignments/{id}")
  public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
    service.deleteAssignment(id);
    return ResponseEntity.ok(Map.of("deleted", id));
  }

  @GetMapping("/messages")
  public ResponseEntity<?> getMessages(Authentication auth) {
    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.getMessages(teacher.get()));
  }

  @PostMapping("/messages")
  public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> body,
      Authentication auth) {
    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.sendMessage(teacher.get(), body));
  }

  @GetMapping("/notifications")
  public ResponseEntity<?> getNotifications() {
    return ResponseEntity.ok(service.getNotifications());
  }

  @PostMapping("/join")
  public ResponseEntity<?> joinClass(@RequestBody Map<String, String> body,
      Authentication auth) {
    Optional<Teacher> teacher = service.findTeacherByEmail(auth.getName());
    if (teacher.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(service.joinClass(teacher.get(), body.getOrDefault("code", "")));
  }

  @GetMapping("/classes/{code}/students")
  public ResponseEntity<?> getStudentsByClassCode(@PathVariable String code) {
    return ResponseEntity.ok(service.getStudentsByClassCode(code));
  }

}
