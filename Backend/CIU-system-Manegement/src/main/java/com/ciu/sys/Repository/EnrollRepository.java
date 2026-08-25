package com.ciu.sys.repository.Enroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.enrollment.Enroll;

@Repository
public interface EnrollRepository extends JpaRepository<Enroll, Long> {

}
