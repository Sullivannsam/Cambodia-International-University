package com.ciu.sys.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
  java.util.Optional<Admin> findByEmail(String email);

  @Query("SELECT COUNT(a) FROM Admin a")
  long countAdmins();
}
