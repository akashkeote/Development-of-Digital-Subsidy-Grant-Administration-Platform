# 🏛️ DigiGrant - Government Subsidy & Grant Disbursement Tracking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> **🚀 Live Demo (Frontend):** [https://digigrant.vercel.app/](https://digigrant.vercel.app/)
> **📋 Project Tracking Sheet:** [View GitHub Repository Details for Interns](https://docs.google.com/spreadsheets/d/e/2PACX-1vSHBohJlazYE2oDzlTfXgpScqeMh673N9BKC-cZvO79n0y05wKyhPwjx4lzTWjTJGZnuYSRfJq3PeFw/pubhtml?gid=0&single=true)

DigiGrant is a comprehensive, full-stack digital platform designed to modernize and streamline the disbursement of government subsidies and grants. It replaces tedious manual paperwork with a transparent, automated, and milestone-based multi-tier approval workflow, ensuring funds reach the right citizens at the right time.

---

## 📖 Table of Contents
1. [Project Overview & Impact](#-project-overview--impact)
2. [System Architecture & Workflow](#-system-architecture--workflow)
3. [Key Features by Role](#-key-features-by-role)
4. [Technical Stack](#-technical-stack)
5. [Database Architecture](#-database-architecture)
6. [Running the Project Locally](#-running-the-project-locally)
7. [Resume & Interview Quick-Reference](#-resume--interview-quick-reference-for-interns)

---

## 🎯 Project Overview & Impact

Traditional subsidy disbursement systems suffer from delays, lack of transparency, and high friction for rural citizens. **DigiGrant** solves this by:
- **Automating Eligibility:** An intelligent rules engine that evaluates citizen profiles against scheme requirements instantly.
- **Ensuring Transparency:** Citizens and VLEs (Village Level Entrepreneurs) can track applications in real-time.
- **Enforcing Accountability:** A strict L1 (Field) -> L2 (District) -> L3 (Finance) hierarchy prevents fraud and ensures milestone-based fund release.

---

## 🔄 System Architecture & Workflow

The core of DigiGrant is its **Multi-Tier Verification Workflow**. When a citizen applies for a scheme, the application transitions through a strict pipeline:

1. **Eligibility Engine (System):** Instantly filters out unqualified candidates based on age, income, and region rules.
2. **L1 - Field Verification:** Ground-level officers conduct physical inspections (e.g., checking farm land, business setup) and upload verification reports.
3. **L2 - District Sanctioning:** District Magistrates review L1 reports and generate official, cryptographically secure **Sanction Orders**.
4. **L3 - Finance Approval & Disbursement:** Finance officers review sanction orders and trigger milestone-based **Direct Benefit Transfers (DBT)**.
5. **Compliance Scheduler:** Automated background cron jobs that audit fund utilization and ensure compliance.

---

## ✨ Key Features by Role

### 🧑‍🌾 For Citizens
- **Immersive Discovery:** Scrollytelling-based Landing Page and 3D UI for exploring schemes by category (Agriculture, Education, Housing, etc.).
- **Real-Time Tracking:** Timeline view to track application status from submission to fund disbursement.

### 💼 For Village Level Entrepreneurs (VLEs)
- **Assisted Applications:** Dedicated portal to help rural citizens without internet access apply for schemes.
- **Earnings Dashboard:** Track commissions and successful application milestones in real-time.

### 🏛️ For Government Officials
- **Role-Based Access Control (RBAC):** Secure JWT-based access strictly isolating L1, L2, and L3 permissions.
- **Workflow Dashboards:** Detailed tables and document viewers to approve, reject, or request modifications on applications.

---

## 💻 Technical Stack

### Frontend
- **Framework:** React 18 (with Vite for rapid building)
- **Styling:** Tailwind CSS (Utility-first, responsive, and mobile-optimized)
- **Animations:** Framer Motion (Complex scroll-animations, 3D UI interactions, and page transitions)
- **Icons & Routing:** Lucide React, React Router v6

### Backend
- **Framework:** Java 21, Spring Boot 3.x
- **Architecture:** Modular Monolith (Auth, Scheme, Workflow, Finance modules)
- **Security:** Spring Security with JWT stateless authentication
- **Database Migrations:** Flyway (Version-controlled schema evolution)

### Database & Deployment
- **Database:** PostgreSQL (Hosted on Supabase)
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render

---

## 🗄️ Database Architecture

The relational schema is managed entirely via **Flyway Migrations** and includes 30+ normalized tables, featuring:
- **Core Master Tables:** `users`, `roles`, `departments`, `status_types`.
- **Eligibility & Schemes:** `schemes`, `eligibility_criteria_master`, `scheme_eligibility_rules`.
- **Workflow Execution:** `applications`, `verification_workflow`, `field_verifications`, `district_decisions`.
- **Finance & Audit:** `sanction_orders`, `finance_approvals`, `disbursements`, `audit_log`.

---

## 🚀 Running the Project Locally

### 1. Start the Backend (Spring Boot)
```bash
cd backend
# Compile the project
./mvnw clean compile
# Run the server (starts on http://localhost:8080)
./mvnw spring-boot:run
```

### 2. Start the Frontend (React)
```bash
cd frontend
npm install
npm run dev
# The app will be available at http://localhost:5173
```

---

## 💡 Resume & Interview Quick-Reference (For Interns)

When explaining this project in interviews, highlight these key technical achievements:

- **Complex Business Logic:** Explain the L1/L2/L3 workflow. It shows you understand real-world enterprise requirements, role-based access control, and state-machine-like application lifecycles.
- **Automated Eligibility Engine:** Mention how you decoupled hardcoded checks into an `EligibilityCriteriaMaster` and `SchemeEligibilityRule` table, allowing dynamic rule evaluation.
- **Modern UI/UX:** Mention the use of **Framer Motion** and **Tailwind CSS** to create an "Awwwards-level" scrollytelling experience, proving you care about user engagement, not just functionality.
- **Database Migrations (Flyway):** Highlight that the schema wasn't just built manually. Using Flyway shows you understand CI/CD, production environments, and version-controlling databases.
- **Milestone-Based Disbursement:** Explain that funds aren't dumped at once. The `DisbursementController` and `ComplianceScheduler` enforce milestone completion before releasing the next tranche of money, showcasing your understanding of financial auditing logic.
