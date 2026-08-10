package com.ciu.sys.service.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.admin.Admin;
import com.ciu.sys.repository.admin.AdminRepository;
import com.ciu.sys.common.ResourceNotFoundException;

@Service
public class AdminService {

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public List<Admin> getListAdmins() {
    return adminRepository.findAll();
  }

  public Admin getAdminById(Long id) {
    return adminRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
  }

  public Admin updateAdminById(Admin updateAdmin) {
    return adminRepository.save(updateAdmin);
  }

  public Admin deleteAdminById(Long id) {
    Admin admin = adminRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Admin Not Found" + id));
    adminRepository.delete(admin);
    return admin;

  }

  public Admin authenticate(String email, String password) {
    Admin admin = adminRepository.findByEmail(email).orElse(null);
    if (admin != null && passwordEncoder.matches(password, admin.getPassword()) && "ADMIN".equals(admin.getRole())) {
      return admin;
    }
    return null;
  }
}
