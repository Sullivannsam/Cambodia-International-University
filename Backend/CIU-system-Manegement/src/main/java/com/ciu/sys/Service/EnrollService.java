package com.ciu.sys.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Enroll;
import com.ciu.sys.Repository.EnrollRepository;

@Service
public class EnrollService {

  @Autowired
  private EnrollRepository enrollRepository;

  public Enroll getEnrollClass(Enroll enroll) {
    return enrollRepository.save(enroll);
  }

}
