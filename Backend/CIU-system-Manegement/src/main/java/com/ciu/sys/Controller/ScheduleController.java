package com.ciu.sys.controller.Schedule;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.Schedule.Schedule;
import com.ciu.sys.service.Schedule.ScheduleService;

@RestController
@RequestMapping("/api/admin/schedule")
public class ScheduleController {

  @Autowired
  private ScheduleService service;

  @GetMapping
  public List<Schedule> getSchedule() {
    return service.getSchedule();
  }

  @PostMapping
  public List<Schedule> saveSchedule(@RequestBody Map<String, List<Schedule>> body) {
    return service.saveSchedule(body.get("schedule"));
  }

}
