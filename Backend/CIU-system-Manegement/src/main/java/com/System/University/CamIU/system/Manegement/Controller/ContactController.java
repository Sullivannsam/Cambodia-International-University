package com.System.University.CamIU.system.Manegement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.System.University.CamIU.system.Manegement.Model.Contact;
import com.System.University.CamIU.system.Manegement.Service.ContactService;

@RestController
@RequestMapping("/api/public")
public class ContactController {

  @Autowired
  private ContactService contactService;

  @GetMapping
  public Contact getUserContact() {
    return contactService.getUserContact();
  }

}
