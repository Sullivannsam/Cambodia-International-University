package com.ciu.sys.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@Table(name = "tb_application")
public class Application {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;

  @Column(name = "Code", unique = true)
  private String code;

  @Column(name = "Type")
  private String type;

  @Column(name = "Name")
  private String name;

  @Column(name = "Email")
  private String email;

  @Column(name = "Program")
  private String program;

  @Column(name = "Scholarship")
  private String scholarship;

  @Column(name = "Message", length = 2000)
  private String message;

  @Column(name = "Status")
  private String status;

  @Column(name = "read_flag")
  private boolean read;

  @CreationTimestamp
  @Column(name = "Create_At", updatable = false)
  private LocalDateTime createAt;

}