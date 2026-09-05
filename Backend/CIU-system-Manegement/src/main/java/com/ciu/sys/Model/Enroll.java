package com.ciu.sys.Model;

import java.sql.Date;

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

  @Column(name = "firstname_Khmer", columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4")
  private String firstNameKH;

  @Column(name = "lastname_Khmer", columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4")
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
  private String startDate;

  @Column(nullable = false)
  private String major;

  @Column(nullable = false)
  private String year;

  @Column(nullable = false)
  private String degree;

  @Column(name = "status")
  private String status = "PENDING";

  @Column(name = "khmer_national_id_file", columnDefinition = "LONGTEXT")
  private String khmerNationalIdFile;

  @Column(name = "photo_file", columnDefinition = "LONGTEXT")
  private String photoFile;

  @Column(name = "bacii_photo_file", columnDefinition = "LONGTEXT")
  private String bacIIPhotoFile;

}
