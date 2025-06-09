package job_portal_backend.repository;

import job_portal_backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobSeekerIdOrderByAppliedAtDesc(Long jobSeekerId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    List<Application> findByJobEmployerIdOrderByAppliedAtDesc(Long employerId);
    boolean existsByJobSeekerIdAndJobId(Long jobSeekerId, Long jobId);
}
