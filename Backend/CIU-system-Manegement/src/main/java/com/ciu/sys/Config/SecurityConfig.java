package com.ciu.sys.Config;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.mail.Session;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

  @Autowired
  private JwtAuthFilter jwtAuthFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

    httpSecurity
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth

            // GET
            .requestMatchers(HttpMethod.GET, "/").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/news").permitAll()

            // POST
            .requestMatchers(HttpMethod.POST, "/api/public/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/login/admin").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/students/login/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/students/register/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/teacher/login/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/teacher/register/account").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/verification/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()

            // Role-protected
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/students/**").hasRole("STUDENT")
            .requestMatchers("/api/teachers/**").hasRole("TEACHER")

            // Adminaccount lists
            .requestMatchers(HttpMethod.GET, "/api/auth/users/users").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/auth/students").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/auth/teacher/list").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/auth/account/admin").hasRole("ADMIN")

            // DELETE
            .anyRequest().authenticated());

    httpSecurity
        .formLogin(form -> form.disable())
        .httpBasic(AbstractHttpConfigurer::disable)
        .sessionManagement(Session -> Session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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
