package com.ciu.sys.repository.teacher;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.teacher.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
  Optional<Teacher> findByEmail(String email);

  @Query("SELECT COUNT(t) FROM Teacher t")
  long countTeachers();

}
