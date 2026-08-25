package com.ciu.sys.Model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_payment")
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Amount", nullable = false)
  private Double amount;

  @Column(name = "Date", nullable = false)
  private Date date;

  @Column(name = "Student_id", nullable = false)
  private Long studentId;

  @Column(name = "Type_fee", length = 50, nullable = false)
  private String type;
}
