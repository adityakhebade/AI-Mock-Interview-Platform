# Project Overview

## Overview

The AI Mock Interview Platform is a web application that helps users prepare for job interviews through structured mock interview sessions. Users can upload their resume or provide prerequisite information to personalize the interview experience. The platform manages interview sessions, stores user responses, tracks interview history, and provides detailed feedback and performance reports. The application is designed with a modular architecture so that advanced AI capabilities, coding interviews, voice interviews, and recruiter features can be added in future phases without requiring major changes to the core system.

---

# Goals

1. Build a production-quality interview preparation platform with a scalable architecture.
2. Allow users to create and manage personalized interview sessions.
3. Provide resume management with secure cloud storage.
4. Store interview history so users can track their progress over time.
5. Generate detailed interview reports and performance analytics.
6. Design the system so AI features can be integrated without modifying the core interview engine.
7. Follow industry-standard backend architecture and development practices.
8. Create a maintainable codebase that can continue growing into a complete SaaS application.

---

# Core User Flow

1. User visits the application.
2. User signs up or signs in using Clerk Authentication.
3. The backend creates or synchronizes the user's profile in PostgreSQL.
4. User lands on the dashboard.
5. User uploads a resume.
6. Resume is securely stored in Cloudinary while metadata is saved in PostgreSQL.
7. User creates a new interview session.
8. User selects:
   - Interview type
   - Difficulty
   - Duration
   - Resume to use
9. The interview session is created.
10. User starts the interview.
11. Questions are presented one by one.
12. User submits answers.
13. Answers are automatically saved throughout the interview.
14. If the interview is interrupted, the user can resume from the last saved question.
15. User submits the completed interview.
16. The platform generates an interview report.
17. User reviews:
    - Overall score
    - Question-wise responses
    - Strengths
    - Weaknesses
    - Previous interview history
18. User starts another interview whenever they want.

---

# Features

## Authentication

- Clerk Authentication
- Sign up
- Sign in
- Sign out
- Protected routes
- Automatic user synchronization with PostgreSQL

---

## User Management

- User profile
- Profile information
- Dashboard
- Interview history

---

## Resume Management

- Upload resume
- Replace resume
- Delete resume
- View uploaded resumes
- Cloudinary file storage
- Resume metadata management

---

## Interview Management

- Create interview session
- Select interview settings
- Start interview
- Save progress
- Resume interrupted interview
- Submit interview

---

## Interview Engine

- Question navigation
- Previous/Next question
- Timer
- Answer storage
- Auto-save
- Interview completion

---

## Results & Reports

- Interview summary
- Overall score
- Question-wise review
- Strengths
- Weaknesses
- Historical reports

---

## Dashboard

- Welcome section
- Resume status
- Recent interviews
- Performance overview
- Quick actions

---

## System Features

- REST API
- Swagger documentation
- Logging
- Error handling
- Validation
- Rate limiting
- Security middleware

---

# In Scope

## Phase 1

### Foundation

- Next.js frontend
- Express.js backend
- PostgreSQL database
- Prisma ORM
- Clerk Authentication
- Cloudinary integration

### User Module

- Authentication
- User synchronization
- User profile

### Resume Module

- Upload
- View
- Delete
- Replace

### Interview Module

- Create interview
- Configure interview
- Start interview
- Save answers
- Auto-save progress
- Resume interview
- Complete interview

### Results Module

- Generate interview report
- Store interview history
- Display previous results

### Dashboard

- Resume overview
- Recent interviews
- Performance summary

### Engineering

- Layered architecture
- REST API
- Zod validation
- Winston logging
- Swagger documentation
- Centralized error handling
- Unit tests
- Integration tests
- GitHub Actions
- CodeRabbit
- ESLint
- Prettier
- Husky

---

# Out of Scope

The following features are intentionally excluded from the first release.

## AI

- AI-generated interview questions
- AI answer evaluation
- Resume ATS analysis
- AI feedback
- AI roadmap generation
- AI coding review

---

## Coding Interviews

- Monaco Editor
- Code execution
- Test cases
- Coding evaluation

---

## Voice & Video

- Voice interviews
- Speech-to-text
- Text-to-speech
- Webcam support
- Video recording

---

## Real-Time Collaboration

- Shared coding editor
- Shared whiteboard
- Screen sharing
- Pair interviews
- WebRTC

---

## Platform Features

- Payments
- Premium subscriptions
- Recruiter dashboard
- Company dashboard
- Admin dashboard
- Notifications
- Email reminders
- Team management

---

# Success Criteria

The project is considered complete for Phase 1 when:

- Users can authenticate using Clerk.
- User records are synchronized with PostgreSQL.
- Users can upload, replace, view, and delete resumes.
- Resume files are stored securely in Cloudinary.
- Users can create interview sessions.
- Users can complete an interview from start to finish.
- Answers are automatically saved.
- Interrupted interviews can be resumed.
- Completed interviews generate reports.
- Users can access previous interview history.
- All APIs are documented using Swagger.
- Request validation is implemented using Zod.
- Errors are handled through centralized middleware.
- Logging is implemented using Winston.
- Security middleware is configured.
- Unit and integration tests pass.
- The application is deployed and fully functional.
- The architecture supports future AI, coding, voice, and platform features without major refactoring.