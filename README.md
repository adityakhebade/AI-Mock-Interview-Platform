# 🚀 IntervueX

> AI-Powered Technical Interview Platform for Software Engineers

IntervueX is a full-stack AI-powered technical interview platform that simulates real software engineering interviews. It provides candidates with an interactive interview experience featuring real-time video conferencing, collaborative coding, AI-based evaluation, interview analytics, resume analysis, and detailed performance reports.

The platform is designed with a scalable layered architecture, enabling modular development, maintainability, and future AI integrations.

---

## 📸 Screenshots

> Add screenshots here

| Home | Dashboard |
|------|-----------|
| ![](docs/home.png) | ![](docs/dashboard.png) |

---

# ✨ Features

### 👤 Authentication

- Secure authentication
- Session management
- Protected routes
- User profile management

---

### 🎥 AI Interview Room

- Real-time video interview
- Microphone & camera controls
- Screen sharing support
- Interview timer
- Live interview status
- Collaborative interview session

---

### 💻 Collaborative Code Editor

- Monaco Editor
- Multi-language support
- Syntax highlighting
- Real-time collaboration
- Code execution support (planned)
- Auto-save functionality

---

### 🤖 AI Interviewer

- AI-generated interview questions
- Adaptive questioning
- Follow-up questions
- Behavioral interview support
- Technical interview support
- AI feedback generation

---

### 📊 Dashboard

- Interview history
- Upcoming interviews
- Performance analytics
- Skill progress tracking
- Statistics overview

---

### 📄 Resume Analysis

- Resume upload
- ATS score analysis
- Resume improvement suggestions
- Skill extraction
- Keyword analysis

---

### 📈 Reports & Analytics

- Coding performance
- Communication analysis
- Confidence score
- Technical score
- Overall interview score
- Detailed AI feedback

---

### ⚙️ Settings

- Profile management
- Theme support
- Notification preferences
- Account settings

---

# 🏗️ Architecture

```
                    Next.js Frontend
                           │
                   REST API (Express)
                           │
                  Service Layer
                           │
                 Business Logic Layer
                           │
                 Prisma ORM
                           │
                     PostgreSQL
```

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Clerk Authentication

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Socket.io

---

## AI

- Google Gemini API
- AI Interview Evaluation
- Resume Analysis
- Interview Feedback

---

## Real-Time

- Socket.io
- Live Code Collaboration
- Video Session Synchronization

---

## Database

- PostgreSQL
- Prisma ORM

---

## Deployment

- Vercel (Frontend)
- Render / Railway (Backend)
- Neon PostgreSQL

---

# 📂 Project Structure

```
IntervueX/

├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── sockets/
│   │   └── utils/
│   │
│   └── prisma/
│
└── docs/
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/intervuex.git
```

```bash
cd intervuex
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start server

```bash
npm run dev
```

---

# 🔑 Environment Variables

### Frontend

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_SOCKET_URL=

NEXT_PUBLIC_GEMINI_API_KEY=
```

---

### Backend

```env
DATABASE_URL=

JWT_SECRET=

PORT=

GEMINI_API_KEY=

FRONTEND_URL=
```

---

# 📌 Future Enhancements

- AI Voice Interviewer
- Live Whiteboard
- Screen Recording
- Interview Scheduling
- Company-specific Interview Modes
- Coding Question Library
- Contest Mode
- Team Interviews
- AI Cheat Detection
- Recruiter Dashboard
- Leaderboard
- Mock Interview Marketplace

---

# 📊 Roadmap

- [x] Frontend UI
- [x] Authentication
- [x] Dashboard
- [x] Interview Configuration
- [ ] Backend APIs
- [ ] Database Integration
- [ ] Real-Time Interview Room
- [ ] AI Interview Evaluation
- [ ] Resume Analyzer
- [ ] Reports & Analytics
- [ ] Deployment

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Aditya Khebade**

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile

---

⭐ If you like this project, consider giving it a Star.
