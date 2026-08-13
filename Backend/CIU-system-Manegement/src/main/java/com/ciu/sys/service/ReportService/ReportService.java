package com.ciu.sys.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.ciu.sys.model.Report.Report;
import com.ciu.sys.repository.ReportRepository.ReportRepository;

@Service
public class ReportService {

  @Autowired
  private ReportRepository repo;

  public List<Report> getAllReports() {
    return repo.findAllByOrderByIdDesc();
  }

  public Report submit(Report report) {
    return repo.save(report);
  }

  public Optional<Report> update(Long id, Report patch) {
    return repo.findById(id).map(existing -> {
      // Merge only the fields sent from the frontend
      if (patch.getSubjectName() != null)
        existing.setSubjectName(patch.getSubjectName());
      if (patch.getSubjectRole() != null)
        existing.setSubjectRole(patch.getSubjectRole());
      if (patch.getCategory() != null)
        existing.setCategory(patch.getCategory());
      if (patch.getDescription() != null)
        existing.setDescription(patch.getDescription());
      if (patch.getSubjectEmail() != null)
        existing.setSubjectEmail(patch.getSubjectEmail());
      existing.setRead(patch.isRead());
      return repo.save(existing);
    });
  }
}
