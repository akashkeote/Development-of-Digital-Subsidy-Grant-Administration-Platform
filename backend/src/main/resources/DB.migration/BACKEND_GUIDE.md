# Backend Development Guide

## Layered Architecture

```
Controller

↓

Service

↓

Repository

↓

Database
```

Business logic must never be written inside controllers.

---

# Package Structure

```
config

controller

dto

entity

exception

mapper

repository

security

service

util
```

---

# Development Order

1. Entity

2. Repository

3. DTO

4. Service

5. Controller

6. Security

---

# Coding Standards

- Use Constructor Injection
- Use Lombok
- Use ResponseEntity
- Keep Controllers Thin
- Business Logic in Services
- Repository only for Database Access

---

# API Naming

```
GET

POST

PUT

DELETE
```

RESTful naming conventions should be followed.

---

# Exception Handling

Use Global Exception Handler.

Avoid try-catch blocks inside controllers.

---

# Validation

Use Bean Validation.

Example

```
@NotNull

@NotBlank

@Email

@Size
```

---

# Logging

Use SLF4J.

Avoid System.out.println().