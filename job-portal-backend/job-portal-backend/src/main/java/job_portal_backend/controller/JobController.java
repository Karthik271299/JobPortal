package job_portal_backend.controller;

import job_portal_backend.dto.*;
import job_portal_backend.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    private final JobService jobService;

    // This api is working as expected but have to change the search Jobs backend logic in the JobService
    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skills) {

        List<JobDTO> jobs = jobService.searchJobs(jobTitle, location, skills);
        return ResponseEntity.ok(jobs);
    }

    // This api also working as expected
    @GetMapping("/all")
    public ResponseEntity<List<JobDTO>> getAllActiveJobs() {
        List<JobDTO> jobs = jobService.getActiveJobs();
        return ResponseEntity.ok(jobs);
    }
}
