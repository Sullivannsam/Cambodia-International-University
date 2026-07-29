package com.ciu.sys.repository.teacher;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.teacher.TeacherAttendance;

@Repository
public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {

}
