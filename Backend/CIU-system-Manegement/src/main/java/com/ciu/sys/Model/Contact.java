package com.ciu.sys.model.contact;

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
@Table(name = "tb_contact")
public class Contact {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;

  @Column(name = "Username")
  private String username;

  @Column(name = "Phone_number")
  private String phoneNumber;

  @Column(name = "Email")
  private String email;

  @Column(name = "Message")
  private String message;

  @CreationTimestamp
  @Column(name = "Create_At", updatable = false)
  private LocalDateTime createAt;

  @Column(name = "read_flag")
  private boolean read;
}
