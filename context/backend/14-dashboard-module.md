# 14-dashboard-module.md

# Dashboard Module

## Brief

Provide a centralized dashboard with interview statistics, performance metrics, recent activity, and analytics for the authenticated user.

---

## Goal

Implement the dashboard aggregation module.

---

## Prerequisites

✅ Authentication Module

✅ Resume Module

✅ Interview Module

✅ Evaluation Module

✅ Report Module

---

# Tech Stack

- Express.js
- JavaScript (ES Modules)
- Prisma ORM
- PostgreSQL

---

# Folder Structure

src/

controllers/
    dashboard.controller.js

services/
    dashboard.service.js

repositories/
    dashboard.repository.js

routes/
    dashboard.routes.js

---

# Dashboard Sections

## Overview

- Total Interviews
- Completed Interviews
- Active Interviews
- Total Reports
- Total Resumes
- Average Score

---

## Analytics

- Interview Performance
- Score Trend
- Interview Types
- Difficulty Distribution

---

## Recent Activity

- Recent Interviews
- Recent Reports
- Latest Resume

---

# Routes

GET /api/v1/dashboard

Description

Return complete dashboard data.

---

GET /api/v1/dashboard/stats

Description

Return dashboard statistics.

---

GET /api/v1/dashboard/analytics

Description

Return dashboard analytics.

---

GET /api/v1/dashboard/recent

Description

Return recent user activity.

---

# Repository

Methods

getDashboardStats()

getDashboardAnalytics()

getRecentInterviews()

getRecentReports()

getLatestResume()

---

# Service

Methods

getDashboard()

getStats()

getAnalytics()

getRecentActivity()

Responsibilities

- Aggregate data from multiple modules.
- Format dashboard response.
- Return default values when no data exists.
- Optimize database queries.

---

# Controller

Methods

overview()

stats()

analytics()

recent()

---

# Business Rules

- Authentication required.
- Dashboard displays only authenticated user's data.
- Return empty arrays when no records exist.
- Return zero values when no statistics exist.
- Dashboard is read-only.

---

# Security

- Verify authenticated user.
- Never expose another user's dashboard.
- Always use authenticated user from auth middleware.

---

# Deliverables

✅ Dashboard Repository

✅ Dashboard Service

✅ Dashboard Controller

✅ Dashboard Routes

---

# AI Execution Prompt

Implement the Dashboard Module.

Requirements

- Use JavaScript (ES Modules).
- Aggregate data from Resume, Interview, Evaluation, and Report modules.
- Return dashboard overview, analytics, and recent activity.
- Optimize Prisma queries.
- Follow Route → Controller → Service → Repository architecture.
- Use authenticated user from auth middleware.
- Do not implement charts or frontend components.

---

# Success Criteria

✓ Dashboard loads successfully

✓ Statistics are accurate

✓ Analytics generated correctly

✓ Recent activity displayed

✓ Only authenticated user's data returned

✓ Ready for AI Module