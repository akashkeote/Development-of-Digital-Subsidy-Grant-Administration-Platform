# Government Subsidy & Grant Disbursement Tracking System (Backend)

## Overview

The Government Subsidy & Grant Disbursement Tracking System is a Spring Boot based backend application developed as part of the Infosys Springboard Internship.

The system digitizes the complete lifecycle of government welfare schemes including:

- Citizen Registration
- Scheme Management
- Eligibility Verification
- Application Processing
- Multi-Level Approval Workflow
- Fund Disbursement
- Utilization Tracking
- Notifications
- Audit Logging

The objective is to replace manual paper-based workflows with a secure, scalable, and transparent digital platform.

---

# Tech Stack

| Technology | Version |
|------------|---------|
| Java | 21 |
| Spring Boot | 3.5.x |
| Spring Data JPA | Latest |
| Flyway | Latest |
| MySQL | 8.x |
| Maven | Wrapper |
| IntelliJ IDEA | Community Edition |

---

# Backend Architecture

```
Client
   │
REST API
   │
Controller
   │
Service
   │
Repository
   │
MySQL Database
```

---

# Getting Started

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate to Backend

```bash
cd backend
```

## Configure Database

Update

```
src/main/resources/application.properties
```

with your MySQL credentials.

Example

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/govt_subsidy_db
spring.datasource.username=root
spring.datasource.password=your_password
```
If you have followed the database setup instructions:
Use the command  for running the backend with the database profile.
```
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=db"
```
---

## Run Backend

Windows

```powershell
.\mvnw.cmd spring-boot:run
```

Linux/macOS

```bash
./mvnw spring-boot:run
```

---

# Database

The project uses Flyway for version-controlled database migrations.

**Do NOT manually create tables.**

Flyway will automatically create and update the database schema.

---

# Documentation

- DATABASE.md
- BACKEND_GUIDE.md
- CONTRIBUTING.md

---

# Current Status

✅ Environment Setup

✅ Spring Boot Configuration

✅ MySQL Integration

✅ Flyway Configuration

✅ Enterprise Database Design

---