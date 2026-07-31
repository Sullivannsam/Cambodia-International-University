package com.ciu.sys.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ciu.sys.dto.user.UserDto;
import com.ciu.sys.model.user.User;
import com.ciu.sys.model.user.Verification;
import com.ciu.sys.repository.user.UserRepository;
import com.ciu.sys.repository.user.VerificationRepository;

@Service
public class UserService {

  @Autowired
  UserRepository userRepository;

  @Autowired
  private VerificationRepository verificationRepo;

  @Autowired
  private JavaMailSender mailSender;

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
            user.getAddress(),
            user.getRole(),
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

  public User register(User user) {
    return userRepository.save(user);
  }

  public List<User> findAllUserByEmail(String email) {
    return userRepository.findAllByEmail(email);
  }

  public User findUserByEmail(String userEmail) {
    return userRepository.findByEmail(userEmail);
  }

  public String generateCode() {
    return String.valueOf((int) (Math.random() * 900000) + 100000);
  }

  public void sentVerificationEmail(String email, String code) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(email);
    msg.setSubject("Your Verification Code");
    msg.setText("Your CIU Verification is" + code + " It Expired in 10 minutes.");
    mailSender.send(msg);
  }

  public void creteVerificationCode(String email, String code) {
    Verification v = new Verification();
    v.setEmail(email);
    v.set(code);
    v.setExpiresAt(LocalDateTime.now().plusMinutes(10));
    v.setUsed(false);

    verificationRepo.save(v);
  }

  public boolean verifyCode(String email, String code) {
    return verificationRepo.findByEmail(email)
        .map(v -> !v.isUsed()
            && v.getCode().equals(code)
            && v.getExpiresAt().isAfter(LocalDateTime.now()))
        .orElse(false);
  }

  public void markCodeUsed() {
    verificationRepo.findByEmail(email)
        .ifPresent(v -> {
          v.setUsed(true);
          verificationRepo.save(v);
        });
  }

}
