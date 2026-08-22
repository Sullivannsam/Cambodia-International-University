package com.ciu.sys.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<StudentAccount, Long> {
  Optional<StudentAccount> findByEmail(String email);

  Optional<StudentAccount> findTopByOrderByCardCodeDesc();

  Optional<StudentAccount> findByCardCode(String cardCode);

  @Query("SELECT COUNT(s) FROM StudentAccount s")
  long countStudents();
}
