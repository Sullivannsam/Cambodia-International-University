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
@Table(name = "tb_newsletter")
public class NewsletterSubscription {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;

  @Column(name = "Email", nullable = false)
  private String email;

  @CreationTimestamp
  @Column(name = "Create_At", updatable = false)
  private LocalDateTime createAt;

}