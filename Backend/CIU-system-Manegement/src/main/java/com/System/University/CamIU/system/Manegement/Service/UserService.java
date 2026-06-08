package com.System.University.CamIU.system.Manegement.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.System.University.CamIU.system.Manegement.Model.User;
import com.System.University.CamIU.system.Manegement.Repository.UserRepository;

@Service
public class UserService {

  @Autowired
  UserRepository userRepository;

  public List<User> getListUser() {
    return userRepository.findAll();
  }

}
