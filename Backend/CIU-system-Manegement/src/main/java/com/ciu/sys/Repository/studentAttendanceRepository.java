package com.ciu.sys.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface studentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {

}
