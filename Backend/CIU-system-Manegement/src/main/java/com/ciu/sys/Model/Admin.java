package com.ciu.sys.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Admin")
public class Admin {

  private Long id;
  private String username;
  private String password;
  private String email;
  private String role;
}
