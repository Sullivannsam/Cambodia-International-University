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
@Table(name = "tb_news")
public class News {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Title", length = 500)
  private String title;

  @Column(name = "Content", length = 10000)
  private String content;

  @Column(name = "Author")
  private String author;

  @Column(name = "Image", columnDefinition = "LONGTEXT")
  private String imageUrl;

  @Column(name = "Category")
  private String category;

  @Column(name = "Public")
  private boolean published = true;

  @Column(name = "Schedule")
  private Date scheduleAt;

  @Column(name = "Created")
  private Date createdAt;

}
