package com.ciu.sys.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Payment;
import com.ciu.sys.Repository.PaymentRepository;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  public Payment paymentInstitute(Payment payment) {
    return paymentRepository.save(payment);
  }

}
