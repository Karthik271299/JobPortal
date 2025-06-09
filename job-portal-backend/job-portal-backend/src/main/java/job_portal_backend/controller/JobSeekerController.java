package job_portal_backend.controller;

import jakarta.validation.Valid;
import job_portal_backend.dto.ApplicationDTO;
import job_portal_backend.dto.JobDTO;
import job_portal_backend.dto.JobSeekerDTO;
import job_portal_backend.service.JobSeekerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/jobseeker")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobSeekerController {
    private final JobSeekerService jobSeekerService;

    // this api working as expected
    @GetMapping("/profile")
    public ResponseEntity<JobSeekerDTO> getProfile() {
        JobSeekerDTO profile = jobSeekerService.getProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<JobSeekerDTO> updateProfile(@Valid @RequestBody JobSeekerDTO dto) {
        JobSeekerDTO updatedProfile = jobSeekerService.updateProfile(dto);
        return ResponseEntity.ok(updatedProfile);
    }

    // This api is working as expected
    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<ApplicationDTO> applyForJob(@PathVariable Long jobId) {
        ApplicationDTO application = jobSeekerService.applyForJob(jobId);
        return ResponseEntity.ok(application);
    }

    // This api is working as expected
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications() {
        List<ApplicationDTO> applications = jobSeekerService.getMyApplications();
        return ResponseEntity.ok(applications);
    }

}
