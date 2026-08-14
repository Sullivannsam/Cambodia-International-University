package com.ciu.sys.repository.finance;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.finance.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

  List<Invoice> findByStudentEmail(String studentEmail);

}
