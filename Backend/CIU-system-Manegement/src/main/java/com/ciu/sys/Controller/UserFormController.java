package com.ciu.sys.Controller;

import java.util.Map;

import com.ciu.sys.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.LoginRequest;
import com.ciu.sys.Dto.RegisterRequest;
import com.ciu.sys.Service.AdminService;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserFormController {

  @Autowired
  UserService userService;

  @Autowired
  AdminService adminService;

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  PasswordEncoder passwordEncoder;

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.email(), request.password()));
      return ResponseEntity.ok(Map.of(
          "token", "user-token",
          "message", "Login Successful!",
          "email", request.email()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
    User user = new User();
    user.setUsername(request.username());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setEmail(request.email());
    user.setPhone(request.phone());
    user.setAddress("");
    user.setRole("USER");
    user.setCourse("");
    user.setActive(false);
    user.setCreateAt(java.time.LocalDateTime.now().toString());

    userService.register(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "token", "user-token",
        "message", "Register Successfully",
        "email", request.email()));
  }

}
