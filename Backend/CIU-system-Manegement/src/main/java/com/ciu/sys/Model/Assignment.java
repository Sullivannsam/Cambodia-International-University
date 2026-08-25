package com.ciu.sys.model.assignment;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_assignment")
public class Assignment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Titles")
  private String title;

  @Column(name = "Message")
  private String message;

  @Column(name = "Course_Code")
  private String courseCode;

  @Column(name = "Teacher_Email")
  private String teacherEmail;

  @Column(name = "Due_Date")
  private LocalDate dueDate;

  @Column(name = "Create_At")
  private String createAt;

}
