package com.careerportal.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "jobs")
public class Job {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "company_id", nullable = false)
  private CompanyProfile company;

  @Column(nullable = false, length = 200)
  private String title;

  @Lob
  @Column(nullable = false)
  private String description;

  @Column(nullable = false, length = 120)
  private String location;

  private BigDecimal salary;

  @Column(name = "posted_at", nullable = false, updatable = false)
  private Instant postedAt = Instant.now();

  @Column(name = "is_active", nullable = false)
  private boolean active = true;
}

