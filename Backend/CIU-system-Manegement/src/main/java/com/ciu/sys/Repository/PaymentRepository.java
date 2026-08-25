package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
