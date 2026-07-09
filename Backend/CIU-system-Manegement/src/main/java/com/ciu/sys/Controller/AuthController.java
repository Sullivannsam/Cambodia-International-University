package com.ciu.sys.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.LoginRequest;
import com.ciu.sys.Dto.RegisterRequest;
import com.ciu.sys.Model.Admin;
import com.ciu.sys.Model.User;
import com.ciu.sys.Service.AdminService;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  UserService userService;

  @Autowired
  AdminService adminService;

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
    boolean ok = userService.authenticate(request.getEmail(), request.getPassword());
    if (ok) {
      return ResponseEntity.ok(Map.of(
          "token", "user-token",
          "message", "Login Successful!",
          "email", request.getEmail()));
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
    userService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "token", "user-token",
        "message", "Register Successfully",
        "email", request.getEmail()));
  }

  @PostMapping("/login/admin")
  public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Admin admin) {
    Admin found = adminService.authenticate(admin.getEmail(), admin.getPassword());
    if (found != null) {
      return ResponseEntity.ok(Map.of(
          "token", "admin-token",
          "message", "Admin Login Successful!",
          "email", found.getEmail(),
          "username", found.getUsername(),
          "role", "ADMIN"));
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
  }
}
