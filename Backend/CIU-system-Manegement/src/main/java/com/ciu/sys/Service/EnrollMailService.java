package com.ciu.sys.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EnrollMailService {

  @Autowired
  private JavaMailSender mailSender;

  public void sendApprovalEmail(String to, String applicantName, String email, String password, String classLabel,
      String joinCode) {
    String subject = "Your CIU Enrollment Has Been Approved";

    StringBuilder body = new StringBuilder();
    body.append("Dear ").append(applicantName).append(",\n\n");
    body.append("Congratulations! Your enrollment application to Cambodia International University has been approved.\n\n");
    body.append("Your student account has been created:\n");
    body.append("  Email/Username: ").append(email).append("\n");
    body.append("  Temporary Password: ").append(password).append("\n\n");
    body.append("Please log in to the student portal and change your password from the account settings if you would like to use your own.\n\n");

    if (joinCode != null && !joinCode.isBlank()) {
      body.append("Your class (").append(classLabel).append(") is ready. ");
      body.append("Log in, go to \"My Class\", and click \"Join Class\" using this code: ").append(joinCode).append("\n\n");
    } else {
      body.append("Your class for ").append(classLabel)
          .append(" has not been opened yet. We will notify you in your student portal as soon as it is available.\n\n");
    }

    body.append("Welcome to CIU!\n");
    body.append("Cambodia International University");

    send(to, subject, body.toString());
  }

  public void sendRejectionEmail(String to, String applicantName, String comment) {
    String subject = "Update on Your CIU Enrollment Application";

    StringBuilder body = new StringBuilder();
    body.append("Dear ").append(applicantName).append(",\n\n");
    body.append("Thank you for applying to Cambodia International University. ");
    body.append("Unfortunately, we could not approve your application at this time for the following reason:\n\n");
    body.append("  ").append(comment).append("\n\n");
    body.append("Good news: since we already have your enrollment payment on file, you do NOT need to pay again. ");
    body.append("Please go back to the enrollment form on our website, use the same email address (")
        .append(to).append("), and fill it in again with the corrected/missing information.\n\n");
    body.append("Once resubmitted, our admissions team will review it again.\n\n");
    body.append("Cambodia International University");

    send(to, subject, body.toString());
  }

  private void send(String to, String subject, String body) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(to);
    msg.setSubject(subject);
    msg.setText(body);
    mailSender.send(msg);
  }
}
