package com.ciu.sys.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Application;
import com.ciu.sys.Repository.ApplicationRepository;

@Service
public class ApplicationService {

  @Autowired
  private ApplicationRepository repo;

  public Map<String, Object> submit(Map<String, Object> body) {
    String name = String.valueOf(body.getOrDefault("name", "")).trim();
    String email = String.valueOf(body.getOrDefault("email", "")).trim();
    if (name.isEmpty() || email.isEmpty() || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
      return Map.of("error", "Name and a valid email are required.");
    }

    Application a = new Application();
    a.setType(nz(body.get("type"), "SCHOLARSHIP"));
    a.setName(name);
    a.setEmail(email);
    a.setProgram(nz(body.get("program"), ""));
    a.setScholarship(nz(body.get("scholarship"), ""));
    a.setMessage(nz(body.get("message"), ""));
    a.setStatus("PENDING");
    a.setRead(false);
    Application saved = repo.save(a);

    saved.setCode(generateCode(saved.getId()));
    saved = repo.save(saved);

    return Map.of(
        "id", saved.getId(),
        "code", saved.getCode(),
        "type", saved.getType(),
        "name", saved.getName(),
        "email", saved.getEmail(),
        "program", saved.getProgram(),
        "scholarship", saved.getScholarship(),
        "message", saved.getMessage(),
        "status", saved.getStatus(),
        "date", saved.getCreateAt() == null ? "" : saved.getCreateAt().toString().substring(0, 10));
  }

  public Map<String, Object> status(String code) {
    if (code == null || code.trim().isEmpty()) {
      return Map.of("error", "No application code provided.");
    }
    Application a = repo.findByCode(code.trim()).orElse(null);
    if (a == null) {
      return Map.of("error", "No application found with that code.");
    }
    return Map.of(
        "id", a.getId(),
        "code", a.getCode(),
        "type", a.getType(),
        "name", a.getName(),
        "email", a.getEmail(),
        "program", a.getProgram(),
        "scholarship", a.getScholarship(),
        "status", a.getStatus(),
        "applicationStatus", a.getStatus(),
        "date", a.getCreateAt() == null ? "" : a.getCreateAt().toString().substring(0, 10));
  }

  public List<Map<String, Object>> getAll() {
    List<Map<String, Object>> result = new ArrayList<>();
    for (Application a : repo.findAllByOrderByIdDesc()) {
      Map<String, Object> m = new HashMap<>();
      m.put("id", a.getId());
      m.put("code", a.getCode());
      m.put("type", a.getType());
      m.put("name", a.getName());
      m.put("email", a.getEmail());
      m.put("program", a.getProgram());
      m.put("scholarship", a.getScholarship());
      m.put("message", a.getMessage());
      m.put("status", a.getStatus());
      m.put("read", a.isRead());
      m.put("date", a.getCreateAt() == null ? "" : a.getCreateAt().toString().substring(0, 10));
      result.add(m);
    }
    return result;
  }

  private String generateCode(Long id) {
    String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
    return String.format("APP-%s-%04d", year, id);
  }

  private String nz(Object v, String fallback) {
    return v == null ? fallback : String.valueOf(v).trim();
  }

}