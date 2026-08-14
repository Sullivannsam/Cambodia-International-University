package com.ciu.sys.repository.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.notification.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findByTargetRole(String targetRole);

}
