package com.System.University.CamIU.system.Manegement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.System.University.CamIU.system.Manegement.Model.Register;
import com.System.University.CamIU.system.Manegement.Service.RegisterService;

@RestController
@RequestMapping("/api/auth/users")
public class RegisterController {

  @Autowired
  RegisterService registerService;

  @PostMapping("/register")
  public ResponseEntity<String> getRegisterAccount(@RequestBody Register users) {
    Register saveUser = registerService.getRegisterAccount(users);

    if (saveUser != null) {
      return ResponseEntity.status(HttpStatus.CREATED).body("Register Successfully");
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Already Exits");
    }
  }
}
