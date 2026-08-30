package com.ciu.sys.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Schedule;
import com.ciu.sys.Model.Teacher;
import com.ciu.sys.Model.TeacherAnnouncement;
import com.ciu.sys.Repository.ScheduleRepository;
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

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  public List<Schedule> getSchedule() {
    return repo.findAll();
  }

  public List<Schedule> saveSchedule(List<Schedule> entries) {
    return saveSchedule(entries, null, null, null, null);
  }

  // Saves a list of rows scoped to one block (major+field+level+semester).
  // Generates a unique join code for rows that need one and alerts the assigned
  // teacher (by email) with the code, so students can join that class.
  public List<Schedule> saveSchedule(List<Schedule> entries, String major, String field, String level, String semester) {
    List<Schedule> existing = repo.findAll();
    Set<Long> incomingIds = new HashSet<>();
    for (Schedule e : entries) {
      if (e.getId() != null) {
        incomingIds.add(e.getId());
      }
    }
    for (Schedule s : existing) {
      if (sameBlock(s, major, field, level, semester) && !incomingIds.contains(s.getId())) {
        repo.delete(s);
      }
    }

    List<Schedule> toSave = new ArrayList<>();
    List<Schedule> added = new ArrayList<>();
    for (Schedule e : entries) {
      if (e.getId() != null) {
        Schedule found = existing.stream()
            .filter(s -> Objects.equals(s.getId(), e.getId()))
            .findFirst()
            .orElse(null);
        if (found != null) {
          String prevTeacher = found.getTeacher();
          copy(found, e);
          if (isBlankOrEquals(prevTeacher, found.getTeacher())) {
            if (isBlank(found.getJoinCode())) {
              found.setJoinCode(generateUniqueCode(existing, toSave));
            }
          } else if (!isBlank(found.getTeacher())) {
            found.setJoinCode(generateUniqueCode(existing, toSave));
          }
          toSave.add(found);
          continue;
        }
      }
      e.setId(null);
      if (!isBlank(e.getTeacher())) {
        e.setJoinCode(generateUniqueCode(existing, toSave));
      }
      toSave.add(e);
      added.add(e);
    }

    List<Schedule> saved = repo.saveAll(toSave);
    for (Schedule s : saved) {
      if (added.contains(s) && !isBlank(s.getTeacher()) && !isBlank(s.getJoinCode())) {
        alertTeacher(s);
      }
    }
    return saved;
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

  private boolean isBlankOrEquals(String a, String b) {
    return (isBlank(a) && isBlank(b)) || eq(a, b);
  }

  private String generateUniqueCode(List<Schedule> existing, List<Schedule> toSave) {
    Set<String> used = new HashSet<>();
    for (Schedule s : existing) {
      if (!isBlank(s.getJoinCode())) {
        used.add(s.getJoinCode());
      }
    }
    for (Schedule s : toSave) {
      if (!isBlank(s.getJoinCode())) {
        used.add(s.getJoinCode());
      }
    }
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
        : (s.getEndDay() != null && !s.getEndDay().equals(s.getStartDay()) ? s.getStartDay() + " - " + s.getEndDay() : s.getStartDay());
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
  }
}