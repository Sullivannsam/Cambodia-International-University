package com.ciu.sys.model.finance;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_exam")
public class ExamResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

}
