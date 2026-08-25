package com.ciu.sys.repository.Schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.Schedule.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

}
