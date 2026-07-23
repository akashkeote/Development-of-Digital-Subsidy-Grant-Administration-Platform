CREATE TABLE utilization_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    submitted_by BIGINT NOT NULL,
    submission_date DATETIME,
    utilization_status_id BIGINT NOT NULL,
    total_amount_used DECIMAL(15,2),
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_us_application
        FOREIGN KEY(application_id)
            REFERENCES applications(id),
    CONSTRAINT fk_us_user
        FOREIGN KEY(submitted_by)
            REFERENCES users(id),
    CONSTRAINT fk_us_status
        FOREIGN KEY(utilization_status_id)
            REFERENCES statuses(id)
);

CREATE TABLE utilization_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utilization_submission_id BIGINT NOT NULL,
    document_type_id BIGINT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ud_submission
        FOREIGN KEY(utilization_submission_id)
            REFERENCES utilization_submissions(id)
                ON DELETE CASCADE,

    CONSTRAINT fk_ud_document
        FOREIGN KEY(document_type_id)
            REFERENCES document_types(id)
);

CREATE INDEX idx_us_application
    ON utilization_submissions(application_id);

CREATE INDEX idx_ud_submission
    ON utilization_documents(utilization_submission_id);