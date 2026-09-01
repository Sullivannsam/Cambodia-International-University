package com.ciu.sys.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

  Optional<Schedule> findByJoinCode(String joinCode);

  @Query("SELECT s FROM Schedule s WHERE s.active = true")
  List<Schedule> findActive();

}