package com.ciu.sys.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.student.StudentAttendance;

@Repository
public interface studentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {

}
