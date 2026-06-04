package com.System.University.CamIU.system.Manegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.System.University.CamIU.system.Manegement.Repository.ContactRepository;

@Service
public class ContactService {
  @Autowired
  private ContactRepository contactRepo;

}
