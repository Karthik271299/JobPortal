package job_portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "job_seekers")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class JobSeeker extends User{
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String degree;

    private String linkedinId;

    @Column(nullable = false)
    private String desiredJobRole;

    @ElementCollection
    @CollectionTable(name = "jobseeker_skills", joinColumns = @JoinColumn(name = "jobseeker_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @Column(nullable = false)
    private Integer passedOutYear;

    private BigDecimal currentSalary;

    private BigDecimal expectedSalary;

    // Cascading relationship
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications = new ArrayList<>();
}
