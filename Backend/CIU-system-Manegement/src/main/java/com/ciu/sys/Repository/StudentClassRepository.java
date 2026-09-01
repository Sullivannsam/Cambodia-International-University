package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.StudentClass;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {

  @Query("SELECT DISTINCT sc.group FROM StudentClass sc WHERE sc.group IS NOT NULL AND sc.active = true")
  List<String> findDistinctGroups();

  @Query("SELECT sc FROM StudentClass sc WHERE sc.group = :group AND sc.active = true")
  List<StudentClass> findByGroup(String group);

  @Query("SELECT sc FROM StudentClass sc WHERE sc.group = :group")
  List<StudentClass> findAllByGroup(String group);

  @Query("SELECT sc FROM StudentClass sc WHERE sc.active = true")
  List<StudentClass> findByActiveTrue();

}