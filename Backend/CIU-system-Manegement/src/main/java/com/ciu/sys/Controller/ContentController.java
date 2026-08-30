package com.ciu.sys.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ciu.sys.Model.Contact;
import com.ciu.sys.Service.ApplicationService;
import com.ciu.sys.Service.ContactService;
import com.ciu.sys.Service.NewsletterService;

@RestController
@RequestMapping("/api/public")
public class ContentController {

  @Autowired
  private ContactService contactService;

  @Autowired
  private NewsletterService newsletterService;

  @Autowired
  private ApplicationService applicationService;

  @GetMapping
  public Contact getContact() {
    return contactService.getUserContact();
  }

  @PostMapping("/contact/report-message")
  public Contact saveContact(@RequestBody Contact contact) {
    return contactService.saveContact(contact);
  }

  @PostMapping("/newsletter")
  public Map<String, Object> subscribeNewsletter(@RequestBody Map<String, String> body) {
    return newsletterService.subscribe(body);
  }

  @GetMapping("/newsletter")
  public List<?> getNewsletterSubscribers() {
    return newsletterService.getAll();
  }

  @PostMapping("/applications")
  public Map<String, Object> submitApplication(@RequestBody Map<String, Object> body) {
    return applicationService.submit(body);
  }

  @GetMapping("/applications")
  public List<Map<String, Object>> getApplications() {
    return applicationService.getAll();
  }

  @GetMapping("/applications/{code}")
  public Map<String, Object> getApplicationStatus(@PathVariable String code) {
    return applicationService.status(code);
  }

}
