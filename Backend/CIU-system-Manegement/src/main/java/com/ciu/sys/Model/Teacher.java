package com.ciu.sys.Model;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyEnumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_teacher")
public class Teacher {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "username")
  private String username;

  @Column(name = "email")
  private String email;

  @Column(name = "password")
  private String password;

  @Column(name = "PhoneNumber")
  private String phone;

  @Column(name = "Role")
  private String role;

  @Column(name = "Active")
  private boolean isActive;

  @Column(name = "Birtdate")
  private Date date;

  @OneToMany(mappedBy = "teacher")
  private List<StudentClass> Classes;

  @OneToMany(mappedBy = "teacher")
  private List<TeacherAttendance> attandance;

}
