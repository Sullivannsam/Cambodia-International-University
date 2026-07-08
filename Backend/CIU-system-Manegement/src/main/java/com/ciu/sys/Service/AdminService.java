package com.ciu.sys.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Admin;
import com.ciu.sys.Repository.AdminRepository;
import com.ciu.sys.exception.ResourceNotFoundException;

@Service
public class AdminService {

  @Autowired
  private AdminRepository adminRepository;

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
    adminRepository.deleteById(id);
    return null;
  }

  public Admin authenticate(String email, String password) {
    Admin admin = adminRepository.findByEmail(email).orElse(null);
    if (admin != null && admin.getPassword().equals(password) && "ADMIN".equals(admin.getRole())) {
      return admin;
    }
    return null;
  }
}
