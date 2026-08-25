package com.ciu.sys.service.Enroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.enrollment.Enroll;
import com.ciu.sys.repository.Enroll.EnrollRepository;

@Service
public class EnrollService {

  @Autowired
  private EnrollRepository enrollRepository;

  public Enroll getEnrollClass(Enroll enroll) {
    return enrollRepository.save(enroll);
  }

}
