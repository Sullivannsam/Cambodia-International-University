package com.ciu.sys.controller.teacher;

import java.util.List;
import java.util.Map;

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
import com.ciu.sys.dto.teacher.TeacherRequestDto;
import com.ciu.sys.dto.teacher.TeacherResponseDto;
import com.ciu.sys.model.teacher.Teacher;
import com.ciu.sys.service.Jwt.JwtService;
import com.ciu.sys.service.teacher.TeacherService;
import com.ciu.sys.common.ResourceNotFoundException;

@RestController
@RequestMapping("/api/auth/teacher")
public class TeacherAccountController {

  @Autowired
  private JwtService jwtService;

  @Autowired
  private TeacherService teacherService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/login/account")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    Teacher found = teacherService.findAllByEmail(request.email())
        .orElseThrow(() -> new ResourceNotFoundException("Account Not Found"));
    if (passwordEncoder.matches(request.password(), found.getPassword())) {
      return ResponseEntity.ok(Map.of(
          "token", jwtService.generateToken(found.getEmail(), "TEACHER"),
          "message", "Login Successfully",
          "email", found.getEmail(),
          "username", found.getUsername(),
          "role", "TEACHER"));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credential"));
    }
  }

  @PostMapping("/register/account")
  public ResponseEntity<?> teacherRegisterAccount(
      @RequestBody TeacherRequestDto request) {
    Teacher teacher = new Teacher();
    teacher.setUsername(request.username());
    teacher.setEmail(request.email());
    teacher.setPassword(passwordEncoder.encode(request.password()));
    teacher.setPhone(request.phone());

    teacherService.register(teacher);
    return ResponseEntity.ok(Map.of("message", "Register Account Successfully"));
  }

  @PutMapping("/update/account/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TeacherRequestDto request) {
    Teacher teacher = teacherService.findAllById(id);
    teacher.setUsername(request.username());
    teacher.setEmail(request.email());
    teacher.setPassword(passwordEncoder.encode(request.password()));
    teacher.setPhone(request.phone());

    teacherService.register(teacher);
    return ResponseEntity.ok(Map.of("message", "Update Successfully"));
  }

  @GetMapping("/list")
  public ResponseEntity<?> listTeacher() {
    List<Teacher> teacher = teacherService.findAllTeacher();
    List<TeacherResponseDto> found = teacher.stream()
        .map(s -> new TeacherResponseDto(
            s.getId(),
            s.getUsername(),
            s.getEmail(),
            s.getPhone(),
            s.getRole(),
            s.isActive(),
            s.getDate()))
        .toList();
    return ResponseEntity.ok(found);

  }

  @GetMapping("/{id}")
  public ResponseEntity<?> findAllById(@PathVariable Long id) {
    Teacher found = teacherService.findAllById(id);
    return ResponseEntity.ok(Map.of(
        "message", "Found",
        "username", found.getUsername(),
        "email", found.getEmail(),
        "phone", found.getPhone(),
        "role", found.getRole(),
        "isActive", found.isActive(),
        "date", found.getDate()));
  }
}
