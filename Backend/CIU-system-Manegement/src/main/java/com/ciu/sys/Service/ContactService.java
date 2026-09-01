package com.ciu.sys.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Contact;
import com.ciu.sys.Repository.ContactRepository;

@Service
public class ContactService {
  @Autowired
  private ContactRepository contactRepo;

  public List<Contact> getAllContact() {
    return contactRepo.findAllByOrderByIdDesc();
  }

  public Contact getUserContact() {
    return contactRepo.findById(1L).orElse(null);
  }

  public Contact saveContact(Contact contact) {
    return contactRepo.save(contact);
  }

  public Contact readContact(Long id) {
    Contact c = contactRepo.findById(id).orElse(null);
    if (c != null) {
      c.setRead(true);
      return contactRepo.save(c);
    }
    return null;
  }

  public void deleteContactById(Long id) {
    contactRepo.findById(id).ifPresent(contact -> {
      contact.setActive(false);
      contactRepo.save(contact);
    });
  }

}
