package com.ciu.sys.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.News;
import com.ciu.sys.Service.NewsService;

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
