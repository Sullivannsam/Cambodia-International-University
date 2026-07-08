package com.ciu.sys.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ciu.sys.Model.Admin;
import com.ciu.sys.Repository.AdminRepository;

@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner seedAdmin(AdminRepository adminRepo) {
    return args -> {
      if (adminRepo.findByEmail("admin@gmail.com").isEmpty()) {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setEmail("admin@gmail.com");
        admin.setPassword("admin");
        admin.setRole("ADMIN");
        adminRepo.save(admin);
      }
    };
  }
}
