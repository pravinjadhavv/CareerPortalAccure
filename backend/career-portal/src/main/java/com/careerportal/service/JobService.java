package com.careerportal.service;

import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.Job;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.repo.ApplicationRepository;
import com.careerportal.repo.JobRepository;
import com.careerportal.web.SecurityUtils;
import com.careerportal.web.dto.JobDtos;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobService {
  private final JobRepository jobs;
  private final CompanyProfileRepository companies;
  private final ApplicationRepository applications;

  public List<JobDtos.JobResponse> listActiveJobs() {
    return jobs.findByActiveTrueOrderByPostedAtDesc().stream().map(this::map).toList();
  }

  public List<JobDtos.JobResponse> listMyCompanyJobs() {
    CompanyProfile company = ensureCompanyProfile();
    return jobs.findByCompanyIdOrderByPostedAtDesc(company.getId()).stream().map(this::map).toList();
  }

  @Transactional
  public JobDtos.JobResponse createJob(JobDtos.CreateJobRequest req) {
    CompanyProfile company = ensureCompanyProfile();

    Job job = new Job();
    job.setCompany(company);
    job.setTitle(req.title());
    job.setDescription(req.description());
    job.setLocation(req.location());
    job.setSalary(req.salary());
    jobs.save(job);
    return map(job);
  }

  @Transactional
  public void deleteJob(Long jobId) {
    CompanyProfile company = ensureCompanyProfile();
    Job job = jobs.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    if (!job.getCompany().getId().equals(company.getId())) {
      throw new IllegalArgumentException("Access denied");
    }
    jobs.delete(job);
  }

  private JobDtos.JobResponse map(Job j) {
    long applicationCount = applications.countByJobId(j.getId());
    return new JobDtos.JobResponse(
        j.getId(),
        j.getTitle(),
        j.getDescription(),
        j.getLocation(),
        j.getSalary(),
        j.getPostedAt(),
        j.getCompany().getId(),
        j.getCompany().getCompanyName(),
        applicationCount);
  }

  @Transactional
  protected CompanyProfile ensureCompanyProfile() {
    var user = SecurityUtils.principal().getUser();
    return companies
        .findByUserId(user.getId())
        .orElseGet(
            () -> {
              CompanyProfile p = new CompanyProfile();
              p.setUser(user);
              p.setCompanyName(user.getUsername());
              return companies.save(p);
            });
  }
}

