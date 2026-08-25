package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

  List<Invoice> findByStudentEmail(String studentEmail);

}
