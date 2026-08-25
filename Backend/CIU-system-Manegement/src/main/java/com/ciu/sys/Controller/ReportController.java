package com.ciu.sys.controller.ReportController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.ciu.sys.model.Report.Report;
import com.ciu.sys.service.ReportService.ReportService;

@RestController
@RequestMapping("/api/auth/report")
public class ReportController {

  @Autowired
  private ReportService service;

  @GetMapping
  public ResponseEntity<List<Report>> getAllReporter() {
    return ResponseEntity.ok(service.getAllReports());
  }

  @PostMapping("/submit")
  public ResponseEntity<Report> createReporter(@RequestBody Report report) {
    return ResponseEntity.ok(service.submit(report));

  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateReport(@PathVariable Long id, @RequestBody Report report) {
    return service.update(id, report)
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Report not found"));
  }
}
