package com.ciu.sys.service.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.contact.Contact;
import com.ciu.sys.repository.contact.ContactRepository;

@Service
public class ContactService {
  @Autowired
  private ContactRepository contactRepo;

  public Contact getUserContact() {
    return contactRepo.findById(1L).orElse(null);
  }

  public Contact saveContact(Contact contact) {
    return contactRepo.save(contact);
  }
}
