# 15-ai-module.md

# AI Module

## Brief

Provide centralized AI capabilities for IntervueX. This module communicates with Gemini/OpenAI, generates structured responses, validates them, and returns them to the appropriate modules.

---

## Goal

Implement a reusable AI service.

---

## Prerequisites

✅ Authentication Module

✅ Resume Module

✅ Interview Module

✅ Question Module

✅ Submission Module

✅ Evaluation Module

✅ Report Module

---

# Tech Stack

- Express.js
- JavaScript (ES Modules)
- Gemini API (or OpenAI)
- Zod

---

# Folder Structure

src/

controllers/
    ai.controller.js

services/
    ai.service.js
    gemini.service.js
    prompt.service.js

routes/
    ai.routes.js

prompts/
    resume.prompt.js
    question.prompt.js
    evaluation.prompt.js
    report.prompt.js

utils/
    aiParser.js

---

# AI Features

- Resume Analysis
- Interview Question Generation
- Answer Evaluation
- Interview Feedback
- Report Summary

---

# Routes

POST /api/v1/ai/resume-analysis

Description

Analyze uploaded resume.

---

POST /api/v1/ai/questions

Description

Generate interview questions.

---

POST /api/v1/ai/evaluate

Description

Evaluate interview submissions.

---

POST /api/v1/ai/report

Description

Generate report summary.

---

# Services

## ai.service.js

Methods

analyzeResume()

generateQuestions()

evaluateInterview()

generateReport()

Responsibilities

- Coordinate AI operations
- Validate requests
- Parse AI responses
- Handle retries

---

## gemini.service.js

Responsibilities

- Call Gemini/OpenAI API
- Handle API errors
- Return raw AI response

---

## prompt.service.js

Responsibilities

- Load prompts
- Replace placeholders
- Return final prompt

---

# Prompt Templates

resume.prompt.js

question.prompt.js

evaluation.prompt.js

report.prompt.js

Each prompt should return JSON only.

---

# AI Parser

Responsibilities

- Parse AI response
- Validate JSON format
- Return structured data
- Throw validation errors

---

# Business Rules

- Authentication required.
- AI requests require valid interview or resume.
- AI responses must be validated before use.
- Retry failed AI requests.
- Never save data directly from this module.
- Calling modules are responsible for database updates.

---

# Security

- Store API keys in environment variables.
- Never expose API keys.
- Validate AI responses.
- Apply rate limiting.
- Log AI failures safely.

---

# Deliverables

✅ AI Service

✅ Gemini/OpenAI Integration

✅ Prompt Service

✅ Prompt Templates

✅ AI Parser

✅ AI Routes

---

# AI Execution Prompt

Implement the AI Module.

Requirements

- Use JavaScript (ES Modules).
- Integrate Gemini or OpenAI.
- Create reusable AI service.
- Keep prompts in separate files.
- Parse and validate AI responses.
- Implement retry logic for failed requests.
- Return structured JSON responses.
- Follow Controller → Service architecture.
- Do not save data directly to the database.

---

# Success Criteria

✓ Resume analysis works

✓ Interview questions generated

✓ Answers evaluated

✓ Report summary generated

✓ Invalid AI responses handled

✓ Ready for Socket.IO Module