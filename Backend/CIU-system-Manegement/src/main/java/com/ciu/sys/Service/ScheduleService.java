package com.ciu.sys.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Repository.ScheduleRepository;

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
