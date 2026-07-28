package com.ciu.sys.model.enrollment;

import java.sql.Date;

import org.hibernate.annotations.Columns;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_enroll")
public class Enroll {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;

  @Column(name = "firstname_English", nullable = false)
  private String firstNameEN;

  @Column(name = "lastname_English", nullable = false)
  private String lastNameEN;

  @Column(name = "firstname_Khmer", columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4", nullable = false)
  private String firstNameKH;

  @Column(name = "lastname_Khmer", columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4", nullable = false)
  private String lastNameKH;

  @Column(nullable = false)
  private int age;

  @Column(nullable = false)
  private Date birthDate;

  @Column(nullable = false)
  private String palceOfBirth;

  @Column(nullable = false, length = 10)
  private String sex;

  @Column(nullable = false)
  private String national;

  @Column(nullable = false)
  private String phoneNumber;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private Date startDate;

  @Column(nullable = false)
  private String major;

  @Column(nullable = false)
  private String year;

  @Column(nullable = false)
  private String degree;

}
