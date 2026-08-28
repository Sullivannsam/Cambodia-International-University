
package com.ciu.sys.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Invoice;
import com.ciu.sys.Repository.InvoiceRepository;

@RestController
@RequestMapping("/api/admin/invoices")
public class AdminInvoiceController {

  @Autowired
  private InvoiceRepository invoiceRepo;

  @GetMapping
  public ResponseEntity<List<Invoice>> all() {

    return ResponseEntity.ok(invoiceRepo.findAll(Sort.by(Sort.Direction.DESC, "id")));
  }

  @PutMapping("/{id}/status")
  public ResponseEntity updateStatus(@PathVariable Long id, @RequestBody Invoice update) {
    return invoiceRepo.findById(id).map(inv -> {
      if (update.getStatus() != null) {
        inv.setStatus(update.getStatus());
      }
      invoiceRepo.save(inv);
      return ResponseEntity.ok(inv);
    }).orElseThrow();
  }

}
