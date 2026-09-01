package com.ciu.sys.Service;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Payment;
import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Repository.PaymentRepository;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentClassRepository;
import com.ciu.sys.Repository.StudentRepository;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private TuitionService tuitionService;

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @Autowired
  private StudentRepository studentRepository;

  public Payment paymentInstitute(Payment payment) {

    return paymentRepository.save(payment);
  }

  public Map<String, Object> payTuition(StudentAccount student) {

    Map<String, Object> q = tuitionService.quote(student);
    int nextYear = (int) q.get("nextYear");
    int nextSem = (int) q.get("nextSemester");

    Payment p = new Payment();

    p.setAmount(((Number) q.get("total")).doubleValue());
    p.setStudentId(student.getId());
    p.setType("TUITION");
    p.setDate(new java.sql.Date(System.currentTimeMillis()));
    paymentRepository.save(p);

    StudentClass cls = matchClass(student.getMajor(), nextYear, nextSem);

    if (cls != null) {
      student.setClasses(cls);
      student.setYear(nextYear);
      student.setSemester(nextSem);
      studentRepository.save(student);
    }
    return q;
  }

  private StudentClass matchClass(String major, int year, int semester) {

    String level = "Year " + year;
    String sem = "Semester " + semester;
    Optional<Schedule> sched = scheduleRepository.findAll().stream()
        .filter(s -> Objects.equals(s.getLevel(), level))
        .filter(s -> Objects.equals(s.getSemester(), sem))
        .filter(s -> s.getMajor() != null && major != null && s.getMajor().contains(major))
        .filter(s -> s.getJoinCode() != null && !s.getJoinCode().isBlank())
        .findFirst();
    if (sched.isEmpty())
      return null;

    return studentClassRepository.findByGroup(sched.get().getJoinCode())
        .stream().findFirst().orElse(null);
  }
}
