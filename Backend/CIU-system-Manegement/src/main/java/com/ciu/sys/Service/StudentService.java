package com.ciu.sys.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Student;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.exception.ResourceNotFoundException;

@Service
public class StudentService {

  @Autowired
  private StudentRepository studentRepository;

  public Student studentRegisterAccount(Student student) {
    return studentRepository.save(student);
  }

  public List<Student> findAllStudent() {
    return studentRepository.findAll();
  }

  public Student findStudentById(Long id) {
    return studentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Student not found by id" + id));
  }
}
