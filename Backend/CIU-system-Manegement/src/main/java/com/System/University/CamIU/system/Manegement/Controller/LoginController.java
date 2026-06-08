package com.System.University.CamIU.system.Manegement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.System.University.CamIU.system.Manegement.Model.Login;
import com.System.University.CamIU.system.Manegement.Service.LoginService;

@RestController
@RequestMapping("/api/auth/user")
public class LoginController {

  @Autowired
  LoginService loginService;

  @PostMapping("/login")
  public ResponseEntity<String> getUserLogin(@RequestBody Login users) {
    Login login = loginService.getUserLogin(users);

    if (login != null) {
      return ResponseEntity.status(HttpStatus.OK).body("Login Successful!");
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials!");
    }
  }
}
