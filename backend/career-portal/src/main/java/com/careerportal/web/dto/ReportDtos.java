package com.careerportal.web.dto;

import com.careerportal.domain.enums.Gender;
import java.time.Instant;

public class ReportDtos {
  public record CandidateRow(
      Long id,
      String name,
      String email,
      String mobile,
      Gender gender,
      String education,
      String workExp,
      String skills,
      Instant createdAt) {}

  public record CompanyRow(
      Long id,
      String companyName,
      String email,
      String phone,
      String industry,
      String headquarters,
      String companyType,
      String founded,
      String specialties,
      Instant createdAt) {}
}

