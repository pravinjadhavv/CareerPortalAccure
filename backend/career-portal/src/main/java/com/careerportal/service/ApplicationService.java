package com.careerportal.service;

import com.careerportal.domain.Application;
import com.careerportal.domain.CandidateProfile;
import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.Job;
import com.careerportal.domain.enums.ApplicationStatus;
import com.careerportal.repo.ApplicationRepository;
import com.careerportal.repo.CandidateProfileRepository;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.repo.JobRepository;
import com.careerportal.web.SecurityUtils;
import com.careerportal.web.dto.ApplicationDtos;
import jakarta.transaction.Transactional;
import java.nio.file.Paths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ApplicationService {
  private final ApplicationRepository apps;
  private final JobRepository jobs;
  private final CandidateProfileRepository candidates;
  private final CompanyProfileRepository companies;
  private final FileStorageService files;

  @Transactional
  public ApplicationDtos.ApplicationResponse apply(Long jobId, MultipartFile resumeOverride) {
    Job job = jobs.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    CandidateProfile candidate =
        candidates
            .findByUserId(SecurityUtils.principal().getUser().getId())
            .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));

    if (apps.findByJobIdAndCandidateId(jobId, candidate.getId()).isPresent()) {
      throw new IllegalArgumentException("You already applied for this job");
    }

    Application app = new Application();
    app.setJob(job);
    app.setCandidate(candidate);
    if (resumeOverride != null && !resumeOverride.isEmpty()) {
      app.setResumePath(files.save(resumeOverride, "apply_resume"));
    } else {
      app.setResumePath(candidate.getResumePath());
    }
    app.setStatus(ApplicationStatus.SUBMITTED);
    apps.save(app);
    return map(app);
  }

  public List<ApplicationDtos.ApplicationResponse> myApplications() {
    CandidateProfile candidate =
        candidates
            .findByUserId(SecurityUtils.principal().getUser().getId())
            .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));
    return apps.findByCandidateIdOrderByAppliedAtDesc(candidate.getId()).stream().map(ApplicationService::map).toList();
  }

  public List<ApplicationDtos.ApplicationResponse> applicantsForJob(Long jobId) {
    CompanyProfile company =
        companies
            .findByUserId(SecurityUtils.principal().getUser().getId())
            .orElseThrow(() -> new IllegalArgumentException("Company profile not found"));
    Job job = jobs.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    if (!job.getCompany().getId().equals(company.getId())) throw new IllegalArgumentException("Access denied");
    return apps.findByJobIdOrderByAppliedAtDesc(jobId).stream().map(ApplicationService::map).toList();
  }

  @Transactional
  public ApplicationDtos.ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status) {
    CompanyProfile company =
        companies
            .findByUserId(SecurityUtils.principal().getUser().getId())
            .orElseThrow(() -> new IllegalArgumentException("Company profile not found"));
    Application app = apps.findById(applicationId).orElseThrow(() -> new IllegalArgumentException("Application not found"));
    if (!app.getJob().getCompany().getId().equals(company.getId())) throw new IllegalArgumentException("Access denied");
    app.setStatus(status);
    apps.save(app);
    return map(app);
  }

  public ResponseEntity<Resource> downloadResumeForCompany(Long applicationId) {
    CompanyProfile company =
        companies
            .findByUserId(SecurityUtils.principal().getUser().getId())
            .orElseThrow(() -> new IllegalArgumentException("Company profile not found"));
    Application app =
        apps.findById(applicationId).orElseThrow(() -> new IllegalArgumentException("Application not found"));
    if (!app.getJob().getCompany().getId().equals(company.getId())) {
      throw new IllegalArgumentException("Access denied");
    }
    String path = app.getResumePath();
    Resource resource = files.load(path);
    String filename = Paths.get(path).getFileName().toString();
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(resource);
  }

  private static ApplicationDtos.ApplicationResponse map(Application a) {
    return new ApplicationDtos.ApplicationResponse(
        a.getId(),
        a.getJob().getId(),
        a.getJob().getTitle(),
        a.getCandidate().getId(),
        a.getCandidate().getName(),
        a.getCandidate().getUser().getEmail(),
        a.getResumePath(),
        a.getStatus(),
        a.getAppliedAt());
  }
}

