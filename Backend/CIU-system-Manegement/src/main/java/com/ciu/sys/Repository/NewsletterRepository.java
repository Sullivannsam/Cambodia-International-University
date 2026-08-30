package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.NewsletterSubscription;

@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterSubscription, Long> {

  boolean existsByEmailIgnoreCase(String email);

  List<NewsletterSubscription> findAllByOrderByIdDesc();

}