package com.ciu.sys.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_student_attendance")
public class StudentAttendance {

  @Id
  @GeneratedValue(strategy = GeneratedValue.IDENTITY)
  private Long id;

  @Column(name = "student_id")
  private String studentId;

  @Column(name = "student_major")
  private String major;

  @Column(name = "student_class")
  private String studentClass;

  @Column(name = "attendance")
  private Long attendance;

  @Column(name = "present")
  private boolean isPresent;

  @Column(name = "date")

}
