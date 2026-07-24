# 15 AI Module

## Goal

Provide centralized AI capabilities for IntervueX, including question generation, resume analysis, answer evaluation, interview feedback, and report generation.

---

## Tech Stack

- Gemini API (or OpenAI)
- Express.js
- Prisma ORM
- Zod

---

## Responsibilities

- Generate interview questions
- Analyze resume
- Evaluate answers
- Generate interview feedback
- Generate final report
- Handle prompt management
- Handle AI response parsing
- Retry failed AI requests

---

## Folder Structure

src/
├── controllers/
│   └── ai.controller.ts
├── services/
│   ├── ai.service.ts
│   ├── prompt.service.ts
│   └── gemini.service.ts
├── repositories/
│   └── ai.repository.ts (Optional)
├── routes/
│   └── ai.routes.ts
├── prompts/
│   ├── resume.prompt.ts
│   ├── interview.prompt.ts
│   ├── evaluation.prompt.ts
│   └── report.prompt.ts
└── utils/
    └── ai-parser.ts

---

## AI Features

- Resume Analysis
- Question Generation
- Answer Evaluation
- Interview Feedback
- Report Generation

---

## API Endpoints

POST /api/v1/ai/resume-analysis

POST /api/v1/ai/questions

POST /api/v1/ai/evaluate

POST /api/v1/ai/report

---

## Service Methods

analyzeResume()

generateQuestions()

evaluateAnswers()

generateReport()

---

## Business Rules

- User must be authenticated.
- AI requests require valid interview/resume.
- Validate AI response before saving.
- Log AI failures.
- Retry failed requests.

---

## Security

- Store API keys in environment variables.
- Never expose AI keys.
- Validate AI responses.
- Apply rate limiting.

---

## Deliverables

✅ AI Service

✅ Prompt Templates

✅ Gemini/OpenAI Integration

✅ Response Parser

✅ AI Routes

---

## AI Execution Prompt

Implement the AI Module.

Requirements:

- Create reusable AI service.
- Integrate Gemini/OpenAI.
- Keep prompts separate.
- Validate responses before saving.
- Reuse the service across Interview, Question, Evaluation, and Report modules.
- Follow Controller → Service architecture.

---

## Success Criteria

- Resume analysis works.
- Questions are generated.
- Answers are evaluated.
- Reports are generated.
- Invalid AI responses are handled gracefully.