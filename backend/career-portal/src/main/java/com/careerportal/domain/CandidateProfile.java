package com.careerportal.domain;

import com.careerportal.domain.enums.Gender;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(length = 120)
  private String name;

  @Column(length = 30)
  private String mobile;

  @Enumerated(EnumType.STRING)
  @Column(length = 10)
  private Gender gender;

  private LocalDate dob;

  @Column(length = 50)
  private String status; // e.g. fresher

  @Lob private String education;

  @Column(name = "work_exp", length = 50)
  private String workExp;

  @Lob private String skills;

  @Column(name = "resume_path", length = 255)
  private String resumePath;

  @Column(name = "photo_path", length = 255)
  private String photoPath;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt = Instant.now();

  @PrePersist
  @PreUpdate
  void touch() {
    updatedAt = Instant.now();
  }
}

