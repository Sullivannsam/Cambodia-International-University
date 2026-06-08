package com.System.University.CamIU.system.Manegement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.System.University.CamIU.system.Manegement.Model.Login;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {
  Optional<Login> findByEmail(String email);

}
