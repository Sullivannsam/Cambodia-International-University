package com.ciu.sys.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ciu.sys.Model.AuditLog;
import com.ciu.sys.Repository.AuditLogRepository;

@Service
public class AuditService {

  @Autowired
  private AuditLogRepository repo;

  public void log(String actor, String action, String target, String details, String ip) {
    AuditLog e = new AuditLog();
    e.setActor(actor == null ? "anonymous" : actor);
    e.setAction(action);
    e.setTarget(target);
    e.setDetails(details);
    e.setIp(ip);
    e.setTimestamp(LocalDateTime.now().toString());
    repo.save(e);
  }
}
