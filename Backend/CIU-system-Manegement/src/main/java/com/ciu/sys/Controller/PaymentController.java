package com.ciu.sys.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Payment;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.Service.PaymentService;
import com.ciu.sys.Service.TuitionService;

@RestController
@RequestMapping("/api/auth")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private TuitionService tuitionService;

  @PostMapping("/student/payment/lookup")
  public ResponseEntity<?> lookupByCardCode(@RequestBody Map<String, String> body) {
    String cardCode = body.getOrDefault("cardCode", "").trim();
    if (cardCode.isEmpty())
      return ResponseEntity.badRequest().body(Map.of("error", "cardCode required"));
    Optional<StudentAccount> found = studentRepository.findByCardCode(cardCode);
    if (found.isEmpty()) {
      try {
        found = studentRepository.findById(Long.valueOf(cardCode));
      } catch (NumberFormatException ignore) {
      }
    }
    if (found.isEmpty())
      return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
    return ResponseEntity.ok(paymentService.portalLookup(found.get()));
  }

  @PostMapping("/student/payment-fee")
  public ResponseEntity<?> paymentInstitute(@RequestBody Payment payment) {
    if (payment.getStudentId() == null)
      return ResponseEntity.badRequest().body(Map.of("error", "studentId required"));
    Optional<StudentAccount> found = studentRepository.findById(payment.getStudentId());
    if (found.isEmpty())
      return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
    Map<String, Object> result = paymentService.portalPayment(found.get(), payment.getAmount(), payment.getType());
    if (Boolean.TRUE.equals(result.get("error")))
      return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).body(result);
    return ResponseEntity.ok(result);
  }

}
