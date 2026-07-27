package com.ciu.sys.Model;

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
@Table(name = "tb_classes")
public class StudentClass {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "group_name")
  private String group;

  @Column(name = "major")
  private String major;

  @Column(name = "year")
  private String year;

  @Column(name = "shift")
  private String shift;

  @ManyToOne
  @JoinColumn(name = "teacher_class")
  private Teacher teacher;
}
