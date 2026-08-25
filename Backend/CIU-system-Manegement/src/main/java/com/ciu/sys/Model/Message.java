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
@Table(name = "tb_message")
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Sender_Email")
  private String senderEmail;

  @Column(name = "Sender_Role")
  private String senderRole;

  @Column(name = "Receiver_Email")
  private String receiverEmail;

  @Column(name = "Content")
  private String content;

  @Column(name = "Read_Flag")
  private boolean read;

  @Column(name = "Create_At")
  private String createAt;

}
