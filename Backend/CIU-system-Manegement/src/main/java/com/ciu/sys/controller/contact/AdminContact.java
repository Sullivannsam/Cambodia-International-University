package com.ciu.sys.controller.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

import com.ciu.sys.model.contact.Contact;
import com.ciu.sys.service.contact.ContactMailService;
import com.ciu.sys.service.contact.ContactService;

@RestController
@RequestMapping("/api/admin/contact")
public class AdminContact {

  @Autowired
  private ContactService service;

  @Autowired
  private ContactMailService mailService;

  @PostMapping("/reply")
  public ResponseEntity<?> contacReplay(@RequestBody Map<String, String> body) {
    String to = body.get("to");
    String subject = body.get("subject");
    String message = body.get("message");

    if (to == null || to.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Missing Recipient"));
    } else {
      mailService.sentReply(to, subject, message);
      return ResponseEntity.ok(Map.of("message", "Message Send Successfully!"));
    }
  }

  @PutMapping("/{id}/read")
  public ResponseEntity<Contact> markRead(@PathVariable Long id) {
    return ResponseEntity.ok(service.readContact(id));
  }

  @GetMapping("/messages")
  public List<Contact> getAllContact() {
    return service.getAllContact();
  }

  @DeleteMapping("/delete/message/{id}")
  public ResponseEntity<Void> deleteContactById(@PathVariable Long id) {
    service.deleteContactById(id);
    return ResponseEntity.noContent().build();
  }

}
