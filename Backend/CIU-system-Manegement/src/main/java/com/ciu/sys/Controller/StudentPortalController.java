package com.ciu.sys.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.StudentRepository;

@RestController
@RequestMapping("/api/students")
public class StudentPortalController {

  @Autowired
  private StudentRepository repository;

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
    Optional<StudentAccount> me = repository.findByEmail(auth.getName()); // your repo
    return me.<ResponseEntity<?>>map(s -> ResponseEntity.ok(Map.of(
        "year", s.getYear(),
        "semester", s.getSemester())))
        .orElseGet(() -> ResponseEntity.noContent().build());
  }

}
