package com.ciu.sys.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Notification;
import com.ciu.sys.Repository.NotificationRepository;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

  @Autowired
  private NotificationRepository repo;

  @GetMapping
  public ResponseEntity<?> history() {
    List<Notification> all = repo.findAll(Sort.by(Sort.Direction.DESC, "id"));
    List<Map<String, Object>> rows = new ArrayList<>();
    for (Notification n : all) {
      String role = nz(n.getTargetRole());
      rows.add(Map.of(
          "id", n.getId(),
          "title", nz(n.getTitles()),
          "body", nz(n.getMessage()),
          "type", role.isEmpty() ? "GENERAL" : role,
          "audience", role.isEmpty() ? "ALL" : role,
          "date", n.getCreaeteAt() == null ? "" : n.getCreaeteAt().substring(0, 10),
          "read", n.isRead()));
    }
    return ResponseEntity.ok(Map.of("notifications", rows));
  }

  @PostMapping
  public ResponseEntity<?> broadcast(@RequestBody Map<String, String> body) {
    Notification n = new Notification();
    n.setTitles(body.getOrDefault("title", ""));
    n.setMessage(body.getOrDefault("body", ""));
    n.setTargetRole(body.getOrDefault("audience", "ALL"));
    n.setRead(false);
    n.setCreaeteAt(LocalDateTime.now().toString());
    repo.save(n);

    return ResponseEntity.ok(Map.of(
        "id", n.getId(),
        "title", nz(n.getTitles()),
        "body", nz(n.getMessage()),
        "type", nz(n.getTargetRole()),
        "audience", body.getOrDefault("audience", "ALL"),
        "date", n.getCreaeteAt().substring(0, 10),
        "read", false));
  }

  private String nz(String v) {
    return v == null ? "" : v;
  }
}
