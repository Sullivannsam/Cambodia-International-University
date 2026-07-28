package com.ciu.sys.Config;

import com.ciu.sys.service.user.CustomAuthUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CusAuthProvider implements AuthenticationProvider {

  @Autowired
  private CustomAuthUserService customAuthUserService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    String username = authentication.getName();
    String password = authentication.getCredentials().toString();

    UserDetails userDetails = customAuthUserService.loadUserByUsername(username);

    if (!passwordEncoder.matches(password, userDetails.getPassword())) {
      throw new BadCredentialsException("Invalid Credentials");
    } else {
      return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
  }

  @Override
  public boolean supports(Class<?> authentication) {

    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }

}
