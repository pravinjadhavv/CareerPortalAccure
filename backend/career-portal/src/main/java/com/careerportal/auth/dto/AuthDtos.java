package com.careerportal.auth.dto;

import com.careerportal.domain.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class AuthDtos {
  public record LoginRequest(@NotBlank String identifier, @NotBlank String password) {}

  public record AuthResponse(String token, String role, Long userId) {}

  public record RegisterCandidateRequest(
      @NotBlank @Size(min = 3, max = 50) String username,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 6, max = 100) String password,
      @NotBlank String passwordConfirm,
      @NotBlank String name,
      @NotBlank String mobile,
      @NotBlank String status,
      Gender gender,
      LocalDate dob,
      String education,
      String workExp,
      String skills) {}

  public record RegisterCompanyRequest(
      @NotBlank @Size(min = 3, max = 50) String username,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 6, max = 100) String password,
      @NotBlank String passwordConfirm,
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

