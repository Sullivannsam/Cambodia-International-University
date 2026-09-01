package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Service.TuitionService;

@RestController
@RequestMapping("/api/tuition")
public class TuitionController {

  @Autowired
  private TuitionService tuitionService;

  @GetMapping("/programs")
  public List<Map<String, Object>> getPrograms() {
    return tuitionService.getPrograms();
  }

}
