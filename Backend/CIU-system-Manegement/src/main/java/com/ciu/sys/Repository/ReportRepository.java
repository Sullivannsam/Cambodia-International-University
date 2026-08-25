package com.ciu.sys.repository.ReportRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ciu.sys.model.Report.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

  List<Report> findAllByOrderByIdDesc();

}
