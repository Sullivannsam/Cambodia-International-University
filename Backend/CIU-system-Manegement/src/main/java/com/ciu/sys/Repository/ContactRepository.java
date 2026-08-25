package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

  @Query("SELECT COUNT(c) FROM Contact c")
  long countContacts();

  List<Contact> findAllByOrderByIdDesc();

}
