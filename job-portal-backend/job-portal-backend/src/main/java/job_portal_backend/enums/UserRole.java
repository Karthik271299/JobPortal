package job_portal_backend.enums;

public enum UserRole {
    JOBSEEKER("JobSeeker"),
    EMPLOYER("Employer");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
