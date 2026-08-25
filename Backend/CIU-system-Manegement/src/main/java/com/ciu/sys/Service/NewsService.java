package com.ciu.sys.Service;

import java.util.List;

import java.sql.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.News;
import com.ciu.sys.Repository.NewRepository;

@Service
public class NewsService {

  @Autowired
  private NewRepository repo;

  public List<News> getallnews() {
    return repo.findAll();
  }

  public News createdNews(News news) {
    news.setCreatedAt(new Date(System.currentTimeMillis()));
    return repo.save(news);
  }

  public News updateNews(Long id, News update) {
    return repo.findById(id).map(existing -> {
      if (update.getTitle() != null)
        existing.setTitle(update.getTitle());
      if (update.getContent() != null)
        existing.setContent(update.getContent());
      if (update.getAuthor() != null)
        existing.setAuthor(update.getAuthor());
      if (update.getImageUrl() != null)
        existing.setImageUrl(update.getImageUrl());
      if (update.getCategory() != null)
        existing.setCategory(update.getCategory());
      existing.setPublished(update.isPublished());
      existing.setScheduleAt(update.getScheduleAt());
      return repo.save(existing);
    }).orElseThrow(() -> new RuntimeException("News not found"));
  }

  public void deleteNewsById(Long id) {
    repo.deleteById(id);
  }
}
