package com.ciu.sys.model.Report;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_report")
public class Report {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Role")
  private String role;

  @Column(name = "Email")
  private String email;

  @Column(name = "Name")
  private String name;

  @Column(name = "Subject_Role")
  private String subjectRole;

  @Column(name = "Subject_Email")
  private String subjectEmail;

  @Column(name = "Subject_Name")
  private String subjectName;

  @Column(name = "Category")
  private String category;

  @Column(name = "Description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "Date")
  private String date;

  @Column(name = "read_flag")
  private boolean read;

}
