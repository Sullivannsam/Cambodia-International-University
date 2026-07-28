package com.ciu.sys.controller.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.contact.Contact;
import com.ciu.sys.service.contact.ContactService;

@RestController
@RequestMapping("/api/public")
public class ContentController {

  @Autowired
  private ContactService contactService;

  @GetMapping
  public Contact getContact() {
    return contactService.getUserContact();
  }

  @GetMapping("/home")
  public String getHomepage() {
    return "Hello String";
  }
}

