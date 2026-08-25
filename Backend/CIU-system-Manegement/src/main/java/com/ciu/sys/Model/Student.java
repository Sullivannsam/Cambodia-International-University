package com.ciu.sys.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_student")
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "Exam_Result")
  private ExamResult examResult;

  @OneToOne
  @JoinColumn(name = "Payment_Result")
  private Payment paymentResult;

  @OneToOne
  @JoinColumn(name = "Scholarship")
  private Scholarship scholarship;

  @OneToOne
  @JoinColumn(name = "Attendance_Result")
  private StudentAttendance studentAttendance;

}
