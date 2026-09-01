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
@Table(name = "tb_schedule")
public class Schedule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Major")
  private String major;

  @Column(name = "FieldName")
  private String field;

  @Column(name = "Level")
  private String level;

  @Column(name = "Semester")
  private String semester;

  @Column(name = "Day")
  private String day;

  @Column(name = "StartDay")
  private String startDay;

  @Column(name = "EndDay")
  private String endDay;

  @Column(name = "Time")
  private String time;

  @Column(name = "Course")
  private String course;

  @Column(name = "Subject")
  private String subject;

  @Column(name = "Room")
  private String room;

  @Column(name = "Instructor")
  private String instructor;

  @Column(name = "Teacher")
  private String teacher;

  @Column(name = "JoinCode")
  private String joinCode;

  @Column(name = "IsActive")
  private boolean active = true;

}