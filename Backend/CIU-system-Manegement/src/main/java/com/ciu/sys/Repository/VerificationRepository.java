package com.ciu.sys.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Verification;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {

  Optional<Verification> findTopByEmailOrderByIdDesc(String email);

}
