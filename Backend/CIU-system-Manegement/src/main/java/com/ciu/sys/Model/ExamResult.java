package com.ciu.sys.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_exam")
public class ExamResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Student_Email")
  private String studentEmail;

  @Column(name = "Teacher_Email")
  private String teacherEmail;

  @Column(name = "Code")
  private String code;

  @Column(name = "Course_Name")
  private String courseName;

  @Column(name = "Credits")
  private int credits;

  @Column(name = "Scores")
  private double score;

  @Column(name = "Mark")
  private double mark;

  @Column(name = "Grade")
  private String grade;

  @Column(name = "Letter")
  private String letter;

  @Column(name = "Semester")
  private String semester;

}
