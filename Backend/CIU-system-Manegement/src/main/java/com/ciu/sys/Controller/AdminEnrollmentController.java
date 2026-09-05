package com.ciu.sys.Controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Enroll;
import com.ciu.sys.Model.StudentEnrollment;
import com.ciu.sys.Repository.EnrollRepository;
import com.ciu.sys.Repository.StudentEnrollmentRepository;

@RestController
@RequestMapping("/api/auth/admin/enrollments")
public class AdminEnrollmentController {

  @Autowired
  private StudentEnrollmentRepository repo;

  @Autowired
  private EnrollRepository enrollRepository;

  @GetMapping
  public List<Map<String, Object>> list() {

    List<Map<String, Object>> rows = new ArrayList<>();

    repo.findAll().stream().map(e -> Map.<String, Object>of(
        "id", e.getId(),
        "name", e.getStudent() != null ? e.getStudent().getUsername() : "-",
        "studentId", e.getStudent() != null ? e.getStudent().getId() : 0,
        "course", e.getCourseTitle() != null ? e.getCourseTitle() : "",
        "courseCode", e.getCourseCode(),
        "date", e.getDate() != null ? e.getDate().toString() : "",
        "status", e.getStatus())).forEach(rows::add);

    enrollRepository.findAll().forEach(e -> {
      Map<String, Object> row = new LinkedHashMap<>();
      row.put("id", -e.getId());
      row.put("name", trimToNull(e.getFirstNameEN()) + " " + trimToNull(e.getLastNameEN()));
      row.put("studentId", "");
      row.put("course", trimToNull(e.getMajor()));
      row.put("courseCode", trimToNull(e.getDegree()));
      row.put("date", trimToNull(e.getStartDate()));
      row.put("status", e.getStatus() != null ? e.getStatus() : "PENDING");
      row.put("firstNameEN", trimToNull(e.getFirstNameEN()));
      row.put("lastNameEN", trimToNull(e.getLastNameEN()));
      row.put("firstNameKH", trimToNull(e.getFirstNameKH()));
      row.put("lastNameKH", trimToNull(e.getLastNameKH()));
      row.put("age", e.getAge());
      row.put("birthDate", e.getBirthDate() != null ? e.getBirthDate().toString() : "");
      row.put("placeOfBirth", trimToNull(e.getPalceOfBirth()));
      row.put("sex", trimToNull(e.getSex()));
      row.put("nationality", trimToNull(e.getNational()));
      row.put("phone", trimToNull(e.getPhoneNumber()));
      row.put("email", trimToNull(e.getEmail()));
      row.put("major", trimToNull(e.getMajor()));
      row.put("year", trimToNull(e.getYear()));
      row.put("degree", trimToNull(e.getDegree()));
      row.put("startDate", trimToNull(e.getStartDate()));
      rows.add(row);
    });

    return rows;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOne(@PathVariable Long id) {

    if (id < 0) {
      Enroll e = enrollRepository.findById(-id).orElse(null);
      if (e == null) {
        return ResponseEntity.noContent().build();
      }
      Map<String, Object> row = new LinkedHashMap<>();
      row.put("id", -e.getId());
      row.put("name", trimToNull(e.getFirstNameEN()) + " " + trimToNull(e.getLastNameEN()));
      row.put("course", trimToNull(e.getMajor()));
      row.put("courseCode", trimToNull(e.getDegree()));
      row.put("date", trimToNull(e.getStartDate()));
      row.put("status", e.getStatus() != null ? e.getStatus() : "PENDING");
      row.put("firstNameEN", trimToNull(e.getFirstNameEN()));
      row.put("lastNameEN", trimToNull(e.getLastNameEN()));
      row.put("firstNameKH", trimToNull(e.getFirstNameKH()));
      row.put("lastNameKH", trimToNull(e.getLastNameKH()));
      row.put("age", e.getAge());
      row.put("birthDate", e.getBirthDate() != null ? e.getBirthDate().toString() : "");
      row.put("placeOfBirth", trimToNull(e.getPalceOfBirth()));
      row.put("sex", trimToNull(e.getSex()));
      row.put("nationality", trimToNull(e.getNational()));
      row.put("phone", trimToNull(e.getPhoneNumber()));
      row.put("email", trimToNull(e.getEmail()));
      row.put("major", trimToNull(e.getMajor()));
      row.put("year", trimToNull(e.getYear()));
      row.put("degree", trimToNull(e.getDegree()));
      row.put("startDate", trimToNull(e.getStartDate()));
      row.put("khmerNationalIdFile", e.getKhmerNationalIdFile() != null ? e.getKhmerNationalIdFile() : "");
      row.put("photoFile", e.getPhotoFile() != null ? e.getPhotoFile() : "");
      row.put("bacIIPhotoFile", e.getBacIIPhotoFile() != null ? e.getBacIIPhotoFile() : "");
      return ResponseEntity.ok(row);
    }

    StudentEnrollment s = repo.findById(id).orElse(null);
    if (s == null) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(Map.<String, Object>of(
        "id", s.getId(),
        "name", s.getStudent() != null ? s.getStudent().getUsername() : "-",
        "course", s.getCourseTitle() != null ? s.getCourseTitle() : "",
        "courseCode", s.getCourseCode(),
        "date", s.getDate() != null ? s.getDate().toString() : "",
        "status", s.getStatus()));

  }

  @PutMapping("/{id}")
  public ResponseEntity<?> setStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
    String status = body.get("status");

    if (!List.of("APPROVED", "PENDING", "REJECTED").contains(status)) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid Status"));
    }

    if (id < 0) {
      Enroll enroll = enrollRepository.findById(-id).orElse(null);
      if (enroll == null) {
        return ResponseEntity.noContent().build();
      }
      enroll.setStatus(status);
      enrollRepository.save(enroll);
      return ResponseEntity.ok(Map.of("message", "Status Update"));
    }

    StudentEnrollment s = repo.findById(id).orElse(null);
    if (s == null) {
      return ResponseEntity.noContent().build();
    }

    s.setStatus(status);
    repo.save(s);

    return ResponseEntity.ok(Map.of("message", "Status Update"));

  }

  private String trimToNull(String value) {
    return value == null ? "" : value;
  }

}
