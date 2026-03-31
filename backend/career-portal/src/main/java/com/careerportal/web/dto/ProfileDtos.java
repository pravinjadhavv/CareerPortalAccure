package com.careerportal.web.dto;

import com.careerportal.domain.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class ProfileDtos {
  public record CandidateProfileResponse(
      Long id,
      String username,
      String email,
      String name,
      String mobile,
      Gender gender,
      LocalDate dob,
      String status,
      String education,
      String workExp,
      String skills,
      String resumePath,
      String photoPath) {}

  public record UpdateCandidateProfileRequest(
      @NotBlank String name,
      @NotBlank String mobile,
      String status,
      Gender gender,
      LocalDate dob,
      String education,
      String workExp,
      String skills) {}

  public record CompanyProfileResponse(
      Long id,
      String username,
      String email,
      String companyName,
      String industry,
      String companySize,
      String headquarters,
      String companyType,
      String founded,
      String specialties,
      String address,
      String companyPhone) {}

  public record UpdateCompanyProfileRequest(
      @NotBlank String companyName,
      String industry,
      String companySize,
      String headquarters,
      String companyType,
      String founded,
      String specialties,
      String address,
      String companyPhone) {}
}

