package com.ciu.sys.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.Model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findByTargetRole(String targetRole);

  List<Notification> findByTargetRoleIn(List<String> targetRoles);

}
