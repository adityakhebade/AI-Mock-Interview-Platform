# AI Workflow Rules

## Purpose

These rules define how an AI coding agent must behave while developing this project. The objective is to produce predictable, maintainable, production-quality software through incremental development.

---

# 1. Follow the Specification

* Always implement the approved specification.
* Do not invent new features.
* Do not change project architecture without explicit approval.
* Do not optimize for convenience over correctness.
* Treat the planning documents as the source of truth.

---

# 2. Work Incrementally

* Build exactly one unit of work at a time.
* Fully complete the current unit before starting another.
* Do not implement future features while working on the current task.
* Avoid introducing placeholder implementations for future functionality.

Example:

Correct:

```
Resume Upload
→ Complete
→ Test
→ Review
→ Merge

Then

Interview Module
```

Incorrect:

```
Resume Upload
Interview
AI
Reports

(all partially completed)
```

---

# 3. Never Expand Scope

Only implement what was explicitly requested.

Do not:

* Add new database tables.
* Add additional API endpoints.
* Create extra abstractions.
* Introduce new libraries.
* Add optional features.

Unless explicitly instructed.

---

# 4. Split Large Tasks

If a task cannot reasonably be completed in one implementation cycle, split it into smaller deliverables.

Example:

Resume Module

Step 1

* Database
* Upload endpoint

Step 2

* Cloudinary integration

Step 3

* View resumes

Step 4

* Delete resume

Never attempt to implement an entire large module in one change.

---

# 5. Handle Missing Requirements

If requirements are ambiguous:

* Stop implementation.
* Identify the ambiguity.
* Present the available options.
* Explain the trade-offs.
* Wait for a decision.

Never guess business requirements.

Never silently make architectural decisions.

---

# 6. Respect Project Architecture

Always follow:

```
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma
```

Never violate this architecture.

Controllers must never access Prisma.

Repositories must never contain business logic.

---

# 7. Respect Module Boundaries

Every feature belongs to exactly one module.

Do not place functionality inside unrelated modules.

Example:

Resume parsing belongs to:

```
Resume Module
```

Not

```
User Module
```

---

# 8. Do Not Modify Protected Files

Do not edit the following unless explicitly instructed:

* Generated Prisma client
* `node_modules/`
* shadcn/ui generated components
* Lock files
* Auto-generated Swagger files
* Generated migration history
* Third-party library code

Extend them when necessary.

Do not rewrite them.

---

# 9. Preserve Existing Behavior

Before modifying existing code:

* Understand its purpose.
* Preserve existing functionality.
* Avoid breaking public APIs.
* Avoid unnecessary refactoring.

If refactoring is required:

* Keep it isolated.
* Explain why it is necessary.

---

# 10. Keep Documentation Synchronized

Whenever implementation changes:

Update the corresponding documentation.

Examples:

Database changes

→ Update

```
docs/database.md
```

New API

→ Update

```
docs/api.md
```

Architecture changes

→ Update

```
docs/architecture.md
```

Feature completion

→ Update

```
docs/roadmap.md
```

Documentation must never become outdated.

---

# 11. Write Production Code

Always:

* Handle errors.
* Validate input.
* Return consistent responses.
* Write readable code.
* Remove dead code.
* Follow project conventions.

Never:

* Leave TODOs for required functionality.
* Leave debugging statements.
* Leave unused imports.
* Commit commented-out code.

---

# 12. Testing Rules

Every completed feature must include appropriate verification.

When applicable:

* Unit tests
* Integration tests
* Manual verification steps

Do not consider a feature complete if it cannot be verified.

---

# 13. AI Features

AI functionality must remain isolated.

The interview engine must never depend directly on an AI provider.

Instead:

```
Interview Engine

↓

AI Service

↓

LLM Provider
```

Changing AI providers must not require changes to business logic.

---

# 14. Ask Before Architectural Changes

Never:

* Change folder structure.
* Replace libraries.
* Change authentication strategy.
* Replace database technologies.
* Change API design.

Without explicit approval.

---

# 15. Finish Before Starting

Before beginning another unit:

* Complete implementation.
* Verify functionality.
* Update documentation.
* Ensure tests pass.
* Confirm requirements are satisfied.

Only then begin the next unit.

---

# Verification Checklist

Before marking a unit as complete, verify all of the following:

## Implementation

* Feature is fully implemented.
* No placeholder logic remains.
* No unfinished TODOs.

## Architecture

* Layered architecture is respected.
* No business logic exists in controllers.
* Database access occurs only through repositories.

## Validation

* All inputs are validated.
* Error cases are handled.

## Security

* Authentication is enforced where required.
* Authorization and ownership checks are implemented.

## Testing

* Unit tests pass.
* Integration tests pass.
* Manual testing confirms expected behavior.

## Documentation

* Relevant documentation has been updated.
* API documentation is synchronized.
* Database documentation reflects implementation.

## Code Quality

* ESLint passes.
* Formatting is correct.
* No unused imports.
* No dead code.
* No debugging statements.

---

# Final Rule

When uncertain, **stop and ask**.

Never guess.

Never assume.

Never silently change the project's architecture, business rules, or scope.
