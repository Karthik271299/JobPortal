package job_portal_backend.enums;

public enum ApplicationStatus {
    APPLIED("Applied"),
    REVIEWED("Reviewed"),
    SHORTLISTED("Shortlisted"),
    REJECTED("Rejected"),
    HIRED("Hired");

    private final String displayName;

    ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
