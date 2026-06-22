package com.ciu.sys.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.User;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  UserService userService;

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody User user) {
    userService.authenticate(user.getEmail(), user.getPassword());
    return ResponseEntity.status(HttpStatus.OK).body("Login Successful!");
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody User user) {
    userService.register(user);
    return ResponseEntity.status(HttpStatus.CREATED).body("Register Successfully");
  }
}
