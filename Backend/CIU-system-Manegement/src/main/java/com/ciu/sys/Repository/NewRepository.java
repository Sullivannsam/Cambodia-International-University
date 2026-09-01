package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.News;
import java.util.List;

@Repository
public interface NewRepository extends JpaRepository<News, Long> {

  @Query("SELECT n FROM News n WHERE n.active = true ORDER BY n.createdAt DESC")
  List<News> findAllByOrderByCreatedAtDesc();
}
