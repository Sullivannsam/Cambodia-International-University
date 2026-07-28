package com.ciu.sys.repository.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.contact.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

}
