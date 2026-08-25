package com.ciu.sys.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Teacher;
import com.ciu.sys.Repository.TeacherRepository;
import com.ciu.sys.common.ResourceNotFoundException;

@Service
public class TeacherService {

  @Autowired
  private TeacherRepository repository;

  public Teacher register(Teacher teacher) {
    return repository.save(teacher);
  }

  public List<Teacher> findAllTeacher() {
    return repository.findAll();
  }

  public Optional<Teacher> findAllByEmail(String email) {
    return repository.findByEmail(email);
  }

  public Teacher findAllById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User Not Found with id: " + id));
  }

}
