package com.ciu.sys.repository.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.student.StudentAttendance;

@Repository
public interface studentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {

}
