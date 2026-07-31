package com.ciu.sys.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@EnableMethodSecurity
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
            .requestMatchers(HttpMethod.GET, "/api/auth/students").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/auth/teacher/list").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/auth/account/admin").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/auth/account/admin").permitAll()
            // POST Request
            .requestMatchers(HttpMethod.POST, "/api/public/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/login/admin").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/register/admin").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/teacher/login/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/teacher/register/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/students/login/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/students/register/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/student/payment-fee").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/verification/register").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/verification/verify").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/verification/resend").permitAll()

            // PUT Request
            .requestMatchers(HttpMethod.PUT, "/api/auth/users/suspend/account/{id}").permitAll()
            .requestMatchers(HttpMethod.PUT, "/api/auth/users/unsuspend/account/{id}").permitAll()

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
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
