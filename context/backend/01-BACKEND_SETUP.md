# 01-backend-setup.md

# IntervueX Backend Setup

## Goal

Set up the backend foundation for IntervueX using **Node.js, Express.js, JavaScript (ES Modules), Prisma, and PostgreSQL**.

This step creates only the backend infrastructure. Do **not** implement authentication or any business modules.

---

# Tech Stack

- Node.js
- Express.js
- JavaScript (ES Modules)
- PostgreSQL
- Prisma ORM
- dotenv
- cors
- helmet
- morgan
- compression

---

# Folder Structure

backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md

---

# Install Packages

## Runtime

express

cors

helmet

compression

dotenv

morgan

zod

@prisma/client

## Development

prisma

nodemon

---

# Package.json Scripts

"dev"

Start development server using nodemon.

"start"

Start production server.

"prisma:generate"

Generate Prisma client.

"prisma:migrate"

Run Prisma migrations.

"prisma:studio"

Open Prisma Studio.

---

# Environment Variables

PORT=5000

NODE_ENV=development

DATABASE_URL=

FRONTEND_URL=http://localhost:3000

---

# Express Middleware Order

Helmet

↓

CORS

↓

Compression

↓

Morgan Logger

↓

JSON Parser

↓

Routes

↓

404 Handler

↓

Global Error Handler

---

# Routes

Create only:

GET /

Returns:

{
  "success": true,
  "message": "IntervueX Backend Running"
}

---

GET /health

Returns:

{
  "success": true,
  "status": "Healthy"
}

---

# Coding Rules

- Use JavaScript ES Modules.
- Use async/await.
- No callbacks.
- No TypeScript.
- No authentication.
- No Prisma models.
- No business logic.
- Keep project modular.

---

# Deliverables

✅ Backend folder created

✅ Express server configured

✅ Environment configuration

✅ Middleware configured

✅ Health endpoint

✅ Base route

✅ Prisma initialized

---

# AI Execution Prompt

Implement the backend foundation.

Requirements:

- Use JavaScript (ES Modules), not TypeScript.
- Create the folder structure exactly as defined.
- Configure Express.
- Configure middleware.
- Initialize Prisma.
- Configure environment variables.
- Create "/" and "/health" routes.
- Use clean code and modular architecture.
- Do not implement authentication or database models.
- Ensure the server starts successfully with `npm run dev`.

---

# Success Criteria

✓ Server starts without errors

✓ GET / works

✓ GET /health works

✓ Middleware configured

✓ Prisma initialized

✓ Folder structure matches specification

✓ Ready for Authentication Module