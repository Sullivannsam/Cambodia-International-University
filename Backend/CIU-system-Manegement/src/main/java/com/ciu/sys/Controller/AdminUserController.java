package com.ciu.sys.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.UserDto;
import com.ciu.sys.Model.User;
import com.ciu.sys.Repository.UserRepository;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

  @Autowired
  private UserRepository userRepo;

  @Autowired
  private UserService userService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/import")
  public ResponseEntity<Map<String, Object>> importUsers(@RequestBody List<Map<String, String>> rows) {

    int create = 0, skipped = 0;

    if (rows == null) {

      return ResponseEntity.badRequest().body(Map.of("message", "No rows provide"));
    }

    for (Map<String, String> row : rows) {

      String email = row.get("email");

      if (email == null || email.isBlank() || userRepo.findByEmail(email) != null) {
        skipped++;
        continue;

      }

      User u = new User();

      u.setUsername(row.getOrDefault("username", email));
      u.setEmail(email);
      String raw = row.getOrDefault("password", "123456");
      u.setPassword(raw.length() < 6 ? "123456" : passwordEncoder.encode(raw));
      u.setAddress(row.getOrDefault("address", ""));
      u.setRole(row.getOrDefault("role", "STUDENT"));
      u.setCourse(row.getOrDefault("course", ""));
      u.setPhone(row.getOrDefault("phone", ""));
      u.setActive(Boolean.parseBoolean(row.getOrDefault("isActive", "true")));
      u.setSuspended(false);
      u.setCreateAt(LocalDateTime.now().toString());
      u.setSuspendedMessage(null);

      userService.register(u);
      create++;

    }

    return ResponseEntity.ok(Map.of("create", create, "skipped", skipped));
  }

  @GetMapping("/export")
  public ResponseEntity<List<UserDto>> exportUsers() {
    return ResponseEntity.ok(userService.getListUser());
  }

}
