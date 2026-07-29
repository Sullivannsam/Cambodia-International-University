package com.ciu.sys.service.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.repository.admin.AdminRepository;
import com.ciu.sys.repository.contact.ContactRepository;
import com.ciu.sys.repository.student.StudentRepository;
import com.ciu.sys.repository.teacher.TeacherRepository;
import com.ciu.sys.repository.user.UserRepository;

@Service
public class DashboardService {

  @Autowired
  private AdminRepository adminRepo;

  @Autowired
  private TeacherRepository teacherRepo;

  @Autowired
  private StudentRepository studentRepo;

  @Autowired
  private UserRepository userRepo;

  @Autowired
  private ContactRepository contactRepo;

  public Map<String, Object> getStats() {
    long adminCount = adminRepo.countAdmins();
    long contactCount = contactRepo.countContacts();
    long studentCount = studentRepo.countStudents();
    long teacherCount = teacherRepo.countTeachers();
    long userCount = userRepo.countUsers();

    List<Map<String, Object>> stats = new ArrayList<>();
    stats.add(Map.of("value", adminCount + teacherCount));
    stats.add(Map.of("value", userCount));
    stats.add(Map.of("value", studentCount));
    stats.add((Map.of("value", contactCount)));
    stats.add(Map.of("value", teacherCount));
  }
}
