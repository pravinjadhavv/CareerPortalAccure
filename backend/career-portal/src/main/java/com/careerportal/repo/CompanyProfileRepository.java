package com.careerportal.repo;

import com.careerportal.domain.CompanyProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
  Optional<CompanyProfile> findByUserId(Long userId);
}

