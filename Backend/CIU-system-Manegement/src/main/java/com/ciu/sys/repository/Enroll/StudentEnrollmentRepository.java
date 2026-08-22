package com.ciu.sys.repository.Enroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.ciu.sys.model.enrollment.StudentEnrollment;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
  List<StudentEnrollment> findByStudent_Email(String email);
}
