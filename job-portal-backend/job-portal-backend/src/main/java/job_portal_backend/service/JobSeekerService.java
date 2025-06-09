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
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public JobSeekerDTO getProfile() {
        JobSeeker jobSeeker = getCurrentJobSeeker();
        return mapToDTO(jobSeeker);
    }

    public JobSeekerDTO updateProfile(JobSeekerDTO dto) {
        JobSeeker jobSeeker = getCurrentJobSeeker();

        jobSeeker.setFirstName(dto.getFirstName());
        jobSeeker.setLastName(dto.getLastName());
        jobSeeker.setMobileNumber(dto.getMobileNumber());
        jobSeeker.setDateOfBirth(dto.getDateOfBirth());
        jobSeeker.setDegree(dto.getDegree());
        jobSeeker.setLinkedinId(dto.getLinkedinId());
        jobSeeker.setDesiredJobRole(dto.getDesiredJobRole());
        jobSeeker.setSkills(dto.getSkills().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet()));
        jobSeeker.setPassedOutYear(dto.getPassedOutYear());
        jobSeeker.setCurrentSalary(dto.getCurrentSalary());
        jobSeeker.setExpectedSalary(dto.getExpectedSalary());

        jobSeekerRepository.save(jobSeeker);
        log.info("JobSeeker profile updated: {}", jobSeeker.getEmail());

        return mapToDTO(jobSeeker);
    }

    public ApplicationDTO applyForJob(Long jobId) {
        JobSeeker jobSeeker = getCurrentJobSeeker();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobSeekerIdAndJobId(jobSeeker.getId(), jobId)) {
            throw new RuntimeException("Already applied for this job");
        }

        Application application = Application.builder()
                .jobSeeker(jobSeeker)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .build();

        applicationRepository.save(application);
        log.info("Job application submitted: JobSeeker={}, Job={}", jobSeeker.getId(), jobId);

        return mapApplicationToDTO(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getMyApplications() {
        JobSeeker jobSeeker = getCurrentJobSeeker();
        return applicationRepository.findByJobSeekerIdOrderByAppliedAtDesc(jobSeeker.getId())
                .stream()
                .map(this::mapApplicationToDTO)
                .collect(Collectors.toList());
    }

        private JobSeeker getCurrentJobSeeker() {
            return authService.getCurrentUser()
                    .filter(user -> user.getRole() == UserRole.JOBSEEKER)
                    .map(user -> jobSeekerRepository.findByEmail(user.getEmail())
                            .orElseThrow(() -> new RuntimeException("JobSeeker not found")))
                    .orElseThrow(() -> new RuntimeException("Access denied"));
        }

    private JobSeekerDTO mapToDTO(JobSeeker jobSeeker) {
        return JobSeekerDTO.builder()
                .id(jobSeeker.getId())
                .firstName(jobSeeker.getFirstName())
                .lastName(jobSeeker.getLastName())
                .email(jobSeeker.getEmail())
                .mobileNumber(jobSeeker.getMobileNumber())
                .dateOfBirth(jobSeeker.getDateOfBirth())
                .degree(jobSeeker.getDegree())
                .linkedinId(jobSeeker.getLinkedinId())
                .desiredJobRole(jobSeeker.getDesiredJobRole())
                .skills(jobSeeker.getSkills())
                .passedOutYear(jobSeeker.getPassedOutYear())
                .currentSalary(jobSeeker.getCurrentSalary())
                .expectedSalary(jobSeeker.getExpectedSalary())
                .build();
    }

    private ApplicationDTO mapApplicationToDTO(Application application) {
        return ApplicationDTO.builder()
                .id(application.getId())
                .jobSeekerId(application.getJobSeeker().getId())
                .jobSeekerName(application.getJobSeeker().getFirstName() + " " +
                        application.getJobSeeker().getLastName())
                .jobSeekerEmail(application.getJobSeeker().getEmail())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getJobTitle())
                .companyName(application.getJob().getEmployer().getCompanyName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}