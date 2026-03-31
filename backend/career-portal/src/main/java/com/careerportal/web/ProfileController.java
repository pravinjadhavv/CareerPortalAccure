package com.careerportal.web;

import com.careerportal.domain.enums.UserRole;
import com.careerportal.service.ProfileService;
import com.careerportal.web.dto.ProfileDtos;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {
  private final ProfileService profiles;

  @GetMapping("/candidate/profile")
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<ProfileDtos.CandidateProfileResponse> getCandidateProfile() {
    return ResponseEntity.ok(profiles.getMyCandidateProfile());
  }

  @PutMapping("/candidate/profile")
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<ProfileDtos.CandidateProfileResponse> updateCandidateProfile(
      @Valid @RequestBody ProfileDtos.UpdateCandidateProfileRequest req) {
    return ResponseEntity.ok(profiles.updateMyCandidateProfile(req));
  }

  @PostMapping(value = "/candidate/profile/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('CANDIDATE')")
  public ResponseEntity<ProfileDtos.CandidateProfileResponse> uploadCandidateAttachments(
      @RequestPart(value = "resume", required = false) MultipartFile resume,
      @RequestPart(value = "photo", required = false) MultipartFile photo) {
    return ResponseEntity.ok(profiles.uploadCandidateAttachments(resume, photo));
  }

  @GetMapping("/company/profile")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<ProfileDtos.CompanyProfileResponse> getCompanyProfile() {
    return ResponseEntity.ok(profiles.getMyCompanyProfile());
  }

  @PutMapping("/company/profile")
  @PreAuthorize("hasRole('COMPANY')")
  public ResponseEntity<ProfileDtos.CompanyProfileResponse> updateCompanyProfile(
      @Valid @RequestBody ProfileDtos.UpdateCompanyProfileRequest req) {
    return ResponseEntity.ok(profiles.updateMyCompanyProfile(req));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var u = SecurityUtils.principal().getUser();
    return ResponseEntity.ok(
        java.util.Map.of("userId", u.getId(), "username", u.getUsername(), "email", u.getEmail(), "role", u.getRole().name()));
  }
}

