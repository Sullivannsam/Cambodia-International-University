package com.ciu.sys.model.assignment;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_submission")
public class Submission {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Student_Email")
  private String studentEmail;

  @Column(name = "Content")
  private String content;

  @Column(name = "submitted_At")
  private Date submittedAt;

  @Column(name = "Assignment_Id")
  private Long assignmentId;

}
