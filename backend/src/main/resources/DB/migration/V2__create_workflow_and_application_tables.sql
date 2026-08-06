CREATE TABLE workflow_stages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    stage_type VARCHAR(30) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheme_workflow_stages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    scheme_id BIGINT NOT NULL,
    workflow_stage_id BIGINT NOT NULL,
    stage_order INT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    sla_days INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_scheme_stage_order UNIQUE (scheme_id, stage_order),
    CONSTRAINT uk_scheme_stage UNIQUE (scheme_id, workflow_stage_id),
    CONSTRAINT fk_sws_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id),
    CONSTRAINT fk_sws_stage FOREIGN KEY (workflow_stage_id) REFERENCES workflow_stages(id)
);

CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_no VARCHAR(40) NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_stage_id BIGINT NULL,
    current_status_id BIGINT NOT NULL,
    approval_status_id BIGINT NOT NULL,
    remarks VARCHAR(500) NULL,
    priority VARCHAR(20) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_citizen FOREIGN KEY (citizen_id) REFERENCES citizen_profiles(id),
    CONSTRAINT fk_app_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id),
    CONSTRAINT fk_app_stage FOREIGN KEY (current_stage_id) REFERENCES workflow_stages(id),
    CONSTRAINT fk_app_current_status FOREIGN KEY (current_status_id) REFERENCES statuses(id),
    CONSTRAINT fk_app_approval_status FOREIGN KEY (approval_status_id) REFERENCES statuses(id)
);

CREATE TABLE application_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    from_status_id BIGINT NULL,
    to_status_id BIGINT NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    remarks VARCHAR(500) NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ash_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_ash_from_status FOREIGN KEY (from_status_id) REFERENCES statuses(id),
    CONSTRAINT fk_ash_to_status FOREIGN KEY (to_status_id) REFERENCES statuses(id),
    CONSTRAINT fk_ash_changed_by FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);
CREATE TABLE application_workflow_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    workflow_stage_id BIGINT NOT NULL,
    assigned_to_user_id BIGINT NULL,
    assigned_to_role_id BIGINT NULL,
    status_id BIGINT NOT NULL,
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    due_at DATETIME NULL,
    remarks VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_awt_app FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_awt_stage FOREIGN KEY (workflow_stage_id) REFERENCES workflow_stages(id),
    CONSTRAINT fk_awt_user FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
    CONSTRAINT fk_awt_role FOREIGN KEY (assigned_to_role_id) REFERENCES roles(id),
    CONSTRAINT fk_awt_status FOREIGN KEY (status_id) REFERENCES statuses(id)
);

CREATE TABLE task_actions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    action_code VARCHAR(30) NOT NULL,
    action_by_user_id BIGINT NOT NULL,
    action_remarks VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ta_task FOREIGN KEY (task_id) REFERENCES application_workflow_tasks(id),
    CONSTRAINT fk_ta_user FOREIGN KEY (action_by_user_id) REFERENCES users(id)
);

CREATE INDEX idx_apps_scheme_status_date ON applications(scheme_id, current_status_id, submitted_at);
CREATE INDEX idx_apps_citizen_submitted ON applications(citizen_id, submitted_at);
CREATE INDEX idx_tasks_user_status_due ON application_workflow_tasks(assigned_to_user_id, status_id, due_at);
CREATE INDEX idx_tasks_role_status_due ON application_workflow_tasks(assigned_to_role_id, status_id, due_at);
CREATE INDEX idx_ash_app_changed_at ON application_status_history(application_id, changed_at);