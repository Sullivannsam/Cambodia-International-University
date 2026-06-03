package com.System.University.CamIU.system.Manegement.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

  @GetMapping("/home")
  public String getHomepage() {
    return "Hello String";
  }
}
