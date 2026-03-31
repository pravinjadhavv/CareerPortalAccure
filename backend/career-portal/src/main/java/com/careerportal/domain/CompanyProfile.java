package com.careerportal.domain;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "company_profiles")
public class CompanyProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(name = "company_name", length = 200)
  private String companyName;

  @Column(length = 120)
  private String industry;

  @Column(name = "company_size", length = 120)
  private String companySize;

  @Column(length = 120)
  private String headquarters;

  @Column(name = "company_type", length = 120)
  private String companyType;

  @Column(length = 20)
  private String founded;

  @Lob private String specialties;

  @Lob private String address;

  @Column(name = "company_phone", length = 30)
  private String companyPhone;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt = Instant.now();

  @PrePersist
  @PreUpdate
  void touch() {
    updatedAt = Instant.now();
  }
}

