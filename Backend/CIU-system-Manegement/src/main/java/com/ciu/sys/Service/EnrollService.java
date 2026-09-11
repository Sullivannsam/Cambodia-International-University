package com.ciu.sys.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.Enroll;
import com.ciu.sys.Model.Payment;
import com.ciu.sys.Model.StudentAccount;
import com.ciu.sys.Model.StudentClass;
import com.ciu.sys.Repository.EnrollRepository;
import com.ciu.sys.Repository.PaymentRepository;
import com.ciu.sys.Repository.StudentRepository;

@Service
public class EnrollService {

  // Flat first-time enrollment fee. Adjust as needed.
  public static final double ENROLLMENT_FEE = 50.00;

  private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  private static final SecureRandom RANDOM = new SecureRandom();

  @Autowired
  private EnrollRepository enrollRepository;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private PaymentService paymentService;

  @Autowired
  private EnrollMailService enrollMailService;

  /**
   * Handles both a brand-new application and a resubmission after rejection.
   * A resubmission is detected by matching email: if that applicant already
   * paid before, we keep paid=true / studentAccountId so they are not charged
   * again, and we simply reset the application back to PENDING for review.
   */
  public Enroll getEnrollClass(Enroll incoming) {

    Optional<Enroll> existing = incoming.getEmail() == null
        ? Optional.empty()
        : enrollRepository.findByEmail(incoming.getEmail());

    if (existing.isPresent()) {
      Enroll e = existing.get();
      copyFields(incoming, e);
      e.setStatus("PENDING");
      e.setRejectComment(null);
      // paid + studentAccountId are intentionally left untouched here
      return enrollRepository.save(e);
    }

    incoming.setStatus("PENDING");
    incoming.setPaid(false);
    incoming.setStudentAccountId(null);
    incoming.setRejectComment(null);
    return enrollRepository.save(incoming);
  }

  private void copyFields(Enroll from, Enroll to) {
    to.setFirstNameEN(from.getFirstNameEN());
    to.setLastNameEN(from.getLastNameEN());
    to.setFirstNameKH(from.getFirstNameKH());
    to.setLastNameKH(from.getLastNameKH());
    to.setAge(from.getAge());
    to.setBirthDate(from.getBirthDate());
    to.setPalceOfBirth(from.getPalceOfBirth());
    to.setSex(from.getSex());
    to.setNational(from.getNational());
    to.setPhoneNumber(from.getPhoneNumber());
    to.setStartDate(from.getStartDate());
    to.setMajor(from.getMajor());
    to.setField(from.getField());
    to.setYear(from.getYear());
    to.setDegree(from.getDegree());
    to.setKhmerNationalIdFile(from.getKhmerNationalIdFile());
    to.setPhotoFile(from.getPhotoFile());
    to.setBacIIPhotoFile(from.getBacIIPhotoFile());
  }

  /**
   * Charges the first-time enrollment fee and generates the (inactive) student
   * account. The account stays inactive/unusable until an admin approves the
   * application; credentials are only emailed at approval time.
   */
  public Map<String, Object> payEnrollmentFee(Long enrollId) {

    Enroll enroll = enrollRepository.findById(enrollId).orElse(null);
    if (enroll == null) {
      return Map.of("error", true, "message", "Application not found.");
    }
    if (enroll.isPaid()) {
      return Map.of("error", true, "message", "This application has already been paid for.");
    }

    String email = generateStudentEmail(enroll.getFirstNameEN(), enroll.getLastNameEN());

    String tempPassword = generateRandomPassword();
    String hashed = passwordEncoder.encode(tempPassword);

    StudentAccount account = new StudentAccount();
    account.setUsername((nz(enroll.getFirstNameEN()) + " " + nz(enroll.getLastNameEN())).trim());
    account.setEmail(email);
    account.setPassword(hashed);
    account.setTempPassword(tempPassword);
    account.setPhone(enroll.getPhoneNumber());
    account.setRole("STUDENT");
    account.setActive(false); // stays inactive until admin approves
    account.setMajor(enroll.getMajor());
    account.setField(enroll.getField());
    account.setDegree(enroll.getDegree());
    account.setYear(parseStartYear(enroll.getYear()));
    account.setSemester(1);
    account = studentRepository.save(account);

    Payment payment = new Payment();
    payment.setAmount(ENROLLMENT_FEE);
    payment.setStudentId(account.getId());
    payment.setType("ENROLLMENT");
    payment.setDate(new java.sql.Date(System.currentTimeMillis()));
    paymentRepository.save(payment);

    enroll.setPaid(true);
    enroll.setStudentAccountId(account.getId());
    enrollRepository.save(enroll);

    return Map.of(
        "ok", true,
        "message", "Payment successful. Your application is now pending admin review.",
        "enrollId", enroll.getId(),
        "studentEmail", email);
  }

  /**
   * Admin approval: activates the generated account, tries to match it to an
   * existing class for the intake term the applicant chose, generates a fresh
   * password, and emails the credentials + (if matched) join code.
   */
  public Map<String, Object> approve(Enroll enroll) {

    if (enroll.getStudentAccountId() == null) {
      return Map.of("error", true,
          "message", "This applicant has not completed the enrollment payment yet.");
    }

    StudentAccount account = studentRepository.findById(enroll.getStudentAccountId()).orElse(null);
    if (account == null) {
      return Map.of("error", true, "message", "Linked student account no longer exists.");
    }

    // Reuse the temporary password created at payment time so any approval
    // email always matches the value stored in the database. If it is missing
    // (legacy account), generate and store a fresh one.
    String freshPassword = account.getTempPassword();
    if (freshPassword == null || freshPassword.isEmpty()) {
      freshPassword = generateRandomPassword();
      account.setTempPassword(freshPassword);
      account.setPassword(passwordEncoder.encode(freshPassword));
    }
    account.setActive(true);

    int year = parseStartYear(enroll.getYear());
    int semester = 1;
    StudentClass matched = paymentService.matchClass(account.getMajor(), account.getDegree(), account.getField(), year,
        semester);

    String joinCode = null;
    String classLabel = "Year " + year + " Semester " + semester;
    if (matched != null) {
      account.setClasses(matched);
      joinCode = matched.getGroup();
    }
    account.setYear(year);
    account.setSemester(semester);
    studentRepository.save(account);

    enroll.setStatus("APPROVED");
    enroll.setRejectComment(null);
    enrollRepository.save(enroll);

    String applicantName = (nz(enroll.getFirstNameEN()) + " " + nz(enroll.getLastNameEN())).trim();
    try {
      enrollMailService.sendApprovalEmail(enroll.getEmail(), applicantName, account.getEmail(), freshPassword,
          classLabel, joinCode);
    } catch (Exception ignored) {
      // Don't fail the approval if the mail server is unreachable.
    }

    return Map.of("ok", true, "message", "Application approved and credentials emailed.");
  }

  public Map<String, Object> reject(Enroll enroll, String comment) {

    if (comment == null || comment.trim().isEmpty()) {
      return Map.of("error", true, "message", "A comment explaining the rejection is required.");
    }

    enroll.setStatus("REJECTED");
    enroll.setRejectComment(comment.trim());
    enrollRepository.save(enroll);

    // Deactivate the account (if any) but keep it + the payment on file so the
    // applicant does not have to pay again when they resubmit the form.
    if (enroll.getStudentAccountId() != null) {
      studentRepository.findById(enroll.getStudentAccountId()).ifPresent(acc -> {
        acc.setActive(false);
        studentRepository.save(acc);
      });
    }

    String applicantName = (nz(enroll.getFirstNameEN()) + " " + nz(enroll.getLastNameEN())).trim();
    try {
      enrollMailService.sendRejectionEmail(enroll.getEmail(), applicantName, comment.trim());
    } catch (Exception ignored) {
      // Don't fail the rejection if the mail server is unreachable.
    }

    return Map.of("ok", true, "message", "Application rejected and applicant notified by email.");
  }

  private String generateStudentEmail(String firstNameEN, String lastNameEN) {
    String first = normalize(firstNameEN);
    String last = normalize(lastNameEN);
    String base = last + "." + first;
    String candidate = base + "@student-ciu";
    int suffix = 2;
    while (studentRepository.findByEmail(candidate).isPresent()) {
      candidate = base + suffix + "@student-ciu";
      suffix++;
    }
    return candidate;
  }

  private String normalize(String v) {
    if (v == null)
      return "";
    return v.trim().toLowerCase().replaceAll("[^a-z0-9]", "");
  }

  private String generateRandomPassword() {
    StringBuilder sb = new StringBuilder(12);
    for (int i = 0; i < 12; i++) {
      sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
    }
    return sb.toString();
  }

  private int parseStartYear(String yearField) {
    if (yearField == null)
      return 1;
    String digits = yearField.replaceAll("[^0-9]", "");
    if (digits.isEmpty())
      return 1;
    try {
      int y = Integer.parseInt(digits);
      return y < 1 ? 1 : y;
    } catch (NumberFormatException e) {
      return 1;
    }
  }

  private String nz(String v) {
    return v == null ? "" : v;
  }
}
