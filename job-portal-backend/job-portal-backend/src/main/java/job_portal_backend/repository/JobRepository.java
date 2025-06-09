package job_portal_backend.repository;

import job_portal_backend.entity.Job;
import job_portal_backend.entity.JobSeeker;
import job_portal_backend.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatusAndJobTitleContainingIgnoreCase(JobStatus status, String jobTitle);
    List<Job> findByEmployerIdAndStatus(Long employerId, JobStatus status);
    List<Job> findByStatus(JobStatus status);
    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
            "(:jobTitle IS NULL OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :jobTitle, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:minExperience IS NULL OR j.minExperience <= :minExperience) AND " +
            "(:maxExperience IS NULL OR j.maxExperience >= :maxExperience)")
    List<Job> findJobsWithFilters(@Param("status") JobStatus status,
                                  @Param("jobTitle") String jobTitle,
                                  @Param("location") String location);
}
