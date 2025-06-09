package job_portal_backend.repository;

import job_portal_backend.entity.JobSeeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker,Long> {
    Optional<JobSeeker> findByEmail(String email);
}
