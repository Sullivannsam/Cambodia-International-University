package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.TeacherAnnouncement;

@Repository
public interface TeacherAnnouncementRepository extends JpaRepository<TeacherAnnouncement, Long> {

  @Query("SELECT a FROM TeacherAnnouncement a WHERE a.teacherEmail = :email AND a.active = true ORDER BY a.id DESC")
  List<TeacherAnnouncement> findByTeacherEmailOrderByIdDesc(@Param("email") String email);

  List<TeacherAnnouncement> findAllByActiveTrue();

}
