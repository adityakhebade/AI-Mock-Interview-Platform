# Code Standards

## General

* Follow the Single Responsibility Principle. Every module, service, controller, and component should have one clear responsibility.
* Keep business logic inside the service layer. Controllers should only coordinate requests and responses.
* Repositories are responsible only for database operations.
* Build reusable modules instead of feature-specific implementations.
* Fix the root cause of problems instead of adding temporary workarounds.
* Avoid duplicate code. Extract reusable utilities or services when logic is repeated.
* Keep functions small, readable, and focused.
* Prefer composition over inheritance.
* Every feature should be modular and independently testable.
* Do not mix unrelated concerns in the same file or module.

---

# JavaScript

* Use modern ES Modules (`import` / `export`).
* Prefer `const` over `let`. Avoid `var`.
* Use async/await instead of Promise chains.
* Always handle asynchronous errors.
* Avoid deeply nested conditionals by returning early.
* Use descriptive variable and function names.
* Never leave commented-out code in the repository.
* Avoid magic numbers and hardcoded strings. Use constants where appropriate.
* Keep utility functions pure whenever possible.

---

# Express.js

* Routes should only define endpoints and middleware.
* Controllers should only parse requests and return responses.
* Services should contain all business logic.
* Repositories should be the only layer that communicates with Prisma.
* Middleware should handle cross-cutting concerns such as authentication, validation, and logging.
* Every route should have a single responsibility.
* Do not access Prisma directly from controllers.

---

# Next.js

* Organize features by domain instead of page size.
* Keep pages focused on rendering and user interaction.
* Extract reusable UI into components.
* Keep API communication inside dedicated service files.
* Avoid placing business logic inside React components.
* Use server-side rendering or server actions only when they provide a clear benefit.
* Keep client-side state minimal.

---

# Styling

* Use Tailwind CSS utility classes.
* Use shadcn/ui components whenever possible.
* Avoid custom CSS unless necessary.
* Follow the project's design tokens for spacing, colors, and typography.
* Use the predefined spacing scale (4, 8, 16, 24, 32, 40, 48, 64).
* Avoid hardcoded colors throughout the application.
* Maintain responsive layouts for mobile, tablet, and desktop.

---

# API Routes

* Validate every request using Zod before business logic executes.
* Authenticate every protected endpoint.
* Verify resource ownership before allowing updates or deletion.
* Return consistent response structures.
* Use appropriate HTTP status codes.
* Keep route handlers thin by delegating work to services.
* Version every endpoint under `/api/v1/`.

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# Data and Storage

* Store structured application data in PostgreSQL.
* Store uploaded files in Cloudinary.
* Store only file metadata and URLs in PostgreSQL.
* Never store uploaded files on the application server.
* Never duplicate data across tables unless there is a justified performance requirement.
* Use Prisma as the only database access layer.
* Every table should use CUID as its primary key.
* Every table should include `createdAt` and `updatedAt` timestamps.

---

# Validation

* Every request body must be validated using Zod.
* Never trust client-provided input.
* Validate route parameters and query parameters.
* Sanitize user input where appropriate.
* Fail fast when validation fails.

---

# Authentication & Authorization

* Clerk is responsible for authentication.
* The application is responsible for authorization.
* Every authenticated user must exist in the application's `User` table.
* Always verify ownership before accessing protected resources.
* Never expose another user's data.

---

# Logging

* Log important application events using Winston.
* Log unexpected errors with sufficient context.
* Never log passwords, authentication tokens, or sensitive user data.
* Keep log messages consistent and meaningful.

---

# Error Handling

* Throw custom application errors instead of generic errors.
* Handle all uncaught errors through centralized error middleware.
* Return consistent error responses.
* Never expose internal implementation details to clients.

---

# Testing

* Write unit tests for business logic.
* Write integration tests for API endpoints.
* Mock external services such as Clerk and Cloudinary.
* New features should include appropriate test coverage.
* Do not merge code that breaks existing tests.

---

# Security

* Use Helmet for secure HTTP headers.
* Configure CORS explicitly.
* Apply rate limiting to public endpoints.
* Never commit secrets or API keys.
* Access configuration only through the centralized configuration module.
* Use HTTPS in production.
* Keep dependencies updated.

---

# File Organization

## `config/`

Application configuration, environment loading, and third-party service configuration.

---

## `routes/`

Express route definitions only.

---

## `controllers/`

HTTP request handling and response formatting.

---

## `services/`

Business logic and application workflows.

---

## `repositories/`

Database operations using Prisma.

---

## `middleware/`

Authentication, authorization, validation, logging, and error handling.

---

## `validations/`

Zod schemas for request validation.

---

## `prisma/`

Prisma schema, migrations, and client configuration.

---

## `components/`

Reusable React UI components.

---

## `pages/` / `app/`

Application routes and page composition.

---

## `hooks/`

Reusable React hooks.

---

## `services/` (Frontend)

API communication with the backend.

---

## `utils/`

Reusable helper functions with no business logic.

---

## `constants/`

Application-wide constants and configuration values.

---

# Architecture Rules

1. Controllers must never contain business logic.
2. Services must never access HTTP request or response objects.
3. Repositories must never contain business logic.
4. React components must never directly communicate with the database.
5. Business logic should exist in exactly one place.
6. Every protected resource must verify ownership.
7. Every API must be documented in Swagger.
8. Every request must pass validation before reaching the service layer.
9. Every feature should be independently testable.
10. Build for future extensibility without introducing unnecessary complexity.
