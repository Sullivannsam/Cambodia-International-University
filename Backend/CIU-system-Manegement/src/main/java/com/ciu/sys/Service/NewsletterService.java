package com.ciu.sys.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.NewsletterSubscription;
import com.ciu.sys.Repository.NewsletterRepository;

@Service
public class NewsletterService {

  @Autowired
  private NewsletterRepository repo;

  public Map<String, Object> subscribe(Map<String, String> body) {
    String email = body.getOrDefault("email", "").trim();
    if (email.isEmpty() || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
      return Map.of("error", "Invalid email address.");
    }
    if (repo.existsByEmailIgnoreCase(email)) {
      return Map.of("email", email, "message", "Already subscribed.");
    }
    NewsletterSubscription sub = new NewsletterSubscription();
    sub.setEmail(email);
    sub = repo.save(sub);
    return Map.of(
        "id", sub.getId(),
        "email", sub.getEmail(),
        "message", "Subscribed successfully.");
  }

  public List<NewsletterSubscription> getAll() {
    return repo.findAllByOrderByIdDesc();
  }

}