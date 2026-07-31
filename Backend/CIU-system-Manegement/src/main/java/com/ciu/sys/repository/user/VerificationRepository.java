package com.ciu.sys.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.user.Verification;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {

  Optional<Verification> findTopByEmailOrderByIdDesc(String email);

}
