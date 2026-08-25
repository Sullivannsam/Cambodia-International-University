package com.ciu.sys.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Payment;
import com.ciu.sys.Service.PaymentService;

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
