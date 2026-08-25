package com.ciu.sys.Model;

import java.sql.Date;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_invoice")
public class Invoice {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Invoice_Number")
  private String invoiceNumber;

  @Column(name = "Student_Email")
  private String studentEmail;

  @Column(name = "Description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "Amount")
  private double amount;

  @Column(name = "Status")
  private String status;

  @Column(name = "Due_time")
  private LocalDate dueTime;

  @Column(name = "Create_At")
  private Date createAt;

}
