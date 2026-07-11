package com.ciu.sys.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Dto.UserDto;
import com.ciu.sys.Model.User;
import com.ciu.sys.Repository.UserRepository;

@Service
public class UserService {

  @Autowired
  UserRepository userRepository;

  public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElse(new User());
  }

  public List<UserDto> getListUser() {
    return userRepository.findAll()
        .stream()
        .map(user -> new UserDto(
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getAddress(),
            user.isActive(),
            user.getCreateAt(),
            user.getPhone()

        ))
        .collect(Collectors.toList());

  }

  public User updateUserById(User updateUser) {
    return userRepository.save(updateUser);
  }

  public void deleteUserById(Long id) {
    userRepository.deleteById(id);
  }

  public boolean authenticate(String email, String password) {
    User user = userRepository.findByEmail(email);
    return user != null && user.getPassword().equals(password);
  }

  public User register(User user) {
    return userRepository.save(user);
  }

  public List<User> findAllUserByEmail(String email) {
    return userRepository.findAllByEmail(email);
  }

  public User findUserByEmail(String userEmail) {
    return userRepository.findByEmail(userEmail);
  }

}
