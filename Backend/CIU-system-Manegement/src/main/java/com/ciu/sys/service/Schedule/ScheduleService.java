package com.ciu.sys.service.Schedule;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.Schedule.Schedule;
import com.ciu.sys.repository.Schedule.ScheduleRepository;

@Service
public class ScheduleService {

  @Autowired
  private ScheduleRepository repo;

  public List<Schedule> getSchedule() {
    return repo.findAll();
  }

  public List<Schedule> saveSchedule(List<Schedule> entries) {
    repo.deleteAll();
    for (Schedule e : entries) {
      e.setId(null);
    }
    return repo.saveAll(entries);
  }
}
