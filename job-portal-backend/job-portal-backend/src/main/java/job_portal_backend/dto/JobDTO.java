package job_portal_backend.dto;

import jakarta.validation.constraints.*;
import job_portal_backend.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class JobDTO {
    private Long id;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    @Size(max = 1000, message = "Job description cannot exceed 1000 characters")
    private String jobDescription;

    @NotEmpty(message = "At least one skill is required")
    private Set<String> requiredSkills;

    @NotNull(message = "Minimum experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer minExperience;

    @NotNull(message = "Maximum experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer maxExperience;

    @NotNull(message = "Minimum salary is required")
    @DecimalMin(value = "0.0", message = "Salary cannot be negative")
    private BigDecimal minSalary;

    @NotNull(message = "Maximum salary is required")
    @DecimalMin(value = "0.0", message = "Salary cannot be negative")
    private BigDecimal maxSalary;

    @NotBlank(message = "Location is required")
    private String location;

    private JobStatus status;
    private Long employerId;
    private String employerName;
    private String companyName;
    private LocalDateTime postedAt;
}
