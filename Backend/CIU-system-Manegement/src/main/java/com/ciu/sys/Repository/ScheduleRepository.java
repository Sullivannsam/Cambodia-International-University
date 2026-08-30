package com.ciu.sys.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

  java.util.Optional<Schedule> findByJoinCode(String joinCode);
}
