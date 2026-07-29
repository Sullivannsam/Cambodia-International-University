package com.ciu.sys.controller.enrollment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.enrollment.Enroll;
import com.ciu.sys.service.Enroll.EnrollService;

@RestController
@RequestMapping("/api/v1/auth")
public class EnrollController {

  @Autowired
  private EnrollService enrollService;

  @PostMapping("/enroll/class")
  public Enroll getEnrollClass(@RequestBody Enroll enroll) {
    return enrollService.getEnrollClass(enroll);
  }

}
