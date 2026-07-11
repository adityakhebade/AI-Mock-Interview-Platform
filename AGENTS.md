# AGENTS.md

## AI Agent Entry Point

Before implementing any feature, modifying any code, or making any architectural decision, read the following files **in order**.

The project documentation is the source of truth. Do not make assumptions that contradict it.

---

## Required Reading Order

1. `context/project-overview.md`

   * Product vision
   * Goals
   * Core user flow
   * Features
   * Scope
   * Success criteria

2. `context/architecture.md`

   * System architecture
   * Technology stack
   * Layer responsibilities
   * Storage model
   * Authentication model
   * Invariants

3. `context/ui-context.md`

   * Design system
   * Color tokens
   * Typography
   * Component conventions
   * Layout principles

4. `context/code-standards.md`

   * Coding conventions
   * File organization
   * API standards
   * Security rules
   * Testing requirements

5. `context/ai-workflow-rules.md`

   * Development workflow
   * Scoping rules
   * Implementation process
   * Verification requirements

6. `context/progress-tracker.md`

   * Current milestone
   * Completed work
   * Active task
   * Pending work
   * Known issues
   * Next implementation unit

---

# Operating Rules

The AI agent must treat the documentation as the authoritative specification.

Do not:

* Invent requirements.
* Change architecture.
* Add undocumented features.
* Skip verification.
* Ignore project standards.

---

# Development Workflow

For every implementation task:

1. Read the required context files.
2. Understand the current implementation state.
3. Implement only the requested unit of work.
4. Verify correctness.
5. Update documentation if implementation changes documented behavior.
6. Update `context/progress-tracker.md`.
7. Stop.

Never continue to the next feature unless explicitly instructed.

---

# Scope Rules

Implement exactly one unit of work at a time.

Do not:

* Begin future phases.
* Implement speculative features.
* Add convenience features that were not requested.
* Perform unrelated refactoring.

If additional work is discovered:

* Document it.
* Do not implement it unless requested.

---

# Architecture Rules

The following architecture must never be violated:

```text
Route
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

Business logic belongs only in services.

Repositories perform database access only.

Controllers coordinate requests and responses only.

---

# Documentation Rules

If implementation changes:

* Product scope
* Architecture
* API behavior
* Database structure
* Design system
* Development workflow

Update the corresponding document before continuing.

Documentation must always reflect the current implementation.

---

# Progress Tracking

After every meaningful implementation:

Update:

```text
context/progress-tracker.md
```

Include:

* Completed work
* Current milestone
* Remaining tasks
* Blockers
* Next recommended implementation unit

---

# Decision Making

When requirements are unclear:

Stop.

Explain the ambiguity.

Present available options.

Wait for approval.

Never guess business requirements.

Never silently modify architecture.

---

# Code Quality Expectations

Every implementation must:

* Follow the layered architecture.
* Pass validation.
* Include error handling.
* Respect ownership rules.
* Follow code standards.
* Maintain consistent API responses.
* Be testable.
* Avoid dead code.
* Avoid unnecessary complexity.

---

# Final Rule

Prioritize correctness, maintainability, and consistency over implementation speed.

Build for today's requirements while preserving the architecture for future expansion.
