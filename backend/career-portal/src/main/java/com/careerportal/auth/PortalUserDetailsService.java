package com.careerportal.auth;

import com.careerportal.domain.User;
import com.careerportal.repo.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortalUserDetailsService implements UserDetailsService {
  private final UserRepository users;

  @Override
  public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    Optional<User> byUsername = users.findByUsernameIgnoreCase(usernameOrEmail);
    User user =
        byUsername.orElseGet(
            () ->
                users
                    .findByEmailIgnoreCase(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found")));

    return new UserPrincipal(user);
  }
}

