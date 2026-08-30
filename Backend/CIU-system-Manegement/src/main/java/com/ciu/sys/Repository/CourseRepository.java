package com.ciu.sys.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Course;

@Repository

public interface CourseRepository extends JpaRepository<Course, Long> {

  @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.code = :code")
  boolean existsByCode(@Param("code") String code);

  Optional<Course> findByCode(String code);

  @Query("SELECT c FROM Course c WHERE c.active = true")
  List<Course> findByActiveTrue();

  @Query("SELECT c FROM Course c WHERE c.featured = true")
  List<Course> findByFeaturedTrue();
}
