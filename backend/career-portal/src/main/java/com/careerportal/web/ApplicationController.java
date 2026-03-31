package com.careerportal.web;

import com.careerportal.service.ApplicationService;
import com.careerportal.web.dto.ApplicationDtos;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {
  private final ApplicationService apps;

  @PostMapping(value = "/jobs/{jobId}/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<?> apply(
      @PathVariable Long jobId, @RequestPart(value = "resume", required = false) MultipartFile resume) {
    return ResponseEntity.ok(java.util.Map.of("message", "Application submitted successfully", "data", apps.apply(jobId, resume)));
  }

  @PostMapping(value = "/jobs/{jobId}/apply", consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<?> applyJson(@PathVariable Long jobId) {
    return ResponseEntity.ok(
        java.util.Map.of(
            "message", "Application submitted successfully", "data", apps.apply(jobId, null)));
  }

  @GetMapping("/candidate/applications")
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<List<ApplicationDtos.ApplicationResponse>> myApplications() {
    return ResponseEntity.ok(apps.myApplications());
  }

  @GetMapping("/company/jobs/{jobId}/applicants")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<List<ApplicationDtos.ApplicationResponse>> applicants(@PathVariable Long jobId) {
    return ResponseEntity.ok(apps.applicantsForJob(jobId));
  }

  @PutMapping("/company/applications/{applicationId}/status")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<ApplicationDtos.ApplicationResponse> updateStatus(
      @PathVariable Long applicationId, @RequestBody ApplicationDtos.UpdateStatusRequest req) {
    return ResponseEntity.ok(apps.updateStatus(applicationId, req.status()));
  }

  @GetMapping("/company/applications/{applicationId}/resume")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<Resource> downloadResume(@PathVariable Long applicationId) {
    return apps.downloadResumeForCompany(applicationId);
  }
}

