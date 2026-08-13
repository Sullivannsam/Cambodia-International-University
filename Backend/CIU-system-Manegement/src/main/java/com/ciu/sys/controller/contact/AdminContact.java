package com.ciu.sys.controller.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.ciu.sys.model.contact.Contact;
import com.ciu.sys.service.contact.ContactService;

@RestController
@RequestMapping("/api/admin/contact")
public class AdminContact {

  @Autowired
  private ContactService service;

  @PostMapping("/reply")
  public Contact contacReplay(@RequestBody Contact contact) {
    return service.reply(contact);
  }

  @GetMapping("/messages")
  public List<Contact> getAllContact() {
    return service.getAllContact();
  }

}
