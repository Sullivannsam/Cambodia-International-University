package com.ciu.sys.Controller;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Admin;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.AdminRepository;
import com.ciu.sys.Repository.StudentRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

  @Autowired
  private StudentRepository studentRepo;

  @Autowired
  private AdminRepository adminRepo;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JavaMailSender mailSender;

  private final Map<String, Object[]> tokens = new ConcurrentHashMap<>();

  private static final long OTP = 15 * 60 * 1000;

  /**
   * @param body
   * @return
   */
  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
    String email = body.get("email");

    if (email == null || email.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
    }

    String role = null;

    if (studentRepo.findByEmail(email).isPresent()) {
      role = "STUDENT";

    } else if (adminRepo.findByEmail(email).isPresent()) {
      role = "ADMIN";

    } else if (role == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email is not existing"));
    }

    String code = String.format("%06d", new Random().nextInt(1_000_000));
    tokens.put(code, new Object[] { role, email, System.currentTimeMillis() + OTP });

    try {
      SimpleMailMessage msg = new SimpleMailMessage();
      msg.setTo(email);
      msg.setSubject("CIU Password-Reset");
      msg.setText("Your Code: " + code
          + "\n Reset password here: http://localhost:3000/public/reset-password?token=" + code
          + "\n OTP: Invalid in 15 minutes.");

      mailSender.send(msg);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("message", "Reset password could not sent to this Email: " + email));

    }
    return ResponseEntity.status(HttpStatus.ACCEPTED)
        .body(Map.of("message", "Password reset sent successfully to this Email: " + email));
  }

  @PostMapping("/reset-password")
  @Transactional
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {

    String code = body.get("token");
    String password = body.get("password");
    Object[] entry = tokens.get(code);

    if (code == null || code.trim().isEmpty() || password == null || password.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Please field the code and Password"));

    } else if (password.length() < 6) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
          .body(Map.of("message", "Password must be  at least6 characters"));

    } else if (entry == null || System.currentTimeMillis() > (long) entry[2]) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("message", "Invalid OTP expired"));
    }

    String role = (String) entry[0];
    String email = (String) entry[1];
    String encoded = passwordEncoder.encode(password);

    if ("ADMIN".equals(role)) {
      Admin admin = adminRepo.findByEmail(email).orElse(null);

      if (admin == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Account not found"));

      } else {

        admin.setPassword(encoded);
        adminRepo.save(admin);
      }

    } else if ("STUDENT".equals(role)) {
      StudentAccount student = studentRepo.findByEmail(email).orElse(null);

      if (student == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Account not found"));

      } else {

        student.setPassword(encoded);
        student.setActive(true);
        studentRepo.save(student);
      }
    }

    tokens.remove(code);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Reset Password Successfully!"));

  }

}
