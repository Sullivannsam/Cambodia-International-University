package com.ciu.sys.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Course;
import com.ciu.sys.Repository.CourseRepository;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  public List<Course> getAllCourse() {
    return courseRepository.findAll();
  }

  public Course createCourse(Course course) {
    return courseRepository.save(course);
  }

  public Course updateCourse(Long id, Course update) {
    return courseRepository.findById(id).map(existing -> {
      if (update.getCode() != null)
        existing.setCode(update.getCode());
      if (update.getTitle() != null)
        existing.setTitle(update.getTitle());
      if (update.getInstructor() != null)
        existing.setInstructor(update.getInstructor());
      if (update.getDescription() != null)
        existing.setDescription(update.getDescription());
      existing.setCredits(update.getCredits());
      existing.setActive(update.isActive());
      existing.setFeatured(update.isFeatured());
      return courseRepository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Course not found"));
  }

  public void deleteCourseById(Long id) {
    courseRepository.deleteById(id);
  }

}
