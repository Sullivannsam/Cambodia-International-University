package com.ciu.sys.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_teacher_accouncement")
public class TeacherAnnouncement {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Teacher_Email")
  private String teacherEmail;

  @Column(name = "Title", length = 500)
  private String title;

  @Column(name = "Message", length = 500)
  private String message;

  @CreationTimestamp
  @Column(name = "Create_At")
  private LocalDateTime createAt;

}
