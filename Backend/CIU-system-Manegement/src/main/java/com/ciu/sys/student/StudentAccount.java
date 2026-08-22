package com.ciu.sys.student;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_account_students")
public class StudentAccount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Username")
  private String username;

  @Column(name = "Email", unique = true)
  private String email;

  @JsonIgnore
  @Column(name = "Password")
  private String password;

  @Column(name = "PhoneNumber")
  private String phone;

  @Column(name = "Role")
  private String role;

  @Column(name = "Active")
  private boolean isActive;

  @Column(name = "Birtdate")
  private Date date;

  @Column(name = "Year")
  private int year = 1;

  @Column(name = "Semester")
  private int semester = 1;

  @Column(name = "CardCode", unique = true)
  private String cardCode;

  @Column(name = "Major")
  private String major;

  @Column(name = "Address")
  private String address;

  @Column(name = "Photo_Url")
  private String photoUrl;

  @OneToOne
  @JoinColumn(name = "student_info_id")
  private StudentInfo studentInfo;

  @OneToMany
  @JoinColumn(name = "student_attendance_id")
  private List<StudentAttendance> attendance;

  @ManyToOne
  @JoinColumn(name = "classes_id")
  private StudentClass classes;
}
