package com.careerportal.repo;

import com.careerportal.domain.Application;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
  Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

  List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);

  List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);

  long countByJobId(Long jobId);
}

