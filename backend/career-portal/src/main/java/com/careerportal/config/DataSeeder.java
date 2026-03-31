package com.careerportal.config;

import com.careerportal.domain.User;
import com.careerportal.domain.enums.UserRole;
import com.careerportal.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
  private final UserRepository users;
  private final PasswordEncoder encoder;

  @Bean
  CommandLineRunner seedAdmin() {
    return args -> {
      if (users.findByUsernameIgnoreCase("admin").isPresent()) return;
      User u = new User();
      u.setUsername("admin");
      u.setEmail("admin@local");
      u.setPasswordHash(encoder.encode("Admin@123"));
      u.setRole(UserRole.ADMIN);
      users.save(u);
    };
  }
}

