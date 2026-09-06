package com.ciu.sys.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.ExamResult;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.Tuition;
import com.ciu.sys.Repository.ExamResultRepository;
import com.ciu.sys.Repository.PaymentRepository;
import com.ciu.sys.Repository.TuitionRepository;

@Service
public class TuitionService {

  private static final double EXAM_FEE = 10;
  private static final double REGISTRATION_FEE = 20;
  private static final double PASS_MARK = 50;

  @Autowired
  private TuitionRepository tutionRepo;

  @Autowired
  private ExamResultRepository examRepo;

  @Autowired
  private PaymentRepository paymentRepository;

  public List<Map<String, Object>> getPrograms() {
    List<Map<String, Object>> rows = new ArrayList<>();
    for (Tuition f : tutionRepo.findAll()) {
      rows.add(Map.of(
          "degree", f.getDegree() == null ? "" : f.getDegree(),
          "program", f.getProgram() == null ? "" : f.getProgram(),
          "fees", List.of(f.getYear1(), f.getYear2(), f.getYear3(), f.getYear4())));
    }
    return rows;
  }

  public boolean passed(String studentEmail) {
    List<ExamResult> rs = examRepo.findByStudentEmail(studentEmail);
    if (rs.isEmpty())
      return false;
    double avg = rs.stream().mapToDouble(ExamResult::getMark).average().orElse(0);
    return avg >= PASS_MARK;
  }

  public Map<String, Object> quote(StudentAccount s) {
    boolean passed = passed(s.getEmail());
    int year = s.getYear();
    int sem = s.getSemester();
    int nextYear = year;
    int nextSem = sem;
    if (passed) {
      if (sem < 2)
        nextSem = 2;
      else {
        nextYear = year + 1;
        nextSem = 1;
      }
    }
    String program = resolveProgram(s);
    double fee = feeFor(program, nextYear);
    double registration = hasPriorTuition(s) ? 0 : REGISTRATION_FEE;

    Map<String, Object> out = new HashMap<>();
    out.put("passed", passed);
    out.put("year", year); // current
    out.put("semester", sem); // current
    out.put("nextYear", nextYear); // revealed next semester & year
    out.put("nextSemester", nextSem);
    out.put("program", program);
    out.put("tuition", fee);
    out.put("examFee", EXAM_FEE);
    out.put("registrationFee", registration);
    out.put("total", Math.round(fee + EXAM_FEE + registration));
    return out;
  }

  public double feeFor(String program, int year) {
    if (program == null || year < 1 || year > 4)
      return 0;
    Tuition row = findProgram(program);
    if (row == null)
      return 0;
    double[] fees = { row.getYear1(), row.getYear2(), row.getYear3(), row.getYear4() };
    return fees[year - 1];
  }

  private Tuition findProgram(String program) {
    String resolved = normalizeProgram(program);
    if (resolved.isEmpty())
      return null;
    Optional<Tuition> exact = tutionRepo.findByDegreeAndProgram("bachelor", resolved);
    if (exact.isPresent())
      return exact.get();
    String p = resolved.trim().toLowerCase();
    for (Tuition f : tutionRepo.findAll()) {
      if (!"bachelor".equalsIgnoreCase(f.getDegree()))
        continue;
      String name = f.getProgram() == null ? "" : f.getProgram().trim().toLowerCase();
      if (name.equals(p) || name.contains(p) || p.contains(name))
        return f;
    }
    return null;
  }

  private String resolveProgram(StudentAccount s) {
    if (s.getMajor() != null && !s.getMajor().trim().isBlank())
      return s.getMajor().trim();
    if (s.getClasses() != null && s.getClasses().getMajor() != null
        && !s.getClasses().getMajor().trim().isBlank())
      return s.getClasses().getMajor().trim();
    return "";
  }

  public static String normalizeProgram(String program) {
    if (program == null)
      return "";
    String p = program.trim().toLowerCase();
    if (p.isBlank())
      return "";
    if (p.equals("it") || p.equals("cs") || p.equals("ict") || p.equals("software")
        || p.contains("computer"))
      return "Computer Science";
    if (p.contains("business"))
      return "Business Administration";
    if (p.contains("civil") || p.contains("engineering"))
      return "Civil Engineering";
    if (p.contains("english") || p.contains("literature"))
      return "English Literature";
    if (p.contains("international"))
      return "International Relations";
    return program.trim();
  }

  public static boolean sameProgram(String a, String b) {
    String na = normalizeProgram(a);
    String nb = normalizeProgram(b);
    return !na.isEmpty() && !nb.isEmpty() && na.equalsIgnoreCase(nb);
  }

  private boolean hasPriorTuition(StudentAccount s) {
    return paymentRepository.findAll().stream()
        .anyMatch(p -> p.getStudentId() != null && p.getStudentId().equals(s.getId())
            && "TUITION".equalsIgnoreCase(p.getType()));
  }
}
