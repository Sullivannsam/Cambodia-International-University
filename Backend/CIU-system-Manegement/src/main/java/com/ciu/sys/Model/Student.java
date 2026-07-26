package com.ciu.sys.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_student")
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToMany
  @JoinColumn(name = "Exam_Result")
  private ExamResult examResult;

  @OneToMany
  @JoinColumn(name = "Payment_Result")
  private PaymentResult paymentResult;

  @OneToMany
  @JoinColumn(name = "Scholarship")
  private Scholarship scholarship;

  @OneToMany
  @JoinColumn(name = "Attendance_Result")
  private StudentAttendance studentAttendance;

}
