package job_portal_backend.enums;

public enum JobStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    CLOSED("Closed"),
    DRAFT("Draft");

    private final String displayName;

    JobStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
