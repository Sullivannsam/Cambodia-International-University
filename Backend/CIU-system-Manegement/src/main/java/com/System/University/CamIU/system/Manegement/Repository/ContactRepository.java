package com.System.University.CamIU.system.Manegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.System.University.CamIU.system.Manegement.Model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

}
