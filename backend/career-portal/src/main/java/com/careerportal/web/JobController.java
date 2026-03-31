package com.careerportal.web;

import com.careerportal.service.JobService;
import com.careerportal.web.dto.JobDtos;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobController {
  private final JobService jobs;

  @GetMapping("/jobs")
  public ResponseEntity<List<JobDtos.JobResponse>> listJobs() {
    return ResponseEntity.ok(jobs.listActiveJobs());
  }

  @GetMapping("/company/jobs")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<List<JobDtos.JobResponse>> listMyCompanyJobs() {
    return ResponseEntity.ok(jobs.listMyCompanyJobs());
  }

  @PostMapping("/company/jobs")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<JobDtos.JobResponse> createJob(@Valid @RequestBody JobDtos.CreateJobRequest req) {
    return ResponseEntity.ok(jobs.createJob(req));
  }

  @DeleteMapping("/company/jobs/{jobId}")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
    jobs.deleteJob(jobId);
    return ResponseEntity.ok(java.util.Map.of("message", "Job deleted"));
  }
}

