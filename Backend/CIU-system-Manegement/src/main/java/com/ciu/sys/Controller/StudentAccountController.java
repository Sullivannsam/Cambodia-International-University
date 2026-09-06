package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.common.LoginRequest;
import com.ciu.sys.Service.JwtService;
import com.ciu.sys.Dto.StudentRequestDto;
import com.ciu.sys.Dto.StudentResponse;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Service.StudentService;

@RestController
@RequestMapping("/api/auth/students")
public class StudentAccountController {

  @Autowired
  private JwtService jwtService;

  @Autowired
  private StudentService studentService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register/account")
  public ResponseEntity<?> studentRegisterAccount(@RequestBody StudentRequestDto request) {

    if (request.username() == null && request.password() == null && request.email() == null
        || request.phone() == null) {

      return ResponseEntity.badRequest().body(Map.of("message", "All field are required"));

    } else if (request.password().length() < 6) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
          .body(Map.of("message", "Password must at least 6 characters"));

    }

    StudentAccount account = new StudentAccount();
    account.setUsername(request.username());
    account.setPassword(passwordEncoder.encode(request.password()));
    account.setEmail(request.email());
    account.setPhone(request.phone());
    account.setRole("STUDENT");
    account.setActive(true);

    studentService.studentRegisterAccount(account);

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Account create successfully"));
  }

  @PostMapping("/login/account")
  public ResponseEntity<?> studentLogin(@RequestBody LoginRequest request) {

    Optional<StudentAccount> found = studentService.findByEmail(request.email());

    if (found.isPresent()
        && passwordEncoder.matches(request.password(), found.get().getPassword())
        && found.get().isActive()) {

      return ResponseEntity.ok(Map.of(
          "token", jwtService.generateToken(found.get().getEmail(), "STUDENT"),
          "message", "Login successfully",
          "email", found.get().getEmail(),
          "role", "STUDENT"));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credentials"));
    }

  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateStudentById(@PathVariable Long id, @RequestBody StudentRequestDto dto) {

    StudentAccount student = studentService.findStudentById(id);
    student.setUsername(dto.username());
    student.setPassword(passwordEncoder.encode(dto.password()));
    student.setEmail(dto.email());
    student.setPhone(dto.phone());

    studentService.studentRegisterAccount(student);
    return ResponseEntity.ok(Map.of("message", "update successfully"));

  }

  @GetMapping
  public ResponseEntity<List<StudentResponse>> listAllStudent() {

    List<StudentAccount> students = studentService.findAllStudent();

    List<StudentResponse> dto = students.stream()
        .map(s -> new StudentResponse(
            s.getId(),
            s.getUsername(),
            s.getEmail(),
            s.getPhone(),
            s.getRole(),
            s.isActive(),
            s.getDate(),
            s.getMajor(),
            s.getAddress(),
            s.getCardCode(),
            s.getPhotoUrl(),
            toClassMap(s)))
        .toList();

    return ResponseEntity.ok(dto);

  }

  @GetMapping("/{id}")
  public StudentResponse listStudentById(@PathVariable Long id) {

    StudentAccount student = studentService.findStudentById(id);
    return new StudentResponse(
        student.getId(),
        student.getUsername(),
        student.getEmail(),
        student.getPhone(),
        student.getRole(),
        student.isActive(),
        student.getDate(),
        student.getMajor(),
        student.getAddress(),
        student.getCardCode(),
        student.getPhotoUrl(),
        toClassMap(student));
  }

  private Map<String, Object> toClassMap(StudentAccount s) {
    if (s.getClasses() == null) {
      return null;
    }
    com.ciu.sys.Model.StudentClass c = s.getClasses();
    return Map.of(
        "id", c.getId(),
        "code", c.getGroup() == null ? "" : c.getGroup(),
        "title", (c.getMajor() == null ? "" : c.getMajor())
            + " " + (c.getYear() == null ? "" : c.getYear()));
  }

}
