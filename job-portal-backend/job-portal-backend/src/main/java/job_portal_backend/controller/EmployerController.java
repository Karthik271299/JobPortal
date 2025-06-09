package job_portal_backend.controller;

import jakarta.validation.Valid;
import job_portal_backend.dto.ApplicationDTO;
import job_portal_backend.dto.EmployerDTO;
import job_portal_backend.dto.JobDTO;
import job_portal_backend.dto.JobSeekerDTO;
import job_portal_backend.enums.ApplicationStatus;
import job_portal_backend.service.EmployerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmployerController {

    private final EmployerService employerService;

    //This api working as expected
    @GetMapping("/profile")
    public ResponseEntity<EmployerDTO> getProfile() {
        EmployerDTO profile = employerService.getProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<EmployerDTO> updateProfile(@Valid @RequestBody EmployerDTO dto) {
        EmployerDTO updatedProfile = employerService.updateProfile(dto);
        return ResponseEntity.ok(updatedProfile);
    }

    // working as Expected
    @PostMapping("/jobs")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO dto) {
        JobDTO createdJob = employerService.createJob(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    // This api working as expected
    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getMyPostedJobs() {
        List<JobDTO> jobs = employerService.getMyPostedJobs();
        return ResponseEntity.ok(jobs);
    }

    // This api is working as expected
    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long jobId, @Valid @RequestBody JobDTO dto) {
        JobDTO updatedJob = employerService.updateJob(jobId, dto);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        employerService.deleteJob(jobId);
        return ResponseEntity.noContent().build();
    }

    // this api working as expected
    @GetMapping("/candidates/search")
    @Transactional(readOnly = true)
    public ResponseEntity<List<JobSeekerDTO>> searchCandidates(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String jobRole) {
        List<JobSeekerDTO> candidates = employerService.searchCandidates(skills, jobRole);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationDTO>> getJobApplications(@PathVariable Long jobId) {
        List<ApplicationDTO> applications = employerService.getJobApplications(jobId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getAllMyJobApplications() {
        List<ApplicationDTO> applications = employerService.getAllMyJobApplications();
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {

        ApplicationDTO updatedApplication = employerService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(updatedApplication);
    }
}
