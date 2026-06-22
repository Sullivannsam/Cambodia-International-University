package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

}
