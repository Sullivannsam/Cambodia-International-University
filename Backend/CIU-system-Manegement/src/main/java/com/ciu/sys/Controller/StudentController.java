package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.StudentDto;
import com.ciu.sys.Model.Student;
import com.ciu.sys.Service.StudentService;

@RestController
@RequestMapping("/api/auth/students")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @PostMapping("/register/account")
  public ResponseEntity<?> studentRegisterAccount(StudentDto request) {
    Student student = new Student();
    student.setUsername(request.username());
    student.setEmail(request.email());
    student.setRole(request.role());
    student.setActive(request.isActive());
    student.setDate(request.date());
    student.setPhone(request.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "Account created successfully"));

  }

  @GetMapping
  public ResponseEntity<List<StudentDto>> listAllStudent() {
    List<Student> students = studentService.findAllStudent();
    List<StudentDto> dto = students.stream()
        .map(s -> new StudentDto(s.getUsername(), s.getEmail(), s.getPhone(), s.getRole(), s.isActive(), s.getDate()))
        .toList();

    return ResponseEntity.ok(dto);

  }

}
