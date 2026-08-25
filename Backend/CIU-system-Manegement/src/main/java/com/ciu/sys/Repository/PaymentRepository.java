package com.ciu.sys.repository.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.finance.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
