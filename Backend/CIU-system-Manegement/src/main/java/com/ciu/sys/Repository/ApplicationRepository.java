package com.ciu.sys.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

  Optional<Application> findByCode(String code);

  List<Application> findAllByOrderByIdDesc();

  long countByReadFalse();

}