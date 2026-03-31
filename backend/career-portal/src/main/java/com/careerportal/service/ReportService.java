package com.careerportal.service;

import com.careerportal.domain.CandidateProfile;
import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.User;
import com.careerportal.domain.enums.Gender;
import com.careerportal.repo.CandidateProfileRepository;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.repo.UserRepository;
import com.careerportal.web.dto.ReportDtos;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {
  private final CandidateProfileRepository candidates;
  private final CompanyProfileRepository companies;
  private final UserRepository users;

  public List<ReportDtos.CandidateRow> candidateReport(
      Gender gender, String education, String skill, String workExp, LocalDate createdAfter) {
    Instant createdAfterInstant =
        createdAfter == null ? null : createdAfter.atStartOfDay().toInstant(ZoneOffset.UTC);

    return candidates.findAll().stream()
        .filter(
            c -> {
              User u = c.getUser();
              if (gender != null && c.getGender() != gender) return false;
              if (education != null
                  && (c.getEducation() == null
                      || !c.getEducation().toLowerCase().contains(education.toLowerCase())))
                return false;
              if (skill != null
                  && (c.getSkills() == null
                      || !c.getSkills().toLowerCase().contains(skill.toLowerCase())))
                return false;
              if (workExp != null
                  && (c.getWorkExp() == null
                      || !c.getWorkExp().toLowerCase().contains(workExp.toLowerCase())))
                return false;
              if (createdAfterInstant != null && u.getCreatedAt().isBefore(createdAfterInstant))
                return false;
              return true;
            })
        .map(
            c -> {
              User u = c.getUser();
              return new ReportDtos.CandidateRow(
                  c.getId(),
                  c.getName(),
                  u.getEmail(),
                  c.getMobile(),
                  c.getGender(),
                  c.getEducation(),
                  c.getWorkExp(),
                  c.getSkills(),
                  u.getCreatedAt());
            })
        .toList();
  }

  public List<ReportDtos.CompanyRow> companyReport(
      String companyName, String industry, LocalDate createdAfter) {
    Instant createdAfterInstant =
        createdAfter == null ? null : createdAfter.atStartOfDay().toInstant(ZoneOffset.UTC);

    return companies.findAll().stream()
        .filter(
            c -> {
              User u = c.getUser();
              if (companyName != null
                  && (c.getCompanyName() == null
                      || !c.getCompanyName().toLowerCase().contains(companyName.toLowerCase())))
                return false;
              if (industry != null
                  && (c.getIndustry() == null
                      || !c.getIndustry().toLowerCase().contains(industry.toLowerCase())))
                return false;
              if (createdAfterInstant != null && u.getCreatedAt().isBefore(createdAfterInstant))
                return false;
              return true;
            })
        .map(
            c -> {
              User u = c.getUser();
              return new ReportDtos.CompanyRow(
                  c.getId(),
                  c.getCompanyName(),
                  u.getEmail(),
                  c.getCompanyPhone(),
                  c.getIndustry(),
                  c.getHeadquarters(),
                  c.getCompanyType(),
                  c.getFounded(),
                  c.getSpecialties(),
                  u.getCreatedAt());
            })
        .toList();
  }
}

