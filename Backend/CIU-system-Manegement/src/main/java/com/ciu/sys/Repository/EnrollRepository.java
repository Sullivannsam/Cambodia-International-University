package com.ciu.sys.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Enroll;

@Repository
public interface EnrollRepository extends JpaRepository<Enroll, Long> {

  Optional<Enroll> findByEmail(String email);

}
