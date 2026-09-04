package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

  @Query("SELECT a FROM Assignment a WHERE a.teacherEmail = :teacherEmail AND a.active = true ORDER BY a.id DESC")
  List<Assignment> findByTeacherEmail(@Param("teacherEmail") String teacherEmail);

  @Query("SELECT a FROM Assignment a WHERE a.active = true ORDER BY a.id DESC")
  List<Assignment> findAllByActiveTrue();

}
