package com.ciu.sys.Config;

import com.ciu.sys.Model.User;
import com.ciu.sys.Repository.UserRepository;
import com.ciu.sys.Service.UserService;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

public class CusAuthProvider implements AuthenticationProvider {

  @Autowired
  private UserService userService;

  @Autowired
  private UserRepository userRepository;

  @Override
  public @Nullable Authentication authenticate(Authentication arg0) throws AuthenticationException {
    User userVerify = userRepository.findByEmail(email);
    if (userVerify != null) {
      userVerify.getUsername();
      userVerify.getPassword();
    }
    return null;

  }

  @Override
  public boolean supports(Class<?> authentication) {

    return false;
  }

}
