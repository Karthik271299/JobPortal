package job_portal_backend.entity;

import jakarta.persistence.*;
import job_portal_backend.enums.JobStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false, length = 1000)
    private String jobDescription;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private Set<String> requiredSkills = new HashSet<>();

    @Column(nullable = false)
    private Integer minExperience;

    @Column(nullable = false)
    private Integer maxExperience;

    @Column(nullable = false)
    private BigDecimal minSalary;

    @Column(nullable = false)
    private BigDecimal maxSalary;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime postedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Many-to-One relationship with Employer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    // One-to-Many relationship with Applications
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications = new ArrayList<>();

}
