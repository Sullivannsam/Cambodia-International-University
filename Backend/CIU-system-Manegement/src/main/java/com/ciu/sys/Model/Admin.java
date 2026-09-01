package com.ciu.sys.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_admin")
public class Admin {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Username")
  private String username;

  @JsonIgnore
  @Column(name = "Password")
  private String password;

  @Column(name = "Email", unique = true)
  private String email;

  @Column(name = "Role")
  private String role;

  @Column(name = "IsActive")
  private boolean active = true;
}
