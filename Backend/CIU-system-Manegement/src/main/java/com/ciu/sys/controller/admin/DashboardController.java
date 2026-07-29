package com.ciu.sys.controller.admin;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.service.admin.DashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

  @Autowired
  private DashboardService dashboardService;

  @GetMapping("/stats")
  public Map<String, Object> getDashboardStats() {
    return dashboardService.getStats();
  }

  @GetMapping("/attendance/student")
  public List<Map<String, Object>> getAttendanceStudent() {
    return dashboardService.getAttendanceStudent();
  }

  @GetMapping("/attendance/teacher")
  public List<Map<String, Object>> getAttendanceTeacher() {
    return dashboardService.getAttendanceTeacher();
  }

  @GetMapping("/income")
  public Map<String, Object> getIncomeData() {
    return dashboardService.getIncomeData();
  }

  @GetMapping("/earnings")
  public List<Map<String, Object>> getEarningData() {
    return dashboardService.getEarningData();
  }

  @GetMapping("/fee-groups")
  public List<String> getFeeGroupData() {
    return dashboardService.getFeeGroupData();
  }

  @GetMapping("/fee-groups/{group}")
  public List<Map<String, Object>> getFeeMemberData(@PathVariable String group) {
    return dashboardService.getFeeMemberData(group);
  }

}
