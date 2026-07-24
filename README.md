# IntervueX

AI-Powered Mock Interview Platform

## Description

IntervueX is a modern interview preparation platform that helps candidates practice coding and behavioral interviews with AI-powered feedback.

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Clerk

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk

## Project Structure

```
intervuex/
├── frontend/         # Next.js Frontend Application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── public/       # Static assets
│   └── package.json
│
├── backend/          # Express.js Backend API
│   ├── src/          # Source code
│   │   ├── config/   # Configuration
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Middleware
│   │   └── ...
│   ├── prisma/       # Database schema
│   └── package.json
│
├── context/          # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon account)
- Clerk Account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/adityakhebade/AI-Mock-Interview-Platform.git
cd intervuex
```

2. **Setup Frontend**

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

3. **Setup Backend**

```bash
cd ../backend
npm install
```

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_postgresql_connection_string

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs at http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at http://localhost:3000

## Features

- 🎯 AI-powered interview practice
- 💼 Coding and behavioral questions
- 📊 Performance analytics
- 📝 Resume analysis
- 🔐 Secure authentication with Clerk
- 🗄️ PostgreSQL database with Prisma ORM

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- More endpoints coming soon...

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
