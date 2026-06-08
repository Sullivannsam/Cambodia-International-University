package com.System.University.CamIU.system.Manegement.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.System.University.CamIU.system.Manegement.Model.User;
import com.System.University.CamIU.system.Manegement.Service.UserService;

@RestController
@RequestMapping("/api/auth/users")
public class UserController {

  @Autowired
  UserService userService;

  @PreAuthorize(value = "ADMIN")
  @GetMapping
  public List<User> getListUsers() {
    return userService.getListUser();
  }

}
