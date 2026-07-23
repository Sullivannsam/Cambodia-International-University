package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.StudentDto;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Service.StudentService;

import jakarta.persistence.AttributeOverrides;

@RestController
@RequestMapping("/api/auth/students")
public class StudentAccountController {

  @Autowired
  private StudentService studentService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register/account")
  public ResponseEntity<?> studentRegisterAccount(@RequestBody StudentDto request) {
    StudentAccount student = new StudentAccount();
    student.setUsername(request.username());
    student.setPassword(passwordEncoder.encode(request.password()));
    student.setEmail(request.email());
    student.setPhone(request.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "Account created successfully"));
  }

  @PostMapping("/login/account")
  public ResponseEntity<?> studentLogin(@RequestBody StudentDto request) {
    Optional<StudentAccount> found = studentService.findByEmail(request.email());
    if (found.isPresent() && passwordEncoder.matches(request.password(), found.get().getPassword())) {
      return ResponseEntity.ok(Map.of(
          "token", "student-token",
          "message", "Login successfully",
          "email", found.get().getEmail(),
          "role", "STUDENT"));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credentials"));
    }

  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateStudentById(@PathVariable Long id, @RequestBody StudentDto dto) {
    StudentAccount student = studentService.findStudentById(id);
    student.setUsername(dto.username());
    student.setEmail(dto.email());
    student.setPhone(dto.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "update successfully"));

  }

  @GetMapping
  public ResponseEntity<List<StudentDto>> listAllStudent() {
    List<StudentAccount> students = studentService.findAllStudent();
    List<StudentDto> dto = students.stream()
        .map(s -> new StudentDto(s.getUsername(), s.getEmail(), s.getPassword(), s.getPhone()))
        .toList();

    return ResponseEntity.ok(dto);

  }

  @GetMapping("/{id}")
  public StudentDto listStudentById(@PathVariable Long id) {
    StudentAccount student = studentService.findStudentById(id);
    return new StudentDto(
        student.getUsername(),
        student.getEmail(),
        student.getPhone());
  }

}
