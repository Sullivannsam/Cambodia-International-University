package com.ciu.sys.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.student.StudentAccount;

@Repository
public interface StudentRepository extends JpaRepository<StudentAccount, Long> {
  Optional<StudentAccount> findByEmail(String email);

  @Query("SELECT COUNT(s) FROM StudentAccount s")
  long countStudents();
}
