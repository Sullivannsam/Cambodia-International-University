package com.ciu.sys.model.Schedule;

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

  @Column(name = "Day")
  private String day;

  @Column(name = "Time")
  private String time;

  @Column(name = "Course")
  private String course;

  @Column(name = "Room")
  private String room;

  @Column(name = "Instructor")
  private String instructor;

}
