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

import com.ciu.sys.common.LoginRequest;
import com.ciu.sys.Service.JwtService;
import com.ciu.sys.Dto.AdminRegister;
import com.ciu.sys.Model.Admin;
import com.ciu.sys.Service.AdminService;

@RestController
@RequestMapping("/api/auth")
public class AdminController {

  @Autowired
  private JwtService jwtService;

  @Autowired
  private AdminService adminService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @GetMapping("/admin/{id}")
  public Admin getAdminById(@PathVariable Long id) {
    return adminService.getAdminById(id);
  }

  @GetMapping("/account/admin")
  public List<Admin> getListAdmins() {
    return adminService.getListAdmins();
  }

  @PostMapping("/login/admin")
  public ResponseEntity<Map<String, String>> adminLogin(@RequestBody LoginRequest request) {
    Admin found = adminService.authenticate(request.email(), request.password());
    if (found != null) {
      return ResponseEntity.ok(Map.of(
          "token", jwtService.generateToken(found.getEmail(), "ADMIN"),
          "message", "Admin Login Successful!",
          "email", found.getEmail(),
          "username", found.getUsername(),
          "role", "ADMIN"));
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
  }

  @PostMapping("/register/admin")
  public ResponseEntity<?> adminRegisteration(@RequestBody AdminRegister request) {

    if (request.username() == null || request.email() == null || request.password() == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "All field are required"));

    } else if (adminService.findAccountByEmail(request.email()) != null) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already register"));

    }
    Admin admin = new Admin();
    admin.setUsername(request.username());
    admin.setEmail(request.email());
    admin.setPassword(passwordEncoder.encode(request.password()));
    admin.setRole("ADMIN");
    adminService.save(admin);

    return ResponseEntity.ok(Map.of("message", "Admin registeration successful"));

  }

  @PreAuthorize("hasRole ('ADMIN')")
  @PutMapping("/{id}")
  public Admin updateAdminById(@PathVariable Long id, @RequestBody Admin updateAdmin) {
    updateAdmin.setId(id);
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
