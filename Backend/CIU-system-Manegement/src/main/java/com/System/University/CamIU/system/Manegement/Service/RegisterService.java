package com.System.University.CamIU.system.Manegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.System.University.CamIU.system.Manegement.Model.Register;
import com.System.University.CamIU.system.Manegement.Repository.RegisterRepository;

@Service
public class RegisterService {

  @Autowired
  RegisterRepository registerRepository;

  public Register getRegisterAccount(Register users) {
    return registerRepository.save(users);
  }
}
