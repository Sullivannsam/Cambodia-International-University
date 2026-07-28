package com.ciu.sys.repository.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.admin.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
  java.util.Optional<Admin> findByEmail(String email);
}
