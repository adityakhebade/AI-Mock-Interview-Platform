# Architecture Decision Records (ADR)

Each record documents an important architectural or technical decision.

---

## ADR-001: Use PostgreSQL instead of MongoDB

Date: 2026-07-11

Status: Accepted

### Context

The application stores users, resumes, interview sessions,
questions, answers, reports, and analytics.

Most entities have strong relationships.

### Decision

Use PostgreSQL with Prisma ORM.

### Alternatives Considered

- MongoDB + Mongoose

### Reason

- Better support for relational data
- Easier reporting and analytics
- Strong constraints
- Better fit for interview history

### Consequences

Pros

- Strong consistency
- Easier joins
- Cleaner schema

Cons

- Less flexible for unstructured data

Future

If AI transcripts become very large,
they may be stored separately while
metadata remains in PostgreSQL.

---