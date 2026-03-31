package com.careerportal.service;

import com.careerportal.domain.CandidateProfile;
import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.User;
import com.careerportal.domain.enums.UserRole;
import com.careerportal.repo.CandidateProfileRepository;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.web.SecurityUtils;
import com.careerportal.web.dto.ProfileDtos;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProfileService {
  private final CandidateProfileRepository candidates;
  private final CompanyProfileRepository companies;
  private final FileStorageService files;

  public ProfileDtos.CandidateProfileResponse getMyCandidateProfile() {
    User u = SecurityUtils.principal().getUser();
    CandidateProfile p = ensureCandidateProfile(u);
    return mapCandidate(u, p);
  }

  @Transactional
  public ProfileDtos.CandidateProfileResponse updateMyCandidateProfile(
      ProfileDtos.UpdateCandidateProfileRequest req) {
    User u = SecurityUtils.principal().getUser();
    CandidateProfile p = ensureCandidateProfile(u);
    p.setName(req.name());
    p.setMobile(req.mobile());
    p.setStatus(req.status());
    p.setGender(req.gender());
    p.setDob(req.dob());
    p.setEducation(req.education());
    p.setWorkExp(req.workExp());
    p.setSkills(req.skills());
    candidates.save(p);
    return mapCandidate(u, p);
  }

  @Transactional
  public ProfileDtos.CandidateProfileResponse uploadCandidateAttachments(
      MultipartFile resume, MultipartFile photo) {
    User u = SecurityUtils.principal().getUser();
    CandidateProfile p = ensureCandidateProfile(u);
    if (resume != null && !resume.isEmpty()) p.setResumePath(files.save(resume, "resume"));
    if (photo != null && !photo.isEmpty()) p.setPhotoPath(files.save(photo, "photo"));
    candidates.save(p);
    return mapCandidate(u, p);
  }

  public ProfileDtos.CompanyProfileResponse getMyCompanyProfile() {
    User u = SecurityUtils.principal().getUser();
    CompanyProfile p = ensureCompanyProfile(u);
    return mapCompany(u, p);
  }

  @Transactional
  public ProfileDtos.CompanyProfileResponse updateMyCompanyProfile(
      ProfileDtos.UpdateCompanyProfileRequest req) {
    User u = SecurityUtils.principal().getUser();
    CompanyProfile p = ensureCompanyProfile(u);
    p.setCompanyName(req.companyName());
    p.setIndustry(req.industry());
    p.setCompanySize(req.companySize());
    p.setHeadquarters(req.headquarters());
    p.setCompanyType(req.companyType());
    p.setFounded(req.founded());
    p.setSpecialties(req.specialties());
    p.setAddress(req.address());
    p.setCompanyPhone(req.companyPhone());
    companies.save(p);
    return mapCompany(u, p);
  }

  public void assertRole(UserRole role) {
    User u = SecurityUtils.principal().getUser();
    if (u.getRole() != role) throw new IllegalArgumentException("Access denied");
  }

  private static ProfileDtos.CandidateProfileResponse mapCandidate(User u, CandidateProfile p) {
    return new ProfileDtos.CandidateProfileResponse(
        p.getId(),
        u.getUsername(),
        u.getEmail(),
        p.getName(),
        p.getMobile(),
        p.getGender(),
        p.getDob(),
        p.getStatus(),
        p.getEducation(),
        p.getWorkExp(),
        p.getSkills(),
        p.getResumePath(),
        p.getPhotoPath());
  }

  private static ProfileDtos.CompanyProfileResponse mapCompany(User u, CompanyProfile p) {
    return new ProfileDtos.CompanyProfileResponse(
        p.getId(),
        u.getUsername(),
        u.getEmail(),
        p.getCompanyName(),
        p.getIndustry(),
        p.getCompanySize(),
        p.getHeadquarters(),
        p.getCompanyType(),
        p.getFounded(),
        p.getSpecialties(),
        p.getAddress(),
        p.getCompanyPhone());
  }

  @Transactional
  protected CompanyProfile ensureCompanyProfile(User user) {
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

  @Transactional
  protected CandidateProfile ensureCandidateProfile(User user) {
    return candidates
        .findByUserId(user.getId())
        .orElseGet(
            () -> {
              CandidateProfile p = new CandidateProfile();
              p.setUser(user);
              p.setName(user.getUsername());
              return candidates.save(p);
            });
  }
}

