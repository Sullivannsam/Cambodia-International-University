package com.ciu.sys.repository.assignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.assignment.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

  List<Assignment> findByTeacherEmail(String teacherEmail);

}
