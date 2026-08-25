package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

  List<Submission> findByAssignmentId(Long assignmentId);

  List<Submission> findByStudentEmail(String studentEmail);

  boolean existsByAssignmentIdAndStudentEmail(Long assignmentId, String studentEmail);

}
