package com.careerportal.web;

import com.careerportal.auth.AuthService;
import com.careerportal.auth.dto.AuthDtos;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService auth;

  @PostMapping("/login")
  public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest req) {
    return ResponseEntity.ok(auth.login(req));
  }

  @PostMapping("/register/candidate")
  public ResponseEntity<AuthDtos.AuthResponse> registerCandidate(
      @Valid @RequestBody AuthDtos.RegisterCandidateRequest req) {
    return ResponseEntity.ok(auth.registerCandidate(req));
  }

  @PostMapping("/register/company")
  public ResponseEntity<AuthDtos.AuthResponse> registerCompany(
      @Valid @RequestBody AuthDtos.RegisterCompanyRequest req) {
    return ResponseEntity.ok(auth.registerCompany(req));
  }
}

