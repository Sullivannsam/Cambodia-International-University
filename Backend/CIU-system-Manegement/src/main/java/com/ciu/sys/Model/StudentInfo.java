package com.ciu.sys.Model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_student_information")
public class StudentInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Place_of_Birth")
  private String place;

  @Column(name = "Father_username")
  private String fatherName;

  @Column(name = "Mother_username")
  private String motherName;

  @Column(name = "Father_PhoneNumber")
  private String fatherPhone;

  @Column(name = "Mother_PhoneNumber")
  private String motherPhone;

  @OneToMany(mappedBy = "studentInfo")
  private List<StudentAccount> students;

}
