package com.System.University.CamIU.system.Manegement.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.System.University.CamIU.system.Manegement.Model.Login;
import com.System.University.CamIU.system.Manegement.Repository.LoginRepository;

@Service
public class LoginService {

  @Autowired
  LoginRepository loginRepository;

  public Login getUserLogin(Login user) {

    Optional<Login> foundUser = loginRepository.findByEmail(user.getEmail());

    if (foundUser == null) {
      return null;
    } else {
      return foundUser;
    }
  }
}
