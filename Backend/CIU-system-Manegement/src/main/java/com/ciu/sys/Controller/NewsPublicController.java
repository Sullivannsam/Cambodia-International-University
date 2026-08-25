package com.ciu.sys.controller.News;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.News.News;
import com.ciu.sys.service.News.NewsService;

@RestController
@RequestMapping("/api")
public class NewsPublicController {

  @Autowired
  private NewsService repo;

  @GetMapping("/news")
  public List<News> getPublicNews() {
    return repo.getallnews();
  }

}
