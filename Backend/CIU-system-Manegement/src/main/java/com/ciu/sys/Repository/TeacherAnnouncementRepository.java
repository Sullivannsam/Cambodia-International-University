package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.TeacherAnnouncement;

@Repository
public interface TeacherAnnouncementRepository extends JpaRepository<TeacherAnnouncement, Long> {

  List<TeacherAnnouncement> findByTeacherEmailOrderByIdDesc(String email);

}
