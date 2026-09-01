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
import com.ciu.sys.Repository.TuitionRepository;

@Service
public class TuitionService {

  private static final double EXAM_FEE = 10;
  private static final double PASS_MARK = 50;

  @Autowired
  private TuitionRepository tutionRepo;

  @Autowired
  private ExamResultRepository examRepo;

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
    double fee = feeFor(s.getMajor(), nextYear);

    Map<String, Object> out = new HashMap<>();
    out.put("passed", passed);
    out.put("year", year); // current
    out.put("semester", sem); // current
    out.put("nextYear", nextYear); // revealed next semester & year
    out.put("nextSemester", nextSem);
    out.put("tuition", fee);
    out.put("examFee", EXAM_FEE);
    out.put("total", Math.round(fee + EXAM_FEE));
    return out;
  }

  public double feeFor(String program, int year) {
    Optional<Tuition> row = tutionRepo.findByDegreeAndProgram("bachelor", program);
    if (row.isEmpty() || year < 1 || year > 4)
      return 0;
    Tuition f = row.get();
    double[] fees = { f.getYear1(), f.getYear2(), f.getYear3(), f.getYear4() };
    return fees[year - 1];
  }
}
