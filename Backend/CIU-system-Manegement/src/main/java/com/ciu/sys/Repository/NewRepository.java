package com.ciu.sys.repository.News;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.News.News;
import java.util.List;

@Repository
public interface NewRepository extends JpaRepository<News, Long> {

  @Query("SELECT n FROM News n ORDER BY n.createdAt DESC")
  List<News> findAllByOrderByCreatedAtDesc();
}
