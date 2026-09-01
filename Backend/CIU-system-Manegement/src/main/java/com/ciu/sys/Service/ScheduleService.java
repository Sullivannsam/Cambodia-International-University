package com.ciu.sys.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Model.Teacher;
import com.ciu.sys.Model.TeacherAnnouncement;
import com.ciu.sys.Repository.ScheduleRepository;
import com.ciu.sys.Repository.StudentClassRepository;
import com.ciu.sys.Repository.TeacherAnnouncementRepository;
import com.ciu.sys.Repository.TeacherRepository;

@Service
public class ScheduleService {

  @Autowired
  private ScheduleRepository repo;

  @Autowired
  private TeacherAnnouncementRepository announcementRepository;

  @Autowired
  private TeacherRepository teacherRepository;

  @Autowired
  private StudentClassRepository classRepo;

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  public List<Schedule> getSchedule() {
    return repo.findActive();
  }

  public List<Schedule> saveSchedule(List<Schedule> entries) {
    return saveSchedule(entries, null, null, null, null);
  }

  // Soft-deletes one schedule row (keeps it in the DB with active = false).
  public void softDeleteRow(Long id) {
    repo.findById(id).ifPresent(s -> {
      if (s.isActive()) {
        s.setActive(false);
        repo.save(s);
      }
    });
    syncClasses(repo.findActive());
  }

  // Soft-deletes a whole block (year/semester of a major/field).
  public void softDeleteBlock(String major, String field, String level, String semester) {
    for (Schedule s : repo.findActive()) {
      if (sameBlock(s, major, field, level, semester)) {
        s.setActive(false);
        repo.save(s);
      }
    }
    syncClasses(repo.findActive());
  }

  // Saves a list of rows scoped to one block (major+field+level+semester).
  // Generates a unique join code for rows that need one and alerts the assigned
  // teacher (by email) with the code, so students can join that class.
  public List<Schedule> saveSchedule(List<Schedule> entries, String major, String field, String level,
      String semester) {
    List<Schedule> existing = repo.findActive();
    Set<Long> incomingIds = new HashSet<>();
    for (Schedule e : entries) {
      if (e.getId() != null) {
        incomingIds.add(e.getId());
      }
    }
    for (Schedule s : existing) {
      if (sameBlock(s, major, field, level, semester) && !incomingIds.contains(s.getId())) {
        s.setActive(false);
        repo.save(s);
      }
    }

    Set<String> reservedCodes = new HashSet<>();
    for (Schedule s : existing) {
      if (!isBlank(s.getJoinCode())) {
        reservedCodes.add(s.getJoinCode());
      }
    }
    for (Schedule e : entries) {
      if (!isBlank(e.getJoinCode())) {
        reservedCodes.add(e.getJoinCode());
      }
    }

    // Assign one join code per block (year & semester of a major/field), shared by
    // all its subject rows. Computed BEFORE the copy loop so existing rows still
    // carry their DB code. A global save (null block params) must NOT stamp a
    // single code on every block, so the code is derived per block below.
    Map<String, String> blockCodes = new LinkedHashMap<>();
    for (Schedule sample : entries) {
      String key = blockKey(sample);
      if (blockCodes.containsKey(key)) {
        continue;
      }
      boolean groupHasTeacher = entries.stream()
          .anyMatch(s -> blockKey(s).equals(key) && !isBlank(s.getTeacher()));
      if (!groupHasTeacher) {
        blockCodes.put(key, null);
        continue;
      }
      String code = existing.stream()
          // Prefer the code already bound to this block's rows (matched by id), so
          // re-saving the same block never regenerates a join code.
          .filter(s -> !isBlank(s.getJoinCode()))
          .filter(s -> incomingIds.contains(s.getId()))
          .filter(s -> sameBlock(s, sample.getMajor(), sample.getField(), sample.getLevel(), sample.getSemester()))
          .map(Schedule::getJoinCode)
          .findFirst()
          .orElseGet(() -> existing.stream()
              .filter(s -> sameBlock(s, sample.getMajor(), sample.getField(), sample.getLevel(),
                  sample.getSemester()))
              .filter(s -> !isBlank(s.getJoinCode()))
              .map(Schedule::getJoinCode)
              .findFirst()
              .orElseGet(() -> generateUniqueCode(reservedCodes)));
      blockCodes.put(key, code);
      reservedCodes.add(code);
    }

    List<Schedule> toSave = new ArrayList<>();
    List<Schedule> added = new ArrayList<>();
    // One join code per class block (year+semester), shared by all its subject rows.
    for (Schedule e : entries) {
      if (e.getId() != null) {
        Schedule found = existing.stream()
            .filter(s -> Objects.equals(s.getId(), e.getId()))
            .findFirst()
            .orElse(null);
        if (found != null) {
          copy(found, e);
          toSave.add(found);
          continue;
        }
      }
      e.setId(null);
      toSave.add(e);
      added.add(e);
    }
    for (Schedule s : toSave) {
      String code = blockCodes.get(blockKey(s));
      if (code != null) {
        s.setJoinCode(code);
      }
    }

    List<Schedule> saved = repo.saveAll(toSave);
    syncClasses(saved);

    Set<String> alerted = new HashSet<>();
    for (Schedule s : saved) {
      if (added.contains(s) && !isBlank(s.getTeacher()) && !isBlank(s.getJoinCode())) {
        String alertKey = s.getTeacher() + "|" + s.getJoinCode();
        if (alerted.add(alertKey)) alertTeacher(s);
      }
    }
    return saved;
  }

  private String blockKey(Schedule s) {
    return nz(s.getMajor()) + "\u0000" + nz(s.getField()) + "\u0000"
        + nz(s.getLevel()) + "\u0000" + nz(s.getSemester());
  }

  private String nz(String v) {
    return v == null ? "" : v;
  }

  private boolean sameBlock(Schedule s, String major, String field, String level, String semester) {
    return eq(s.getMajor(), major) && eq(s.getField(), field)
        && eq(s.getLevel(), level) && eq(s.getSemester(), semester);
  }

  private boolean eq(String a, String b) {
    return Objects.equals(a, b);
  }

  private boolean isBlank(String v) {
    return v == null || v.trim().isEmpty();
  }

  private String generateUniqueCode(Set<String> used) {

    String code;
    do {
      char[] buf = new char[6];
      for (int i = 0; i < buf.length; i++) {
        buf[i] = CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length()));
      }
      code = new String(buf);
    } while (used.contains(code));
    return code;
  }

  private void alertTeacher(Schedule s) {

    if (isBlank(s.getTeacher())) {
      return;
    }
    Optional<Teacher> teacherOpt = teacherRepository.findByEmail(s.getTeacher());

    String name = teacherOpt.map(Teacher::getUsername).orElse(s.getTeacher());
    String subject = isBlank(s.getSubject()) ? s.getCourse() : s.getSubject();
    String days = isBlank(s.getStartDay()) ? (isBlank(s.getDay()) ? "" : s.getDay())
        : (s.getEndDay() != null && !s.getEndDay().equals(s.getStartDay()) ? s.getStartDay() + " - " + s.getEndDay()
            : s.getStartDay());

    String title = "Class Join Code - " + subject;
    String message = "Hello " + name + ",\n\n"
        + "You have been assigned to teach \"" + subject + "\""
        + (isBlank(s.getMajor()) ? "" : " (" + s.getMajor() + (isBlank(s.getField()) ? "" : " - " + s.getField()) + ")")
        + " for " + (isBlank(s.getLevel()) ? "" : s.getLevel() + ", ")
        + (isBlank(s.getSemester()) ? "" : s.getSemester()) + ".\n"
        + "Your class join code is: " + s.getJoinCode() + "\n"
        + (isBlank(days) ? "" : "Days: " + days + "\n")
        + (isBlank(s.getTime()) ? "" : "Time: " + s.getTime() + "\n")
        + (isBlank(s.getRoom()) ? "" : "Room: " + s.getRoom() + "\n\n")
        + "Share this code with your students so they can join the class.";

    TeacherAnnouncement a = new TeacherAnnouncement();

    a.setTeacherEmail(s.getTeacher());
    a.setTitle(title);
    a.setMessage(message);

    announcementRepository.save(a);
  }

  private void copy(Schedule to, Schedule from) {

    to.setMajor(from.getMajor());
    to.setField(from.getField());
    to.setLevel(from.getLevel());
    to.setSemester(from.getSemester());
    to.setDay(from.getDay());
    to.setStartDay(from.getStartDay());
    to.setEndDay(from.getEndDay());
    to.setTime(from.getTime());
    to.setCourse(from.getCourse());
    to.setSubject(from.getSubject());
    to.setRoom(from.getRoom());
    to.setInstructor(from.getInstructor());
    to.setTeacher(from.getTeacher());
    to.setJoinCode(from.getJoinCode());
    to.setActive(true);
  }

  private void syncClasses(List<Schedule> saved) {

    for (Schedule s : saved) {

      if (isBlank(s.getTeacher()) || isBlank(s.getJoinCode()))
        continue;

      Teacher t = teacherRepository.findByEmail(s.getTeacher()).orElse(null);
      StudentClass cls = classRepo.findAllByGroup(s.getJoinCode())
          .stream().findFirst().orElse(null);

      if (cls == null) {
        cls = new StudentClass();
        cls.setGroup(s.getJoinCode());
        cls.setActive(true);
      }
      cls.setTeacher(t);
      cls.setMajor(s.getMajor());
      cls.setYear(s.getLevel()); // "Year 1"
      cls.setShift(s.getSemester()); // "Semester 1"
      classRepo.save(cls);
    }

    // Collect every join code that is still in use (any block bound to a teacher).
    Set<String> activeCodes = new HashSet<>();
    for (Schedule s : repo.findActive()) {
      if (!isBlank(s.getTeacher()) && !isBlank(s.getJoinCode())) {
        activeCodes.add(s.getJoinCode());
      }
    }

    // Soft-delete orphaned classes whose code no longer maps to any active schedule.
    for (StudentClass c : classRepo.findByActiveTrue()) {
      if (!activeCodes.contains(c.getGroup())) {
        c.setActive(false);
        classRepo.save(c);
      }
    }
  }

}
