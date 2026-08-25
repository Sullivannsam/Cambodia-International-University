package com.ciu.sys.Controller;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.ExamResult;
import com.ciu.sys.Model.Invoice;
import com.ciu.sys.Repository.ExamResultRepository;
import com.ciu.sys.Repository.InvoiceRepository;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.StudentRepository;

@RestController
@RequestMapping("/api/admin/progression")
public class AdminProgressController {

  private static final double PASS_MARK = 50.0;
  private static final Map<Integer, Double> TUITION_PER_YEAR = Map.of(1, 450.0, 2, 470.0, 3, 500.0, 4, 530.0);

  @Autowired
  private StudentRepository studentRepo;

  @Autowired
  private ExamResultRepository examResultRepo;

  @Autowired
  private InvoiceRepository invoiceRepo;

  private List<Map<String, Object>> compute() {
    List<Map<String, Object>> rows = new ArrayList<>();

    for (StudentAccount s : studentRepo.findAll()) {
      List<ExamResult> exams = examResultRepo.findByStudentEmail(s.getEmail());

      if (exams.isEmpty()) {
        continue;
      }

      double avg = exams.stream().mapToDouble(ExamResult::getScore).average().orElse(0);
      boolean passed = avg >= PASS_MARK;

      rows.add(Map.of(
          "studentEmail", s.getEmail(),
          "name", s.getUsername(),
          "year", s.getYear(),
          "semester", s.getSemester(),
          "avgScore", Math.round(avg * 100.0) / 100.0,
          "passed", passed));
    }
    return rows;
  }

  @GetMapping("/preview")
  public List<Map<String, Object>> review() {
    return compute();
  }

  @PostMapping("/process")
  public Map<String, Object> process() {
    int promoted = 0, repeated = 0, invoices = 0;
    List<Map<String, Object>> results = new ArrayList<>();

    for (Map<String, Object> row : compute()) {
      StudentAccount s = studentRepo.findByEmail((String) row.get("studentEmail")).orElse(null);
      if (s == null)
        continue;
      boolean passed = (Boolean) row.get("passed");

      if (passed) {
        if (s.getSemester() == 1)
          s.setSemester(2);
        else {
          s.setYear(s.getYear() + 1);
          s.setSemester(1);
        }
        studentRepo.save(s);
        promoted++;

        Invoice inv = new Invoice();
        inv.setInvoiceNumber("INV-" + System.currentTimeMillis());
        inv.setStudentEmail(s.getEmail());
        inv.setDescription("Year " + s.getYear() + " Semester " + s.getSemester() + " Tuition");
        inv.setAmount(TUITION_PER_YEAR.getOrDefault(s.getYear(), 450.0));
        inv.setStatus("UNPAID");
        inv.setDueTime(java.time.LocalDate.now().plusDays(30));
        inv.setCreateAt(new java.sql.Date(System.currentTimeMillis()));
        invoiceRepo.save(inv);
        invoices++;
      } else {
        repeated++;
      }
      results.add(row);
    }
    return Map.of("promoted", promoted, "repeated", repeated,
        "invoicesCreated", invoices, "results", results);
  }

}
