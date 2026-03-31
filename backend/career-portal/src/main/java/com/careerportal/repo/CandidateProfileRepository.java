package com.careerportal.repo;

import com.careerportal.domain.CandidateProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
  Optional<CandidateProfile> findByUserId(Long userId);
}

