CREATE TABLE field_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    officer_id BIGINT NOT NULL,
    assigned_date DATETIME,
    visit_date DATETIME,
    verification_status_id BIGINT NOT NULL,
    remarks TEXT,
    recommendation VARCHAR(30),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fv_application
        FOREIGN KEY (application_id)
            REFERENCES applications(id),

    CONSTRAINT fk_fv_officer
        FOREIGN KEY (officer_id)
            REFERENCES users(id),

    CONSTRAINT fk_fv_status
        FOREIGN KEY (verification_status_id)
            REFERENCES statuses(id)
);

CREATE TABLE district_decisions (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    district_officer_id BIGINT NOT NULL,
    decision_status_id BIGINT NOT NULL,
    decision_date DATETIME,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dd_application
        FOREIGN KEY(application_id)
            REFERENCES applications(id),

    CONSTRAINT fk_dd_officer
        FOREIGN KEY(district_officer_id)
            REFERENCES users(id),

    CONSTRAINT fk_dd_status
        FOREIGN KEY(decision_status_id)
            REFERENCES statuses(id)
);

CREATE TABLE finance_approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    finance_officer_id BIGINT NOT NULL,
    approval_status_id BIGINT NOT NULL,
    budget_verified BOOLEAN DEFAULT FALSE,
    sanction_number VARCHAR(100),
    sanction_date DATE,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fa_application
        FOREIGN KEY(application_id)
            REFERENCES applications(id),

    CONSTRAINT fk_fa_officer
        FOREIGN KEY(finance_officer_id)
            REFERENCES users(id),

    CONSTRAINT fk_fa_status
        FOREIGN KEY(approval_status_id)
            REFERENCES statuses(id)
);

CREATE TABLE finance_installments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_status_id BIGINT NOT NULL,
    transaction_reference VARCHAR(100),
    payment_date DATE,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_installment_application
        FOREIGN KEY(application_id)
            REFERENCES applications(id),

    CONSTRAINT fk_installment_status
        FOREIGN KEY(payment_status_id)
            REFERENCES statuses(id)
);

CREATE INDEX idx_fv_application
    ON field_verifications(application_id);

CREATE INDEX idx_dd_application
    ON district_decisions(application_id);

CREATE INDEX idx_fa_application
    ON finance_approvals(application_id);

CREATE INDEX idx_installment_application
    ON finance_installments(application_id);