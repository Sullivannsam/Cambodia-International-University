package com.ciu.sys.model.Course;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_course")
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Code")
  private String code;

  @Column(name = "Title")
  private String title;

  @Column(name = "Credits")
  private int credits;

  @Column(name = "Instructor")
  private String instructor;

  @Column(name = "Description")
  private String description;

  @Column(name = "IsActive")
  private boolean active = true;

  @Column(name = "IsFeature")
  private boolean featured = false;

}
