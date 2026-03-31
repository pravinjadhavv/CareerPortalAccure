package com.careerportal.auth;

import com.careerportal.auth.dto.AuthDtos;
import com.careerportal.domain.CandidateProfile;
import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.User;
import com.careerportal.domain.enums.UserRole;
import com.careerportal.repo.CandidateProfileRepository;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.repo.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository users;
  private final CandidateProfileRepository candidates;
  private final CompanyProfileRepository companies;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwt;

  @Transactional
  public AuthDtos.AuthResponse registerCandidate(AuthDtos.RegisterCandidateRequest req) {
    if (!req.password().equals(req.passwordConfirm())) {
      throw new IllegalArgumentException("Password and confirm password do not match");
    }
    if (users.findByUsernameIgnoreCase(req.username()).isPresent()) {
      throw new IllegalArgumentException("Username already exists");
    }
    if (users.findByEmailIgnoreCase(req.email()).isPresent()) {
      throw new IllegalArgumentException("Email already exists");
    }

    User user = new User();
    user.setUsername(req.username());
    user.setEmail(req.email());
    user.setPasswordHash(passwordEncoder.encode(req.password()));
    user.setRole(UserRole.CANDIDATE);
    users.save(user);

    CandidateProfile profile = new CandidateProfile();
    profile.setUser(user);
    profile.setName(req.name());
    profile.setMobile(req.mobile());
    profile.setStatus(req.status());
    profile.setGender(req.gender());
    profile.setDob(req.dob());
    profile.setEducation(req.education());
    profile.setWorkExp(req.workExp());
    profile.setSkills(req.skills());
    candidates.save(profile);

    return new AuthDtos.AuthResponse(jwt.generate(user), user.getRole().name(), user.getId());
  }

  @Transactional
  public AuthDtos.AuthResponse registerCompany(AuthDtos.RegisterCompanyRequest req) {
    if (!req.password().equals(req.passwordConfirm())) {
      throw new IllegalArgumentException("Password and confirm password do not match");
    }
    if (users.findByUsernameIgnoreCase(req.username()).isPresent()) {
      throw new IllegalArgumentException("Username already exists");
    }
    if (users.findByEmailIgnoreCase(req.email()).isPresent()) {
      throw new IllegalArgumentException("Email already exists");
    }

    User user = new User();
    user.setUsername(req.username());
    user.setEmail(req.email());
    user.setPasswordHash(passwordEncoder.encode(req.password()));
    user.setRole(UserRole.COMPANY);
    users.save(user);

    CompanyProfile profile = new CompanyProfile();
    profile.setUser(user);
    profile.setCompanyName(req.companyName());
    profile.setIndustry(req.industry());
    profile.setCompanySize(req.companySize());
    profile.setHeadquarters(req.headquarters());
    profile.setCompanyType(req.companyType());
    profile.setFounded(req.founded());
    profile.setSpecialties(req.specialties());
    profile.setAddress(req.address());
    profile.setCompanyPhone(req.companyPhone());
    companies.save(profile);

    return new AuthDtos.AuthResponse(jwt.generate(user), user.getRole().name(), user.getId());
  }

  public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.identifier(), req.password()));
    UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
    User user = principal.getUser();
    return new AuthDtos.AuthResponse(jwt.generate(user), user.getRole().name(), user.getId());
  }
}

