package com.ciu.sys.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Tuition;

@Repository
public interface TuitionRepository extends JpaRepository<Tuition, Long> {

  List<Tuition> findByDegree(String degree);

  Optional<Tuition> findByDegreeAndProgram(String degree, String program);
}
