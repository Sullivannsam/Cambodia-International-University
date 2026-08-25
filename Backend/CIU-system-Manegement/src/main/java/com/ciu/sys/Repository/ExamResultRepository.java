package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.ExamResult;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {

  List<ExamResult> findByStudentEmail(String studentEmail);

  List<ExamResult> findByTeacherEmail(String teacherEmail);

}
