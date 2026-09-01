package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.AuditLog;
import com.ciu.sys.Repository.AuditLogRepository;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

  @Autowired
  private AuditLogRepository repository;

  @GetMapping
  public ResponseEntity<List<AuditLog>> getAuditLogById() {

    return ResponseEntity.ok(repository.findAllActiveOrderByIdDesc());
  }

  @DeleteMapping("/clear")
  public ResponseEntity<Map<String, String>> deleteById() {

    List<AuditLog> logs = repository.findAll();
    logs.forEach(log -> log.setActive(false));
    repository.saveAll(logs);
    return ResponseEntity.ok(Map.of("message", "Audit logs clear"));

  }

}
