package com.ciu.sys.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Dto.UserDto;
import com.ciu.sys.Model.User;
import com.ciu.sys.Service.UserService;

@RestController
@RequestMapping("/api/auth/users")
public class UserController {

  @Autowired
  UserService userService;

  @GetMapping("/{id}")
  public User findUserById(@PathVariable Long id) {
    return userService.findUserById(id);
  }

  @GetMapping("/users")
  public List<UserDto> getListUser() {
    return userService.getListUser();
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<User> updateUserById(@PathVariable Long id, @RequestBody User updateUser) {
    User findId = userService.updateUserById(updateUser);

    if (findId != null) {
      return new ResponseEntity<>(findId, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
    userService.deleteUserById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/emails")
  public List<User> findAllUserByEmail(String email) {
    return userService.findAllUserByEmail(email);
  }

  @GetMapping("/email")
  public User findUserByEmail(@RequestBody String userEmail) {
    return userService.findUserByEmail(userEmail);
  }

}
