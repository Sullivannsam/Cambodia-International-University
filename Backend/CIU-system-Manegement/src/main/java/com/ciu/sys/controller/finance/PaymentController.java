package com.ciu.sys.controller.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.finance.Payment;
import com.ciu.sys.service.finance.PaymentService;

@RestController
@RequestMapping("/api/auth")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  @PostMapping("/student/payment-fee")
  public Payment paymentInstitute(@RequestBody Payment payment) {
    return paymentService.paymentInstitute(payment);
  }

}
