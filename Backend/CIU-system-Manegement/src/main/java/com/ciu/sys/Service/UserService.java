package com.ciu.sys.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ciu.sys.Dto.UserDto;
import com.ciu.sys.Model.User;
import com.ciu.sys.Model.Verification;
import com.ciu.sys.Repository.UserRepository;
import com.ciu.sys.Repository.VerificationRepository;

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

  public Optional<User> findUserOptional(Long id) {
    return userRepository.findById(id);
  }

  public List<UserDto> getListUser() {
    return userRepository.findAll()
        .stream()
        .filter(user -> !user.isDeleted())
        .map(user -> new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAddress(),
            user.getRole(),
            user.isActive(),
            user.getCreateAt(),
            user.getPhone(),
            user.getCourse(),
            user.isSuspended(),
            user.getSuspendedMessage()

        ))
        .collect(Collectors.toList());

  }

  public Optional<User> suspended(Long id, String message) {
    return userRepository.findById(id).map(user -> {
      user.setSuspended(true);
      user.setActive(false);
      user.setSuspendedMessage(message);

      return userRepository.save(user);
    });
  }

  public Optional<User> Unsuspended(Long id) {
    return userRepository.findById(id).map(user -> {
      user.setSuspended(false);
      user.setActive(true);
      user.setSuspendedMessage(null);

      return userRepository.save(user);
    });
  }

  public User updateUserById(User updateUser) {
    return userRepository.save(updateUser);
  }

  public void deleteUserById(Long id) {
    userRepository.findById(id).ifPresent(user -> {
      user.setDeleted(true);
      user.setActive(false);
      userRepository.save(user);
    });
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
    return String.valueOf((int) ((Math.random() * 900000) + 100000));
  }

  public void sendVerificationEmail(String email, String code) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(email);
    msg.setSubject("Your Verification Code");
    msg.setText("Your CIU Verification is " + code + " It Expired in 10 minutes.");
    mailSender.send(msg);
  }

  public void createVerificationCode(String email, String code) {
    Verification v = new Verification();
    v.setEmail(email);
    v.setCode(code);
    v.setExpiresAt(LocalDateTime.now().plusMinutes(10));
    v.setUsed(false);

    verificationRepo.save(v);
  }

  public boolean verifyCode(String email, String code) {
    return verificationRepo.findTopByEmailOrderByIdDesc(email)
        .map(v -> !v.isUsed()
            && v.getCode().equals(code)
            && v.getExpiresAt().isAfter(LocalDateTime.now()))
        .orElse(false);
  }

  public void markCodeUsed(String email) {
    verificationRepo.findTopByEmailOrderByIdDesc(email).ifPresent(v -> {
      v.setUsed(true);
      verificationRepo.save(v);
    });

  }

}
