package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.AdminDto;
import com.ciu.sys.Model.Admin;
import com.ciu.sys.Service.AdminService;

@RestController
@RequestMapping("/api/auth")
public class AdminController {

  @Autowired
  private AdminService adminService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PreAuthorize("hasRole ('ADMIN')")
  @GetMapping("/admin/{id}")

  public Admin getAdminById(@PathVariable Long id) {
    return adminService.getAdminById(id);
  }

  @PreAuthorize("hasRole ('ADMIN')")
  @GetMapping
  public List<Admin> getListAdmins() {
    return adminService.getListAdmins();
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

  @PostMapping("/register/admin")
  public ResponseEntity<?> adminRegister(@RequestBody AdminDto request) {

    try {
      Admin admin = new Admin();
      admin.setUsername(request.username());
      admin.setEmail(request.email());
      admin.setPassword(passwordEncoder.encode(request.password()));
      admin.setRole(request.role());

      adminService.adminRegisterAccount(admin);
      return ResponseEntity.ok(Map.of("message", "Admin registered successfully"));

    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email already exist!"));
    }
  }

  @PreAuthorize("hasRole ('ADMIN')")
  @PutMapping("/{id}")
  public Admin updateAdminById(@PathVariable Long id, @RequestBody Admin updateAdmin) {
    return adminService.updateAdminById(updateAdmin);
  }

  @PreAuthorize("hasRole ('ADMIN')")
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Admin> deleteAdminById(@PathVariable Long id) {
    Admin getAdmin = adminService.deleteAdminById(id);

    if (getAdmin != null) {
      return new ResponseEntity<>(getAdmin, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

}
