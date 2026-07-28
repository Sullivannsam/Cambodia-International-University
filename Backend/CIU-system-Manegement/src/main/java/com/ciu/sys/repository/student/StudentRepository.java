package com.ciu.sys.repository.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.student.StudentAccount;

@Repository
public interface StudentRepository extends JpaRepository<StudentAccount, Long> {
  Optional<StudentAccount> findByEmail(String email);
}
