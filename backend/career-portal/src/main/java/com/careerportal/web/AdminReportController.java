package com.careerportal.web;

import com.careerportal.domain.enums.Gender;
import com.careerportal.service.ReportService;
import com.careerportal.web.dto.ReportDtos;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {
  private final ReportService reports;

  @GetMapping("/candidates")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<ReportDtos.CandidateRow>> candidates(
      @RequestParam(required = false) Gender gender,
      @RequestParam(required = false) String education,
      @RequestParam(required = false) String skill,
      @RequestParam(required = false) String workExp,
      @RequestParam(required = false) LocalDate createdAfter) {
    return ResponseEntity.ok(reports.candidateReport(gender, education, skill, workExp, createdAfter));
  }

  @GetMapping("/companies")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<ReportDtos.CompanyRow>> companies(
      @RequestParam(required = false) String companyName,
      @RequestParam(required = false) String industry,
      @RequestParam(required = false) LocalDate createdAfter) {
    return ResponseEntity.ok(reports.companyReport(companyName, industry, createdAfter));
  }
}

