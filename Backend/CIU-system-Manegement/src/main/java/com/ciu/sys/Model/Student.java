package com.ciu.sys.Model;

import java.sql.Date;

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
@Table(name = "tb_students")
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Username")
  private String username;

  @Column(name = "Email")
  private String email;

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

  @ManyToOne
  @JoinColumn(name = "Student_info_id")
  private StudentInfo studentInfo;
}
