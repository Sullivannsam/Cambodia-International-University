package com.System.University.CamIU.system.Manegement.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/public")
public class ContactController {

  @GetMapping("/contact")
  public String contactpage() {
    return "Conact Submit";
  }
}
