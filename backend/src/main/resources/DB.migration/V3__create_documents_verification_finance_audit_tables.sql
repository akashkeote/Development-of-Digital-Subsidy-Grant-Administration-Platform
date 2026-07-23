CREATE TABLE document_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    mandatory_for_all BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_mime_csv VARCHAR(500) NULL,
    max_size_kb INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheme_document_requirements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    scheme_id BIGINT NOT NULL,
    document_type_id BIGINT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_scheme_doc UNIQUE (scheme_id, document_type_id),
    CONSTRAINT fk_sdr_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id),
    CONSTRAINT fk_sdr_doc_type FOREIGN KEY (document_type_id) REFERENCES document_types(id)
);

CREATE TABLE application_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    document_type_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_mime VARCHAR(120) NOT NULL,
    file_size_kb INT NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_latest BOOLEAN NOT NULL DEFAULT TRUE,
    version_no INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_ad_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_ad_doc_type FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    CONSTRAINT fk_ad_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
);

CREATE TABLE verification_checks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    check_code VARCHAR(60) NOT NULL,
    check_name VARCHAR(150) NOT NULL,
    status_id BIGINT NOT NULL,
    checked_by_user_id BIGINT NULL,
    checked_at DATETIME NULL,
    remarks VARCHAR(500) NULL,
    evidence_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_app_check UNIQUE (application_id, check_code),
    CONSTRAINT fk_vc_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_vc_status FOREIGN KEY (status_id) REFERENCES statuses(id),
    CONSTRAINT fk_vc_checked_by FOREIGN KEY (checked_by_user_id) REFERENCES users(id)
);

CREATE TABLE grievance_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_no VARCHAR(40) NOT NULL UNIQUE,
    application_id BIGINT NULL,
    citizen_id BIGINT NOT NULL,
    category VARCHAR(60) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status_id BIGINT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    assigned_to_user_id BIGINT NULL,
    opened_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    CONSTRAINT fk_gt_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_gt_citizen FOREIGN KEY (citizen_id) REFERENCES citizen_profiles(id),
    CONSTRAINT fk_gt_status FOREIGN KEY (status_id) REFERENCES statuses(id),
    CONSTRAINT fk_gt_assigned_user FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);

CREATE TABLE grievance_updates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    grievance_ticket_id BIGINT NOT NULL,
    update_by_user_id BIGINT NOT NULL,
    update_text VARCHAR(1000) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gu_ticket FOREIGN KEY (grievance_ticket_id) REFERENCES grievance_tickets(id),
    CONSTRAINT fk_gu_user FOREIGN KEY (update_by_user_id) REFERENCES users(id)
);

CREATE TABLE sanction_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL UNIQUE,
    sanction_no VARCHAR(50) NOT NULL UNIQUE,
    sanctioned_amount DECIMAL(15,2) NOT NULL,
    sanctioned_by_user_id BIGINT NOT NULL,
    sanctioned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sanction_notes VARCHAR(500) NULL,
    CONSTRAINT fk_so_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_so_user FOREIGN KEY (sanctioned_by_user_id) REFERENCES users(id)
);

CREATE TABLE disbursements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    installment_no INT NOT NULL DEFAULT 1,
    amount DECIMAL(15,2) NOT NULL,
    payment_status_id BIGINT NOT NULL,
    transaction_ref VARCHAR(100) NULL UNIQUE,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'DBT',
    initiated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME NULL,
    failure_reason VARCHAR(500) NULL,
    CONSTRAINT uk_disb_app_installment UNIQUE (application_id, installment_no),
    CONSTRAINT fk_disb_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_disb_status FOREIGN KEY (payment_status_id) REFERENCES statuses(id)
);

CREATE TABLE utilization_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    submitted_by_user_id BIGINT NOT NULL,
    report_period_from DATE NOT NULL,
    report_period_to DATE NOT NULL,
    reported_amount DECIMAL(15,2) NOT NULL,
    summary VARCHAR(1000) NULL,
    status_id BIGINT NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_by_user_id BIGINT NULL,
    verified_at DATETIME NULL,
    CONSTRAINT fk_ur_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_ur_submitted_by FOREIGN KEY (submitted_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_ur_status FOREIGN KEY (status_id) REFERENCES statuses(id),
    CONSTRAINT fk_ur_verified_by FOREIGN KEY (verified_by_user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipient_user_id BIGINT NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NULL,
    message VARCHAR(1000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reference_type VARCHAR(40) NULL,
    reference_id BIGINT NULL,
    scheduled_at DATETIME NULL,
    sent_at DATETIME NULL,
    error_message VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (recipient_user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    actor_user_id BIGINT NULL,
    action_code VARCHAR(60) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id BIGINT NOT NULL,
    old_values_json JSON NULL,
    new_values_json JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE INDEX idx_ad_app_doc_latest ON application_documents(application_id, document_type_id, is_latest);
CREATE INDEX idx_vc_app_status ON verification_checks(application_id, status_id);
CREATE INDEX idx_gt_citizen_status ON grievance_tickets(citizen_id, status_id, opened_at);
CREATE INDEX idx_disb_app_status ON disbursements(application_id, payment_status_id);
CREATE INDEX idx_ur_app_status ON utilization_reports(application_id, status_id);
CREATE INDEX idx_notif_user_status ON notifications(recipient_user_id, status, scheduled_at);
CREATE INDEX idx_audit_entity_time ON audit_logs(entity_type, entity_id, created_at);