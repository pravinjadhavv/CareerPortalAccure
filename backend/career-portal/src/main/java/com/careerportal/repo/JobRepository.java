package com.careerportal.repo;

import com.careerportal.domain.Job;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
  List<Job> findByActiveTrueOrderByPostedAtDesc();

  List<Job> findByCompanyIdOrderByPostedAtDesc(Long companyId);
}

