# Government Subsidy Grant Disbursement Tracking System

This repository contains the backend for the Government Subsidy Tracking System. It has been built using a **Modular Monolith** architecture to ensure that the code is well-organized, highly maintainable, and easy for new team members to understand.

## Tech Stack
- **Java**: 25 (LTS)
- **Framework**: Spring Boot 4.1.0
- **Build Tool**: Maven
- **Architecture**: Feature-based Modular Monolith
- **Database Migrations**: Flyway (To be implemented)

## Architecture Overview

The backend (`com.government.infosys`) is divided into distinct feature modules rather than technical layers:

1. **`auth`**: Contains all logic for user management, roles, and authentication.
2. **`scheme`**: Contains all logic for government subsidies, data seeding, and scheme discovery.
3. **`application`**: Contains all logic related to users submitting and tracking applications for subsidies.

This means that if you need to work on authentication, you'll find the `User` model, `UserRepository`, `AuthService`, and `AuthController` all inside the `auth` module.

## Setup & Running the Project

### Prerequisites
- JDK 25 installed
- Maven installed (or you can use the provided Maven wrapper `mvnw`)

### Running Locally

1. Clone the repository and navigate into the `backend` folder:
   ```bash
   git clone https://github.com/akashkeote/Government-Subsidy-Grant-Disbursement-Tracking-System.git
   cd Government-Subsidy-Grant-Disbursement-Tracking-System/backend
   ```

2. Compile the project:
   ```bash
   # On Windows
   .\mvnw.cmd clean compile
   
   # On macOS/Linux
   ./mvnw clean compile
   ```

3. Run the Spring Boot application:
   ```bash
   # On Windows
   .\mvnw.cmd spring-boot:run
   
   # On macOS/Linux
   ./mvnw spring-boot:run
   ```

The backend server will run on `http://localhost:8080`.

## Notes for the Backend Team
- **Frontend Removed**: The old Flutter frontend code has been completely removed to keep this repository strictly focused on the backend.
- **Firebase Removed**: All Firebase logic has been removed in favor of a standard SQL database approach.
- **Database Setup**: Next steps involve setting up Flyway database migrations and writing the SQL schemas for the entities (Users, Subsidies, Applications) to connect with your PostgreSQL/Supabase database.
