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
@Table(name = "tb_users")
public class User {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;

  @Column(name = "username", nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String address;

  @Column(nullable = false)
  private String role;

  @Column(nullable = false)
  private String course;

  @Column(nullable = false)
  private boolean isActive;

  @Column(nullable = false)
  private String createAt;

  @Column(nullable = false)
  private String phone;

}
