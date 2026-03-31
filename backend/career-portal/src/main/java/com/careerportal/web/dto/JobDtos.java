package com.careerportal.web.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;

public class JobDtos {
  public record JobResponse(
      Long id,
      String title,
      String description,
      String location,
      BigDecimal salary,
      Instant postedAt,
      Long companyId,
      String companyName,
      long applicationCount) {}

  public record CreateJobRequest(
      @NotBlank String title,
      @NotBlank String description,
      @NotBlank String location,
      BigDecimal salary) {}
}

