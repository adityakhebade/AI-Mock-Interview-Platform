# 14 Dashboard Module

## Goal

Provide a centralized dashboard with interview statistics, performance metrics, recent activities, and user insights.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Dashboard overview
- Interview statistics
- Resume statistics
- Performance analytics
- Recent interviews
- Recent reports
- Upcoming interviews (Future)

---

## Folder Structure

src/
├── controllers/
│   └── dashboard.controller.ts
├── services/
│   └── dashboard.service.ts
├── repositories/
│   └── dashboard.repository.ts
├── routes/
│   └── dashboard.routes.ts
└── dto/
    └── dashboard.dto.ts

---

## Dashboard Data

Overview

- Total Interviews
- Completed Interviews
- Active Interviews
- Total Reports
- Total Resumes
- Average Score

Analytics

- Score Trend
- Interview Performance
- Interview Types
- Difficulty Distribution

Recent Activity

- Recent Interviews
- Recent Reports
- Latest Resume

---

## API Endpoints

GET /api/v1/dashboard

GET /api/v1/dashboard/stats

GET /api/v1/dashboard/analytics

GET /api/v1/dashboard/recent

---

## Repository Methods

getDashboardStats()

getAnalytics()

getRecentInterviews()

getRecentReports()

---

## Service Methods

getDashboard()

getStats()

getAnalytics()

getRecentActivity()

---

## Controller Methods

overview()

stats()

analytics()

recent()

---

## Business Rules

- Dashboard shows only authenticated user's data.
- Aggregate data from multiple modules.
- Return default values if no data exists.
- Optimize queries to reduce database calls.

---

## Security

- Authentication required.
- Never expose another user's data.
- Use req.user.id for all queries.

---

## Deliverables

✅ Dashboard Repository

✅ Dashboard Service

✅ Dashboard Controller

✅ Dashboard Routes

---

## AI Execution Prompt

Implement the Dashboard Module.

Requirements:

- Aggregate data from User, Resume, Interview, Evaluation, and Report modules.
- Return dashboard overview, analytics, and recent activity.
- Optimize Prisma queries.
- Follow Controller → Service → Repository architecture.
- Use authenticated user from req.user.id.

---

## Success Criteria

- Dashboard loads successfully.
- Statistics are accurate.
- Recent activity is displayed.
- Analytics are calculated correctly.
- Only authenticated user's data is returned.
- ESLint and TypeScript pass.