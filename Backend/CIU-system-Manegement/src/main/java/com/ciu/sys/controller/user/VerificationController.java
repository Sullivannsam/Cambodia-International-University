package com.ciu.sys.controller.user;

import java.time.LocalDateTime;
import java.util.Map;

import org.apache.catalina.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.common.RegisterRequest;
import com.ciu.sys.model.user.User;
import com.ciu.sys.model.user.Verification;
import com.ciu.sys.service.user.UserService;
import com.ciu.sys.service.user.VerificationService;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private VerificationService verificationService;

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
    User user = new User();
    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setPhone(request.phone());
    user.setPassword(passwordEncoder.encode(request.password());
    user.setAddress("");
    user.setRole("USER");
    user.isActive(false);
    user.setCreateAt(LocalDateTime.now().toString());

    userService.register(user);

    String code = userService.generateCode();
    userService.creteVerificationCode(request.email(), code);
    userService.sentVerificationEmail(request.email(), code);

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
      "message", "Verifiacaton code sent to your email", 
      "email", request.email()));
  }

}
