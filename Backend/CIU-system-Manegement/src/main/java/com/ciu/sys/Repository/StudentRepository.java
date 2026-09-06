package com.ciu.sys.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentClass;

@Repository
public interface StudentRepository extends JpaRepository<StudentAccount, Long> {
  Optional<StudentAccount> findByEmail(String email);

  List<StudentAccount> findByClasses(StudentClass classes);

  Optional<StudentAccount> findTopByOrderByCardCodeDesc();

  Optional<StudentAccount> findByCardCode(String cardCode);

  @Query("SELECT COUNT(s) FROM StudentAccount s")
  long countStudents();
}
