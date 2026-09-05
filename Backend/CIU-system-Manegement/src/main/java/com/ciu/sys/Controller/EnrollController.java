package com.ciu.sys.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Enroll;
import com.ciu.sys.Service.EnrollService;

@RestController
@RequestMapping("/api/v1/auth")
public class EnrollController {

  @Autowired
  private EnrollService enrollService;

  @PostMapping("/enroll")
  public Enroll getEnrollClass(@RequestBody Enroll enroll) {
    return enrollService.getEnrollClass(enroll);
  }

}
