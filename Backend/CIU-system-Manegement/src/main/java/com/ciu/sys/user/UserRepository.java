package com.ciu.sys.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  public User findByEmail(String email);

  public List<User> findAllByEmail(String email);

  public Optional<User> findUserByUsername(String username);

  public Optional<User> findUserByAddress(String address);

  void deleteUserById(Long id);

  @Query("SELECT COUNT(u) FROM User u")
  long countUsers();
}
