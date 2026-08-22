package com.ciu.sys.repository.contact;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.contact.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

  @Query("SELECT COUNT(c) FROM Contact c")
  long countContacts();

  List<Contact> findAllByOrderByIdDesc();

}
