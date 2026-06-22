package com.ciu.sys.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Contact;
import com.ciu.sys.Service.ContactService;

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
