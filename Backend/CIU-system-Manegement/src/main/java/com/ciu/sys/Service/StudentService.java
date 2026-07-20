package com.ciu.sys.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Student;
import com.ciu.sys.Repository.StudentRepository;

@Service
public class StudentService {

  @Autowired
  private StudentRepository studentRepository;

  public Student studentRegisterAccount(Student student) {
    return studentRepository.save(student);
  }
}
