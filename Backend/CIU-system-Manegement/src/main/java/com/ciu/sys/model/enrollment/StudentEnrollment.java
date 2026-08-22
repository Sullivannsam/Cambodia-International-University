package com.ciu.sys.model.enrollment;

import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.ciu.sys.student.StudentAccount;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_student_enroll")
public class StudentEnrollment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "student_id")
  private StudentAccount student;

  @Column(name = "Course_code", nullable = false)
  private String courseCode;

  @Column(name = "Course_title")
  private String courseTitle;

  @Column(name = "status", nullable = false)
  private String status = "PENDING";

  @Column(name = "Date")
  @DateTimeFormat(pattern = "dd-MM-yyyy")
  private Date date;
}
