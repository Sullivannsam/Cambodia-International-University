package com.ciu.sys.user;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.user.UserDto;
import com.ciu.sys.user.User;
import com.ciu.sys.user.UserService;

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
    return userService.findUserOptional(id)
        .map(existing -> {
          if (updateUser.getUsername() != null)
            existing.setUsername(updateUser.getUsername());
          if (updateUser.getEmail() != null)
            existing.setEmail(updateUser.getEmail());
          if (updateUser.getPhone() != null)
            existing.setPhone(updateUser.getPhone());
          if (updateUser.getRole() != null)
            existing.setRole(updateUser.getRole());
          if (updateUser.getCourse() != null)
            existing.setCourse(updateUser.getCourse());
          existing.setActive(updateUser.isActive());
          return new ResponseEntity<>(userService.register(existing), HttpStatus.OK);
        })
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
    userService.deleteUserById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/emails")
  public List<User> findAllUserByEmail(@RequestParam String email) {
    return userService.findAllUserByEmail(email);
  }

  @GetMapping("/email")
  public User findUserByEmail(@RequestParam String userEmail) {
    return userService.findUserByEmail(userEmail);
  }

  @PutMapping("/suspend/account/{id}")
  public ResponseEntity<Map<String, String>> suspendAccount(@PathVariable Long id,
      @RequestBody Map<String, String> body) {

    return userService.suspended(id, body.get("message"))
        .map(u -> ResponseEntity.ok(Map.of("message", "User Suspended")))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));

  }

  @PutMapping("/unsuspend/account/{id}")
  public ResponseEntity<Map<String, String>> unSuspendAccount(@PathVariable Long id) {
    return userService.Unsuspended(id)
        .map(u -> ResponseEntity.ok(Map.of("message", "User Restore!")))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
  }

}
