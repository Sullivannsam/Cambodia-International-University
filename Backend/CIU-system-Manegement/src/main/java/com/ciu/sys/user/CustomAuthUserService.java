package com.ciu.sys.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ciu.sys.user.User;
import com.ciu.sys.user.UserPrincipal;
import com.ciu.sys.user.UserRepository;

@Service
public class CustomAuthUserService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findUserByUsername(username)
        .orElseGet(() -> userRepository.findByEmail(username));

    if (user == null) {
      throw new UsernameNotFoundException("User Not Found!");
    }

    return new UserPrincipal(user);
  }

}
