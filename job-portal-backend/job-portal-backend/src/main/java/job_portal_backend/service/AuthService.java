package job_portal_backend.service;

import job_portal_backend.ApplicationContextProvider;
import job_portal_backend.dto.*;
import job_portal_backend.entity.*;
import job_portal_backend.enums.UserRole;
import job_portal_backend.filter.JwtAuthenticationFilter;
import job_portal_backend.repository.*;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Builder
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registerJobSeeker(JobSeekerDTO dto) {
        validateEmailUnique(dto.getEmail());

        JobSeeker jobSeeker = JobSeeker.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .mobileNumber(dto.getMobileNumber())
                .role(UserRole.JOBSEEKER)
                .dateOfBirth(dto.getDateOfBirth())
                .degree(dto.getDegree())
                .linkedinId(dto.getLinkedinId())
                .desiredJobRole(dto.getDesiredJobRole())
                .skills(dto.getSkills().stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet()))
                .passedOutYear(dto.getPassedOutYear())
                .currentSalary(dto.getCurrentSalary())
                .expectedSalary(dto.getExpectedSalary())
                .build();

        jobSeekerRepository.save(jobSeeker);
        log.info("JobSeeker registered successfully: {}", jobSeeker.getEmail());

        return generateAuthResponse(jobSeeker);
    }

    public AuthResponse registerEmployer(EmployerDTO dto) {
        validateEmailUnique(dto.getEmail());

        Employer employer = Employer.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .mobileNumber(dto.getMobileNumber())
                .role(UserRole.EMPLOYER)
                .designation(dto.getDesignation())
                .companyName(dto.getCompanyName())
                .build();

        employerRepository.save(employer);
        log.info("Employer registered successfully: {}", employer.getEmail());

        return generateAuthResponse(employer);
    }

    public AuthResponse login(AuthRequest request) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );
            User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return generateAuthResponse(user);
        }catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Transactional(readOnly = true)
    public Optional<User> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !authentication.getPrincipal().equals("anonymousUser")) {
                String username = authentication.getName();
                return userRepository.findByEmail(username);
            }
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
        }
        return Optional.empty();
    }

    private void validateEmailUnique(String email) {
        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            throw new RuntimeException("Email already registered");
        }
    }

    private AuthResponse generateAuthResponse(User user) {
        JwtAuthenticationFilter jwtFilter = ApplicationContextProvider.getBean(JwtAuthenticationFilter.class);
        String token = jwtFilter.generateToken(user.getEmail());
        log.info("token {}",token);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
    }
}
