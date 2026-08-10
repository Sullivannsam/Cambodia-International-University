package com.ciu.sys.controller.Course;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.model.Course.Course;
import com.ciu.sys.service.Course.CourseService;

@RestController
@RequestMapping("/api/admin/course")
public class CourseController {

  @Autowired
  private CourseService courseService;

  @GetMapping
  public List<Course> getAllCourse() {
    return courseService.getAllCourse();
  }

  @PostMapping
  public ResponseEntity<?> createCourse(@RequestBody Course course) {
    return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(course));
  }

  @PutMapping("/{id}")
  public Course updateCourse(@PathVariable Long id, @RequestBody Course course) {
    return courseService.updateCourse(id, course);

  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
    courseService.deleteCourseById(id);
    return ResponseEntity.noContent().build();
  }

}
