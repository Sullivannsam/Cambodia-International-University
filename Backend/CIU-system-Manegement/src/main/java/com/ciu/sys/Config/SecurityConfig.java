package com.ciu.sys.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

    httpSecurity
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth

            // GET Request
            .requestMatchers(HttpMethod.GET, "/").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/auth/users/**").permitAll()
            // POST Request
            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/login/admin").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

            // PUT Request

            // DELETE Request
            .anyRequest().authenticated());

    httpSecurity
        .formLogin(form -> form.disable())
        .httpBasic(Customizer.withDefaults());

    return httpSecurity.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  private AuthenticationManager authenticationManager(AuthenticationManager config) {
    return config;
  }
}
