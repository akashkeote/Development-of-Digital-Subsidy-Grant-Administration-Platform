# Database Documentation

## Database Name

```
govt_subsidy_db
```

---

# Migration Strategy

The project follows Flyway versioning.

```
V1 → Initial Schema

V2 → Reference Data

V3 → Business Tables

V4 → Master Data

V5 → Eligibility Engine

V6 → Workflow Execution

V7 → Finance & Utilization
```

Never edit previous migrations.

Create a new migration whenever schema changes are required.

---

# Database Modules

## 1. User Management

Tables

- users
- roles
- user_role_assignments
- departments
- user_departments

Purpose

Manage authentication, authorization and department mapping.

---

## 2. Citizen Module

Tables

- citizen_profiles

Purpose

Maintain beneficiary information.

---

## 3. Scheme Module

Tables

- schemes
- scheme_budget_allocations
- document_types
- scheme_required_documents

Purpose

Manage government schemes and required documents.

---

## 4. Eligibility Engine

Tables

- eligibility_criteria_master
- scheme_eligibility_rules

Purpose

Dynamic rule evaluation without changing source code.

---

## 5. Workflow Engine

Tables

- workflow_stages
- scheme_workflow_stages
- application_workflow_tasks

Purpose

Supports configurable approval workflows.

---

## 6. Application Processing

Tables

- applications
- application_documents
- application_status_history

Purpose

Complete application lifecycle.

---

## 7. Verification

Tables

- field_verifications
- district_decisions

Purpose

Government verification process.

---

## 8. Finance

Tables

- finance_approvals
- finance_installments

Purpose

Approval and staged fund release.

---

## 9. Utilization

Tables

- utilization_submissions
- utilization_documents

Purpose

Track utilization certificates before further installments.

---

## 10. System

Tables

- notifications
- audit_logs

Purpose

Audit trail and notifications.

---

# Database Principles

- Third Normal Form
- Foreign Key Integrity
- Version Controlled
- Modular Design
- Configurable Workflow
- Dynamic Eligibility