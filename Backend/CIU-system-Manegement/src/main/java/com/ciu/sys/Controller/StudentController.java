package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

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
import com.ciu.sys.Model.Student;
import com.ciu.sys.Service.StudentService;

import jakarta.persistence.AttributeOverrides;

@RestController
@RequestMapping("/api/auth/students")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register/account")
  public ResponseEntity<?> studentRegisterAccount(@RequestBody StudentDto request) {
    Student student = new Student();
    student.setUsername(request.username());
    student.setPassword(passwordEncoder.encode(request.password()));
    student.setEmail(request.email());
    student.setPhone(request.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "Account created successfully"));
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateStudentById(@PathVariable Long id, @RequestBody StudentDto dto) {
    Student student = studentService.findStudentById(id);
    student.setUsername(dto.username());
    student.setEmail(dto.email());
    student.setPhone(dto.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "update successfully"));

  }

  @GetMapping
  public ResponseEntity<List<StudentDto>> listAllStudent() {
    List<Student> students = studentService.findAllStudent();
    List<StudentDto> dto = students.stream()
        .map(s -> new StudentDto(s.getUsername(), s.getEmail(), s.getPassword(), s.getPhone()))
        .toList();

    return ResponseEntity.ok(dto);

  }

  @GetMapping("/{id}")
  public StudentDto listStudentById(@PathVariable Long id) {
    Student student = studentService.findStudentById(id);
    return new StudentDto(
        student.getUsername(),
        student.getEmail(),
        student.getPhone());
  }

}
