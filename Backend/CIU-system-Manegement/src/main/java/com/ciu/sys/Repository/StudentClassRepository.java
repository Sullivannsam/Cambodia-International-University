package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.StudentClass;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {

  @Query("SELECT DISTINCT sc.group FROM StudentClass sc WHERE sc.group IS NOT NULL")
  List<String> findDistinctGroups();

  List<StudentClass> findByGroup(String group);
}
