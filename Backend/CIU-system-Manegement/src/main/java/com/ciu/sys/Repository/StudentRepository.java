package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
  Optional<Student> find
}
