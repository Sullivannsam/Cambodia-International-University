package com.ciu.sys.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.StudentAccount;

@Repository
public interface StudentRepository extends JpaRepository<StudentAccount, Long> {
  Optional<StudentAccount> findByEmail(String email);
}
