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
@Table(name = "tb_tuition_fee")
public class Tuition {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Degree")
  private String degree;

  @Column(name = "Program")
  private String program;

  @Column(name = "Year1")
  private double year1;

  @Column(name = "Year2")
  private double year2;

  @Column(name = "Year3")
  private double year3;

  @Column(name = "Year4")
  private double year4;

}
