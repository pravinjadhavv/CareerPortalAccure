package com.careerportal.web.dto;

import com.careerportal.domain.enums.ApplicationStatus;
import java.time.Instant;

public class ApplicationDtos {
  public record ApplicationResponse(
      Long id,
      Long jobId,
      String jobTitle,
      Long candidateId,
      String candidateName,
      String candidateEmail,
      String resumePath,
      ApplicationStatus status,
      Instant appliedAt) {}

  public record UpdateStatusRequest(ApplicationStatus status) {}
}

