package com.ciu.sys.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
  Optional<Teacher> findByEmail(String email);

}
