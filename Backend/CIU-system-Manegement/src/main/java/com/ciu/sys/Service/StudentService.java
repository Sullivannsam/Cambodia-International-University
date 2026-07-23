package com.ciu.sys.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Repository.StudentRepository;
import com.ciu.sys.exception.ResourceNotFoundException;

@Service
public class StudentService {

  @Autowired
  private StudentRepository studentRepository;

  public Optional<StudentAccount> findByEmail(String email) {
    return studentRepository.findByEmail(email);
  }

  public StudentAccount studentRegisterAccount(StudentAccount student) {
    return studentRepository.save(student);
  }

  public List<StudentAccount> findAllStudent() {
    return studentRepository.findAll();
  }

  public StudentAccount findStudentById(Long id) {
    return studentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Student not found by id" + id));
  }
}
