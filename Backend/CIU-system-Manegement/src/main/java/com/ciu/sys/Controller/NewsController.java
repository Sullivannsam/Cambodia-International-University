package com.ciu.sys.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ciu.sys.Model.News;
import com.ciu.sys.Service.NewsService;

@RestController
@RequestMapping("/api/auth/admin")
public class NewsController {

  @Autowired
  private NewsService repo;

  @GetMapping("/news")
  public List<News> getAllNews() {
    return repo.getallnews();
  }

  @PostMapping("/posts/news")
  public News createdNews(@RequestBody News news) {
    return repo.createdNews(news);
  }

  @PutMapping("/update/news/{id}")
  public News udpatedNews(@PathVariable Long id, @RequestBody News news) {
    return repo.updateNews(id, news);
  }

  @DeleteMapping("/delete/news/{id}")
  public ResponseEntity<Void> deleteNewsById(@PathVariable Long id) {
    repo.deleteNewsById(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

}
