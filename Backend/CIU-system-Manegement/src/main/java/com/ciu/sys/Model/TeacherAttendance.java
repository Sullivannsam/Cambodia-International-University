package com.ciu.sys.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_teacher_attendance")
public class TeacherAttendance {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "attendance")
  private Long attendance;

  @Column(name = "present")
  private boolean isPresent;

  // @OneToMany(mappedBy = "teacher")
  // private List<StudentClass> classes;
  //
  @ManyToOne
  @JoinColumn(name = "teacher_id")
  private Teacher teacher;

}
