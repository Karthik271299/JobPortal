package job_portal_backend.service;

import job_portal_backend.dto.*;
import job_portal_backend.entity.*;
import job_portal_backend.enums.*;
import job_portal_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<JobDTO> searchJobs(String jobTitle, String location, String skills) {
        if ((jobTitle == null || jobTitle.trim().isEmpty()) &&
                (location == null || location.trim().isEmpty()) &&
                (skills == null || skills.trim().isEmpty())) {
            return getAllActiveJobs();
        }

        return jobRepository.findByStatus(JobStatus.ACTIVE)
                .stream()
                .filter(job -> matchesAnySearchCriteria(job, jobTitle, location, skills))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private boolean matchesAnySearchCriteria(Job job, String jobTitle, String location, String skills) {
        boolean titleMatch = jobTitle == null || jobTitle.trim().isEmpty() ||
                (job.getJobTitle() != null && job.getJobTitle().toLowerCase().contains(jobTitle.toLowerCase()));

        boolean locationMatch = location == null || location.trim().isEmpty() ||
                (job.getLocation() != null && job.getLocation().toLowerCase().contains(location.toLowerCase()));

        boolean skillsMatch = skills == null || skills.trim().isEmpty() ||
                (job.getRequiredSkills() != null && job.getRequiredSkills().stream()
                        .anyMatch(skill -> skill.toLowerCase().contains(skills.toLowerCase())));

        return titleMatch || locationMatch || skillsMatch;
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getAllActiveJobs() {
        return jobRepository.findByStatus(JobStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<JobDTO> getActiveJobs() {
        return jobRepository.findByStatusAndJobTitleContainingIgnoreCase(JobStatus.ACTIVE, "")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private JobDTO mapToDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .jobTitle(job.getJobTitle())
                .jobDescription(job.getJobDescription())
                .requiredSkills(job.getRequiredSkills())
                .minExperience(job.getMinExperience())
                .maxExperience(job.getMaxExperience())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .location(job.getLocation())
                .status(job.getStatus())
                .employerId(job.getEmployer().getId())
                .employerName(job.getEmployer().getFirstName() + " " + job.getEmployer().getLastName())
                .companyName(job.getEmployer().getCompanyName())
                .postedAt(job.getPostedAt())
                .build();
    }

}
