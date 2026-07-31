package com.ciu.sys.controller.user;

import java.time.LocalDateTime;
import java.util.Map;

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
import com.ciu.sys.service.user.UserService;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
    User user = new User();
    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setPhone(request.phone());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setAddress("");
    user.setCourse("");
    user.setRole("USER");
    user.setActive(false);
    user.setCreateAt(LocalDateTime.now().toString());
    userService.register(user);
    String code = userService.generateCode();
    userService.createVerificationCode(request.email(), code);
    userService.sendVerificationEmail(request.email(), code);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Map.of("message", "Verifiacaton code sent to your email", "email", request.email()));
  }

  @PostMapping("/verify")
  public ResponseEntity<Map<String, String>> getVerify(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String code = body.get("code");
    if (!userService.verifyCode(email, code)) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid Code Expired"));
    }
    User user = userService.findUserByEmail(email);
    user.setActive(true);
    userService.register(user);
    userService.markCodeUsed(email);

    return ResponseEntity.ok(Map.of(
        "token", "user-token",
        "message", "Verified Successfully",
        "email", email,
        "role", user.getRole()));
  }

  @PostMapping("/resend")
  public ResponseEntity<Map<String, String>> resend(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String code = userService.generateCode();
    userService.createVerificationCode(email, code);
    userService.sendVerificationEmail(email, code);
    return ResponseEntity.ok(Map.of("message", "New code sent", "email", email));
  }
}
