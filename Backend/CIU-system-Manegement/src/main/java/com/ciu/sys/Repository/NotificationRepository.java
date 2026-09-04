package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @Query("SELECT n FROM Notification n WHERE n.targetRole = :targetRole ORDER BY n.id DESC")
  List<Notification> findByTargetRole(@Param("targetRole") String targetRole);

  @Query("SELECT n FROM Notification n WHERE n.targetRole IN :targetRoles ORDER BY n.id DESC")
  List<Notification> findByTargetRoleIn(@Param("targetRoles") List<String> targetRoles);

}
