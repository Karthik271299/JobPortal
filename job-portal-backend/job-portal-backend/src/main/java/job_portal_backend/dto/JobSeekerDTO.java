package job_portal_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class JobSeekerDTO {
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Degree is required")
    private String degree;

    private String linkedinId;

    @NotBlank(message = "Desired job role is required")
    private String desiredJobRole;

    @NotEmpty(message = "At least one skill is required")
    private Set<String> skills;

    @NotNull(message = "Passed out year is required")
    @Min(value = 1990, message = "Invalid year")
    @Max(value = 2030, message = "Invalid year")
    private Integer passedOutYear;

    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;
}
