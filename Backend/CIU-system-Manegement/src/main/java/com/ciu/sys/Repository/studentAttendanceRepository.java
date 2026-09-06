package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentAttendance;
import java.util.List;

@Repository
public interface studentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
  List<StudentAttendance> findByStudentsId(Long studentId);
  List<StudentAttendance> findByStudentsIdAndClassCode(Long studentId, String classCode);
}
