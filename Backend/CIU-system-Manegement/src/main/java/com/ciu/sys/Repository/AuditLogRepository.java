package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

  @Query("SELECT a FROM AuditLog a WHERE a.active = true ORDER BY a.id DESC")
  List<AuditLog> findAllActiveOrderByIdDesc();

}
