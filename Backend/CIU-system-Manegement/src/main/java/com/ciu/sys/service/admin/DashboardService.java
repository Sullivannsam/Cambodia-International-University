package com.ciu.sys.service.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.Locale;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.model.finance.Payment;
import com.ciu.sys.model.student.StudentAttendance;
import com.ciu.sys.model.student.StudentClass;
import com.ciu.sys.model.teacher.TeacherAttendance;
import com.ciu.sys.repository.admin.AdminRepository;
import com.ciu.sys.repository.contact.ContactRepository;
import com.ciu.sys.repository.finance.PaymentRepository;
import com.ciu.sys.repository.student.StudentClassRepository;
import com.ciu.sys.repository.student.StudentRepository;
import com.ciu.sys.repository.student.studentAttendanceRepository;
import com.ciu.sys.repository.teacher.TeacherAttendanceRepository;
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
  private studentAttendanceRepository studentAttendanceRepo;

  @Autowired
  private TeacherAttendanceRepository teacherAttendanceRepo;

  @Autowired
  private ContactRepository contactRepo;

  @Autowired
  private StudentClassRepository studentClassRepo;

  @Autowired
  private PaymentRepository paymentRepo;

  public Map<String, Object> getStats() {
    long adminCount = adminRepo.countAdmins();
    long contactCount = contactRepo.countContacts();
    long studentCount = studentRepo.countStudents();
    long teacherCount = teacherRepo.countTeachers();
    long userCount = userRepo.countUsers();

    List<Map<String, Object>> values = new ArrayList<>();
    values.add(Map.of("value", adminCount + teacherCount)); // TotalStaff
    values.add(Map.of("value", userCount)); // TotalUsers
    values.add(Map.of("value", studentCount)); // TotalStudents
    values.add(Map.of("value", contactCount)); // TotalContact

    Map<String, Object> stats = new HashMap<>();
    stats.put("stats", values);
    return stats;
  }

  public List<Map<String, Object>> getAttendanceTeacher() {
    List<Map<String, Object>> teachers = new ArrayList<>();
    for (TeacherAttendance ta : teacherAttendanceRepo.findAll()) {
      Map<String, Object> items = new HashMap<>();
      items.put("id", ta.getId());
      items.put("attendance", ta.getAttendance());
      items.put("isPresent", ta.isPresent());
      if (ta.getTeacher() != null) {
        items.put("teacher", ta.getTeacher().getUsername());
        teachers.add(items);
      }
    }
    return teachers;
  }

  public List<Map<String, Object>> getAttendanceStudent() {
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentAttendance sa : studentAttendanceRepo.findAll()) {
      Map<String, Object> item = new HashMap<>();
      item.put("id", sa.getId());
      item.put("attendance", sa.getAttendance());
      item.put("present", sa.isPresent());
      if (sa.getStudents() != null)
        item.put("student", sa.getStudents().getUsername());
      result.add(item);
    }
    return result;
  }

  public Map<String, Object> getIncomeData() {
    Map<String, Object> data = new HashMap<>();
    Double total = paymentRepo.findAll().stream()
        .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0).sum();
    data.put("TotalIncome", total);
    return data;
  }

  public List<Map<String, Object>> getEarningData() {
    Map<String, double[]> byMonth = new TreeMap<>(); // "yyyy-MM" -> [a, b]
    for (Payment p : paymentRepo.findAll()) {
      if (p.getAmount() == null || p.getDate() == null)
        continue;
      String key = p.getDate().toLocalDate().format(DateTimeFormatter.ofPattern("yyyy-MM"));
      String type = p.getType() == null ? "" : p.getType().toLowerCase();
      boolean core = type.contains("tuition") || type.contains("registration");
      double[] arr = byMonth.computeIfAbsent(key, k -> new double[2]);
      arr[0] += p.getAmount(); // a = all income that month
      if (core)
        arr[1] += p.getAmount(); // b = core fees that month
    }

    List<Map<String, Object>> result = new ArrayList<>();
    DateTimeFormatter label = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);
    for (Map.Entry<String, double[]> e : byMonth.entrySet()) {
      result.add(Map.of(
          "m", YearMonth.parse(e.getKey()).format(label), // "Aug"
          "a", Math.round(e.getValue()[0]),
          "b", Math.round(e.getValue()[1])));
    }
    return result;
  }

  public List<String> getFeeGroupData() {
    return studentClassRepo.findDistinctGroups();
  }

  public List<Map<String, Object>> getFeeMemberData(String group) {
    List<Map<String, Object>> result = new ArrayList<>();
    for (StudentClass sc : studentClassRepo.findByGroup(group)) {
      Map<String, Object> item = new HashMap<>();
      item.put("classId", sc.getId());
      item.put("major", sc.getMajor());
      item.put("year", sc.getYear());
      item.put("shift", sc.getShift());
      if (sc.getTeacher() != null)
        item.put("teacher", sc.getTeacher().getUsername());
      result.add(item);
    }
    return result;
  }
}
