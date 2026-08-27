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

import com.ciu.sys.common.LoginRequest;
import com.ciu.sys.common.RegisterRequest;
import com.ciu.sys.Service.JwtService;
import com.ciu.sys.Service.AdminService;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserFormController {

  @Autowired
  private JwtService jwtService;

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
    User user = userService.findUserByEmail(request.email());
    if (user != null && user.isSuspended()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
          "message", user.getSuspendedMessage() != null ? user.getSuspendedMessage()
              : "Your account has been suspended."));
    }
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.email(), request.password()));

      return ResponseEntity.ok(Map.of(
          "token", jwtService.generateToken(request.email(), "USER"),
          "message", "Login Successful!",
          "email", request.email(),
          "role", "USER"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {

    if (request.username() == null && request.password() == null && request.email() == null
        || request.phone() == null) {

      return ResponseEntity.badRequest().body(Map.of("message", "All field are required"));

    } else if (request.password().length() < 6) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
          .body(Map.of("message", "Password must be at least 6 characters"));

    }

    User user = new User();
    user.setUsername(request.username());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setEmail(request.email());
    user.setPhone(request.phone());
    user.setAddress("");
    user.setRole("USER");
    user.setCourse("");
    user.setActive(true);
    user.setCreateAt(java.time.LocalDateTime.now().toString());

    userService.register(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "token", jwtService.generateToken(request.email(), "USER"),
        "message", "Register Successfully",
        "email", request.email()));
  }

}
