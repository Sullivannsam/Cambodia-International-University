package com.ciu.sys.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Contact;
import com.ciu.sys.Repository.ContactRepository;

@Service
public class ContactService {
  @Autowired
  private ContactRepository contactRepo;

  public Contact getUserContact() {
    return contactRepo.findById(1L).orElse(null);
  }
}
