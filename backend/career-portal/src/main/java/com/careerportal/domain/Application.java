package com.careerportal.domain;

import com.careerportal.domain.enums.ApplicationStatus;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
    name = "applications",
    uniqueConstraints = {@UniqueConstraint(name = "uq_job_candidate", columnNames = {"job_id", "candidate_id"})})
public class Application {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "job_id", nullable = false)
  private Job job;

  @ManyToOne(optional = false)
  @JoinColumn(name = "candidate_id", nullable = false)
  private CandidateProfile candidate;

  @Column(name = "resume_path", length = 255)
  private String resumePath;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ApplicationStatus status = ApplicationStatus.SUBMITTED;

  @Column(name = "applied_at", nullable = false, updatable = false)
  private Instant appliedAt = Instant.now();
}

