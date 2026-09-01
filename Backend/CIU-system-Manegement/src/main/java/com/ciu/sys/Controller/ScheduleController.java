package com.ciu.sys.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Service.ScheduleService;

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
  public List<Schedule> saveSchedule(@RequestBody SaveScheduleRequest request) {
    return service.saveSchedule(
        request.schedule() == null ? List.of() : request.schedule(),
        request.major(),
        request.field(),
        request.level(),
        request.semester());
  }

  @DeleteMapping("/{id}")
  public void deleteSchedule(@PathVariable Long id) {
    service.softDeleteRow(id);
  }

  @DeleteMapping
  public void deleteBlock(
      @RequestParam String major,
      @RequestParam String field,
      @RequestParam String level,
      @RequestParam String semester) {
    service.softDeleteBlock(major, field, level, semester);
  }

  public record SaveScheduleRequest(
      List<Schedule> schedule,
      String major,
      String field,
      String level,
      String semester) {
  }
}
