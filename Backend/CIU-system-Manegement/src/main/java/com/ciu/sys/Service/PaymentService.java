package com.ciu.sys.service.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.finance.Payment;
import com.ciu.sys.repository.finance.PaymentRepository;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  public Payment paymentInstitute(Payment payment) {
    return paymentRepository.save(payment);
  }

}
