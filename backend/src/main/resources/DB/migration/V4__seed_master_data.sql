-- 1) Roles
INSERT INTO roles (code, name, is_system)
VALUES
    ('CITIZEN', 'Citizen', TRUE),
    ('DEO', 'Data Entry Operator', TRUE),
    ('VERIFIER', 'Verifier', TRUE),
    ('APPROVER', 'Approver', TRUE),
    ('FINANCE_OFFICER', 'Finance Officer', TRUE),
    ('DISTRICT_OFFICER', 'District Officer', TRUE),
    ('GRIEVANCE_OFFICER', 'Grievance Officer', TRUE),
    ('AUDITOR', 'Auditor', TRUE),
    ('ADMIN', 'System Administrator', TRUE)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    is_system = EXCLUDED.is_system;


-- 2) Departments
INSERT INTO departments (code, name, is_active)
VALUES
    ('SOC_WEL', 'Social Welfare Department', TRUE),
    ('AGRI', 'Department of Agriculture', TRUE),
    ('EDU', 'Department of Education', TRUE),
    ('RURAL_DEV', 'Rural Development Department', TRUE),
    ('WCD', 'Women and Child Development Department', TRUE),
    ('MINORITY', 'Minority Welfare Department', TRUE)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    is_active = EXCLUDED.is_active;


-- 3) Status Types
INSERT INTO status_types (code, name, is_active)
VALUES
    ('APPLICATION', 'Application Status', TRUE),
    ('APPROVAL', 'Approval Decision Status', TRUE),
    ('PAYMENT', 'Payment Status', TRUE),
    ('VERIFICATION', 'Verification Status', TRUE),
    ('GRIEVANCE', 'Grievance Status', TRUE),
    ('UTILIZATION', 'Utilization Report Status', TRUE),
    ('TASK', 'Workflow Task Status', TRUE)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    is_active = EXCLUDED.is_active;


-- 4) Application Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'DRAFT' AS code, 'Draft' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'SUBMITTED', 'Submitted', 2, FALSE
    UNION ALL SELECT 'UNDER_SCRUTINY', 'Under Scrutiny', 3, FALSE
    UNION ALL SELECT 'PENDING_CLARIFICATION', 'Pending Clarification', 4, FALSE
    UNION ALL SELECT 'FIELD_VERIFICATION', 'Field Verification', 5, FALSE
    UNION ALL SELECT 'RECOMMENDED', 'Recommended', 6, FALSE
    UNION ALL SELECT 'APPROVED', 'Approved', 7, TRUE
    UNION ALL SELECT 'REJECTED', 'Rejected', 8, TRUE
    UNION ALL SELECT 'ON_HOLD', 'On Hold', 9, FALSE
    UNION ALL SELECT 'CLOSED', 'Closed', 10, TRUE
) x
              ON st.code = 'APPLICATION';


-- 5) Approval Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'PENDING' AS code, 'Pending' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'RECOMMENDED', 'Recommended', 2, FALSE
    UNION ALL SELECT 'APPROVED', 'Approved', 3, TRUE
    UNION ALL SELECT 'REJECTED', 'Rejected', 4, TRUE
    UNION ALL SELECT 'RETURNED', 'Returned for Rework', 5, FALSE
) x
              ON st.code = 'APPROVAL';


-- 6) Payment Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'PENDING' AS code, 'Pending' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'INITIATED', 'Initiated', 2, FALSE
    UNION ALL SELECT 'SUCCESS', 'Success', 3, TRUE
    UNION ALL SELECT 'FAILED', 'Failed', 4, TRUE
    UNION ALL SELECT 'REVERSED', 'Reversed', 5, TRUE
) x
              ON st.code = 'PAYMENT';


-- 7) Verification Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'PENDING' AS code, 'Pending' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'IN_PROGRESS', 'In Progress', 2, FALSE
    UNION ALL SELECT 'VERIFIED', 'Verified', 3, TRUE
    UNION ALL SELECT 'FAILED', 'Failed', 4, TRUE
    UNION ALL SELECT 'WAIVED', 'Waived', 5, TRUE
) x
              ON st.code = 'VERIFICATION';


-- 8) Grievance Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'OPEN' AS code, 'Open' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'IN_REVIEW', 'In Review', 2, FALSE
    UNION ALL SELECT 'RESOLVED', 'Resolved', 3, TRUE
    UNION ALL SELECT 'REOPENED', 'Reopened', 4, FALSE
    UNION ALL SELECT 'CLOSED', 'Closed', 5, TRUE
) x
              ON st.code = 'GRIEVANCE';


-- 9) Utilization Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'SUBMITTED' AS code, 'Submitted' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'UNDER_REVIEW', 'Under Review', 2, FALSE
    UNION ALL SELECT 'ACCEPTED', 'Accepted', 3, TRUE
    UNION ALL SELECT 'REJECTED', 'Rejected', 4, TRUE
    UNION ALL SELECT 'REVISION_REQUIRED', 'Revision Required', 5, FALSE
) x
              ON st.code = 'UTILIZATION';


-- 10) Task Statuses
INSERT INTO statuses
(status_type_id, code, name, display_order, is_terminal, is_active)
SELECT
    st.id,
    x.code,
    x.name,
    x.display_order,
    x.is_terminal,
    TRUE
FROM status_types st
         JOIN (
    SELECT 'PENDING' AS code, 'Pending' AS name, 1 AS display_order, FALSE AS is_terminal
    UNION ALL SELECT 'ASSIGNED', 'Assigned', 2, FALSE
    UNION ALL SELECT 'IN_PROGRESS', 'In Progress', 3, FALSE
    UNION ALL SELECT 'COMPLETED', 'Completed', 4, TRUE
    UNION ALL SELECT 'REASSIGNED', 'Reassigned', 5, FALSE
    UNION ALL SELECT 'CANCELLED', 'Cancelled', 6, TRUE
) x
              ON st.code = 'TASK';


-- 11) Workflow Stages
INSERT INTO workflow_stages (code, name, stage_type)
VALUES
    ('SUBMISSION', 'Application Submission', 'SYSTEM'),
    ('SCRUTINY', 'Initial Scrutiny', 'MANUAL'),
    ('VERIFICATION', 'Field/Document Verification', 'MANUAL'),
    ('APPROVAL', 'Competent Authority Approval', 'MANUAL'),
    ('SANCTION', 'Sanction Generation', 'SYSTEM'),
    ('DISBURSEMENT', 'Fund Disbursement', 'SYSTEM'),
    ('UTILIZATION_TRACKING', 'Utilization Tracking', 'MANUAL'),
    ('CLOSURE', 'Case Closure', 'SYSTEM');