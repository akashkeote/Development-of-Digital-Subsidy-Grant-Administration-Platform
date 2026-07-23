# Contribution Guidelines

## Branch Naming

```
feature/user-management

feature/eligibility

feature/application

feature/finance

bugfix/login
```


---

# Pull Requests

- Test before pushing.
- Keep PR focused on one feature.
- Request review before merge.

---

# Database Rules

Never modify existing Flyway migrations after they are committed.

Create new migrations:

```
V8__description.sql

V9__description.sql
```

---

# Before Pushing

Run

```
mvn clean test
```

or

```
.\mvnw.cmd clean test
```

Ensure the application starts without errors.

---

# Code Review Checklist

- Builds successfully
- No compilation errors
- Follows package structure
- Uses meaningful names
- Includes validation
- No hardcoded credentials