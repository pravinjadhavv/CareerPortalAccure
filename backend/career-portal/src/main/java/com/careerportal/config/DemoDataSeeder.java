package com.careerportal.config;

import com.careerportal.domain.CandidateProfile;
import com.careerportal.domain.CompanyProfile;
import com.careerportal.domain.Job;
import com.careerportal.domain.User;
import com.careerportal.domain.enums.Gender;
import com.careerportal.domain.enums.UserRole;
import com.careerportal.repo.CandidateProfileRepository;
import com.careerportal.repo.CompanyProfileRepository;
import com.careerportal.repo.JobRepository;
import com.careerportal.repo.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DemoDataSeeder {
  private final UserRepository users;
  private final CandidateProfileRepository candidates;
  private final CompanyProfileRepository companies;
  private final JobRepository jobs;
  private final PasswordEncoder encoder;

  @Bean
  CommandLineRunner seedDemoData(@Value("${app.demo.seed:false}") boolean enabled) {
    return args -> {
      if (!enabled) return;

      // prevent double-seeding
      if (users.findByUsernameIgnoreCase("demo_company1").isPresent()) return;

      // Companies (3)
      CompanyProfile c1 = createCompany("demo_company1", "company1@demo.local", "DemoSoft Pvt Ltd");
      CompanyProfile c2 = createCompany("demo_company2", "company2@demo.local", "Innova IT Ltd");
      CompanyProfile c3 = createCompany("demo_company3", "company3@demo.local", "NextGen Labs");

      // Jobs (5)
      createJob(c1, "Trainee", "Entry level role", "Pune", new BigDecimal("25000"));
      createJob(c1, "Analyst", "Data analysis role", "Pune", new BigDecimal("45000"));
      createJob(c2, "Python Developer", "Backend + APIs", "Pune", new BigDecimal("70000"));
      createJob(c2, "Manager", "Team management", "Gurgaon", new BigDecimal("110000"));
      createJob(c3, "Software Developer", "Full-stack role", "Mumbai", new BigDecimal("80000"));

      // Candidates (2)
      createCandidate("demo_candidate1", "cand1@demo.local", "Aarav", "9999990001");
      createCandidate("demo_candidate2", "cand2@demo.local", "Nilu", "9999990002");
    };
  }

  private CompanyProfile createCompany(String username, String email, String companyName) {
    User u = new User();
    u.setUsername(username);
    u.setEmail(email);
    u.setPasswordHash(encoder.encode("Demo@123"));
    u.setRole(UserRole.COMPANY);
    users.save(u);

    CompanyProfile p = new CompanyProfile();
    p.setUser(u);
    p.setCompanyName(companyName);
    p.setIndustry("IT industry");
    p.setCompanySize("10+ Employees");
    p.setHeadquarters("Pune");
    p.setCompanyType("IT");
    p.setFounded("2001");
    p.setSpecialties("Good in website design");
    p.setAddress("Delhi");
    p.setCompanyPhone("8800145588");
    return companies.save(p);
  }

  private CandidateProfile createCandidate(String username, String email, String name, String mobile) {
    User u = new User();
    u.setUsername(username);
    u.setEmail(email);
    u.setPasswordHash(encoder.encode("Demo@123"));
    u.setRole(UserRole.CANDIDATE);
    users.save(u);

    CandidateProfile p = new CandidateProfile();
    p.setUser(u);
    p.setName(name);
    p.setMobile(mobile);
    p.setGender(Gender.MALE);
    p.setStatus("fresher");
    p.setEducation("BE");
    p.setWorkExp("1 Year");
    p.setSkills("Java, Python");
    return candidates.save(p);
  }

  private Job createJob(
      CompanyProfile company, String title, String description, String location, BigDecimal salary) {
    Job j = new Job();
    j.setCompany(company);
    j.setTitle(title);
    j.setDescription(description);
    j.setLocation(location);
    j.setSalary(salary);
    return jobs.save(j);
  }
}

