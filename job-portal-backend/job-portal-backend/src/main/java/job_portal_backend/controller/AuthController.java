package job_portal_backend.controller;

import jakarta.validation.Valid;
import job_portal_backend.dto.AuthRequest;
import job_portal_backend.dto.AuthResponse;
import job_portal_backend.dto.EmployerDTO;
import job_portal_backend.dto.JobSeekerDTO;
import job_portal_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register/jobseeker")
    public ResponseEntity<AuthResponse> registerJobSeeker(@Valid @RequestBody JobSeekerDTO dto) {
        log.info("JobSeekerDTO JSON Data{}",dto);
        try {
            AuthResponse response = authService.registerJobSeeker(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("JobSeeker registration failed: {}", e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/register/employer")
    public ResponseEntity<AuthResponse> registerEmployer(@Valid @RequestBody EmployerDTO dto) {
        try {
            AuthResponse response = authService.registerEmployer(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Employer registration failed: {}", e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("AuthRequest {}",request);
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail());
            throw new RuntimeException("Invalid credentials");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        log.info("ValidateToken Function Activated");
        return authService.getCurrentUser()
                .map(user -> ResponseEntity.ok("Token valid for: " + user.getEmail()))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token"));
    }

}
