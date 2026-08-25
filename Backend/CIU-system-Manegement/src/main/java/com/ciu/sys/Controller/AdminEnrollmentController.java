package com.ciu.sys.admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.enrollment.StudentEnrollment;
import com.ciu.sys.repository.Enroll.StudentEnrollmentRepository;
import com.ciu.sys.student.StudentService;

@RestController
@RequestMapping("/api/auth/admin/enrollments")
public class AdminEnrollmentController {

  @Autowired
  private StudentService service;

  @Autowired
  private StudentEnrollmentRepository repo;

  @GetMapping
  public List<Map<String, Object>> list() {
    return repo.findAll().stream().map(e -> Map.<String, Object>of(
        "id", e.getId(),
        "name", e.getStudent() != null ? e.getStudent().getUsername() : "-",
        "studentId", e.getStudent() != null ? e.getStudent().getId() : 0,
        "course", e.getCourseTitle() != null ? e.getCourseTitle() : "",
        "courseCode", e.getCourseCode(),
        "date", e.getDate() != null ? e.getDate().toString() : "",
        "status", e.getStatus())).toList();
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> setStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
    StudentEnrollment s = repo.findById(id).orElse(null);
    if (s == null) {
      return ResponseEntity.noContent().build();
    }

    String e = body.get("status");

    if (!List.of("APPROVED", "PENDING", "REJECTED").contains(e)) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid Status"));
    }

    s.setStatus(e);
    repo.save(s);

    return ResponseEntity.ok(Map.of("message", "Status Update"));

  }

}
