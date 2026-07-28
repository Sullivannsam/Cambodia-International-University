package com.ciu.sys.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ciu.sys.model.admin.Admin;
import com.ciu.sys.repository.admin.AdminRepository;

@Configuration
public class DataSeeder {

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Bean
  CommandLineRunner seedAdmin(AdminRepository adminRepo) {
    return args -> {
      if (adminRepo.findByEmail("admin@gmail.com").isEmpty()) {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setEmail("admin@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole("ADMIN");
        adminRepo.save(admin);
      }
    };
  }
}
