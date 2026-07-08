package com.ciu.sys.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.User;
import com.ciu.sys.Repository.UserRepository;
import com.ciu.sys.exception.ResourceNotFoundException;
import com.ciu.sys.exception.UnauthorizedException;

@Service
public class UserService {

  @Autowired
  UserRepository userRepository;

  public List<User> getListUser() {
    return userRepository.findAll();
  }

  public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElse(new User());

  }

  public User updateUserById(User updateUser) {
    return userRepository.save(updateUser);
  }

  public void deleteUserById(Long id) {
    userRepository.deleteById(id);
  }

  public boolean authenticate(String email, String password) {
    User user = userRepository.findByEmail(email).orElse(null);
    return user != null && user.getPassword().equals(password);
  }

  public User register(User user) {
    return userRepository.save(user);
  }

}
