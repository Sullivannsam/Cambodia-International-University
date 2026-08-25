package com.ciu.sys.model.notification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_notification")
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Titles")
  private String titles;

  @Column(name = "Message")
  private String message;

  @Column(name = "Target_Role")
  private String targetRole;

  @Column(name = "Read_Flag")
  private boolean read;

  @Column(name = "Create_At")
  private String creaeteAt;

}
