package com.ciu.sys.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_verification_code")
public class Verification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(name = "Email")
  private String email;

  @Column(name = "Code")
  private String code;

  @Column(name = "Expired")
  private LocalDateTime expiresAt;

  @Column(name = "Used")
  private boolean used;

}
