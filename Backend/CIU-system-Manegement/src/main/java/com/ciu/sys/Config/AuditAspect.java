package com.ciu.sys.Config;

import jakarta.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ciu.sys.Service.AuditService;

@Aspect
@Component
public class AuditAspect {

  @Autowired
  private AuditService auditService;

  @Pointcut("within(com.ciu.sys.Controller..*)")
  public void controllers() {
  }

  @AfterReturning("controllers()")
  public void afterController(JoinPoint joinPoint) {
    ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    if (attrs == null) {
      return;
    }

    HttpServletRequest req = attrs.getRequest();
    String path = req.getRequestURI();
    String[] adminBases = { "/api/admin/", "/api/auth/admin" };

    if (path == null) {
      return;

    }

    boolean isAdmin = false;

    for (String base : adminBases) {
      if (path.startsWith(base)) {
        isAdmin = true;
        break;
      }
    }

    if (!isAdmin) {
      return;

    }
    if (path.contains("audit-logs")) {
      return;
    }

    String method = req.getMethod();
    if (!method.equals("POST") && !method.equals("PUT") && !method.equals("DELETE")) {
      return;
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String actor = auth == null ? "anonymous" : auth.getName();

    auditService.log(
        actor,
        method,
        path,
        sectionName(joinPoint),
        clientIp(req));
  }

  private String sectionName(JoinPoint joinPoint) {
    String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
    String name = className.replace("Controller", "");
    name = name.replace("Admin", "")
        .replace("Content", "Contact")
        .replace("NewsPublic", "News")
        .replace("StudentAccount", "Student")
        .replace("TeacherAccount", "Teacher");
    if (name.isEmpty()) {
      name = className;
    }
    return name;
  }

  private String clientIp(HttpServletRequest req) {
    String forwarded = req.getHeader("X-Forwarded-For");
    if (forwarded != null && !forwarded.isBlank()) {
      String first = forwarded.split(",")[0].trim();
      if (!first.isEmpty()) {
        return normalize(first);
      }
    }

    String real = req.getHeader("X-Real-IP");
    if (real != null && !real.isBlank()) {
      return normalize(real.trim());
    }

    return normalize(req.getRemoteAddr());
  }

  private String normalize(String ip) {
    if (ip == null) {
      return "unknown";
    }
    if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
      return "127.0.0.1";
    }
    // strip a port number if present, e.g. 127.0.0.1:52137
    if (ip.contains(":") && ip.indexOf(':') != ip.lastIndexOf(':')) {
      int idx = ip.lastIndexOf(':');
      String host = ip.substring(0, idx);
      String port = ip.substring(idx + 1);
      if (port.matches("\\d+")) {
        return host;
      }
    }
    return ip;
  }
}
