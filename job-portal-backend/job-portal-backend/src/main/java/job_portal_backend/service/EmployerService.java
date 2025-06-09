package job_portal_backend.service;

import job_portal_backend.dto.*;
import job_portal_backend.entity.*;
import job_portal_backend.enums.*;
import job_portal_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final JobRepository jobRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public EmployerDTO getProfile() {
        Employer employer = getCurrentEmployer();
        log.info("Employer :{}",employer);
        return mapToDTO(employer);
    }

    public EmployerDTO updateProfile(EmployerDTO dto) {
        Employer employer = getCurrentEmployer();

        employer.setFirstName(dto.getFirstName());
        employer.setLastName(dto.getLastName());
        employer.setMobileNumber(dto.getMobileNumber());
        employer.setDesignation(dto.getDesignation());
        employer.setCompanyName(dto.getCompanyName());

        employerRepository.save(employer);
        log.info("Employer profile updated: {}", employer.getEmail());

        return mapToDTO(employer);
    }

    public JobDTO createJob(JobDTO dto) {
        Employer employer = getCurrentEmployer();

        Job job = Job.builder()
                .jobTitle(dto.getJobTitle())
                .jobDescription(dto.getJobDescription())
                .requiredSkills(dto.getRequiredSkills().stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet()))
                .minExperience(dto.getMinExperience())
                .maxExperience(dto.getMaxExperience())
                .minSalary(dto.getMinSalary())
                .maxSalary(dto.getMaxSalary())
                .location(dto.getLocation())
                .status(JobStatus.ACTIVE)
                .employer(employer)
                .build();

        jobRepository.save(job);
        log.info("Job created by employer {}: {}", employer.getId(), job.getJobTitle());

        return mapJobToDTO(job);
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getMyPostedJobs() {
        Employer employer = getCurrentEmployer();
        return jobRepository.findByEmployerIdAndStatus(employer.getId(), JobStatus.ACTIVE)
                .stream()
                .map(this::mapJobToDTO)
                .collect(Collectors.toList());
    }

    public JobDTO updateJob(Long jobId, JobDTO dto) {
        Employer employer = getCurrentEmployer();
        Job job = jobRepository.findById(jobId)
                .filter(j -> j.getEmployer().getId().equals(employer.getId()))
                .orElseThrow(() -> new RuntimeException("Job not found or access denied"));

        job.setJobTitle(dto.getJobTitle());
        job.setJobDescription(dto.getJobDescription());
        job.setRequiredSkills(dto.getRequiredSkills().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet()));
        job.setMinExperience(dto.getMinExperience());
        job.setMaxExperience(dto.getMaxExperience());
        job.setMinSalary(dto.getMinSalary());
        job.setMaxSalary(dto.getMaxSalary());
        job.setLocation(dto.getLocation());

        jobRepository.save(job);
        log.info("Job updated by employer {}: {}", employer.getId(), job.getId());

        return mapJobToDTO(job);
    }

    public void deleteJob(Long jobId) {
        Employer employer = getCurrentEmployer();
        Job job = jobRepository.findById(jobId)
                .filter(j -> j.getEmployer().getId().equals(employer.getId()))
                .orElseThrow(() -> new RuntimeException("Job not found or access denied"));

        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
        log.info("Job deleted by employer {}: {}", employer.getId(), job.getId());
    }

    @Transactional(readOnly = true)
    public List<JobSeekerDTO> searchCandidates(String skills, String jobRole) {
        log.info("Skills : {}", skills);
        log.info("jobRole : {}", jobRole);
        return jobSeekerRepository.findAll()
                .stream()
                .filter(jobSeeker -> {
                    boolean skillsMatch = false;
                    boolean jobRoleMatch = false;

                    if (skills != null && !skills.trim().isEmpty()) {
                        String[] searchSkills = skills.toLowerCase().split(",");
                        skillsMatch = Arrays.stream(searchSkills)
                                .map(String::trim)
                                .anyMatch(searchSkill ->
                                        jobSeeker.getSkills().stream()
                                                .anyMatch(jobSeekerSkill ->
                                                        jobSeekerSkill.toLowerCase().contains(searchSkill) ||
                                                                searchSkill.contains(jobSeekerSkill.toLowerCase())
                                                )
                                );
                    }

                    if (jobRole != null && !jobRole.trim().isEmpty()) {
                        String[] searchJobRoles = jobRole.toLowerCase().split(",");
                        jobRoleMatch = Arrays.stream(searchJobRoles)
                                .map(String::trim)
                                .anyMatch(searchRole ->
                                        jobSeeker.getDesiredJobRole().toLowerCase().contains(searchRole) ||
                                                searchRole.contains(jobSeeker.getDesiredJobRole().toLowerCase())
                                );
                    }

                    if ((skills == null || skills.trim().isEmpty()) &&
                            (jobRole == null || jobRole.trim().isEmpty())) {
                        return true; // No filters applied, return all
                    }

                    return skillsMatch || jobRoleMatch;
                })
                .map(this::mapJobSeekerToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getJobApplications(Long jobId) {
        Employer employer = getCurrentEmployer();
        Job job = jobRepository.findById(jobId)
                .filter(j -> j.getEmployer().getId().equals(employer.getId()))
                .orElseThrow(() -> new RuntimeException("Job not found or access denied"));

        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream()
                .map(this::mapApplicationToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getAllMyJobApplications() {
        Employer employer = getCurrentEmployer();
        return applicationRepository.findByJobEmployerIdOrderByAppliedAtDesc(employer.getId())
                .stream()
                .map(this::mapApplicationToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationDTO updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Employer employer = getCurrentEmployer();
        Application application = applicationRepository.findById(applicationId)
                .filter(app -> app.getJob().getEmployer().getId().equals(employer.getId()))
                .orElseThrow(() -> new RuntimeException("Application not found or access denied"));

        application.setStatus(status);
        applicationRepository.save(application);
        log.info("Application status updated by employer {}: {} -> {}",
                employer.getId(), applicationId, status);

        return mapApplicationToDTO(application);
    }

    private Employer getCurrentEmployer() {
        return authService.getCurrentUser()
                .filter(user -> user.getRole() == UserRole.EMPLOYER)
                .map(user -> employerRepository.findByEmail(user.getEmail())
                        .orElseThrow(() -> new RuntimeException("Employer not found")))
                .orElseThrow(() -> new RuntimeException("Access denied"));
    }

    private EmployerDTO mapToDTO(Employer employer) {
        return EmployerDTO.builder()
                .id(employer.getId())
                .firstName(employer.getFirstName())
                .lastName(employer.getLastName())
                .email(employer.getEmail())
                .mobileNumber(employer.getMobileNumber())
                .designation(employer.getDesignation())
                .companyName(employer.getCompanyName())
                .build();
    }

    private JobDTO mapJobToDTO(Job job) {
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

    private JobSeekerDTO mapJobSeekerToDTO(JobSeeker jobSeeker) {
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
