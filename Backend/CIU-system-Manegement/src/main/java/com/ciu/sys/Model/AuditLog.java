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
@Table(name = "audit_log")
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Actor")
  private String actor;

  @Column(name = "Action")
  private String action;

  @Column(name = "Target")
  private String target;

  @Column(name = "Details", columnDefinition = "TEXT")
  private String details;

  @Column(name = "Ip")
  private String ip;

  @Column(name = "create_at")
  private String timestamp;

}
