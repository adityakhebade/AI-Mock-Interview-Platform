# IntervueX Backend

Backend API for IntervueX - AI-Powered Interview Platform

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Environment**: dotenv

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Server will start at http://localhost:5000

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Base Routes

- `GET /` - Welcome message
- `GET /health` - Health check

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── repositories/       # Database access layer
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   ├── validations/        # Input validation
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── .env                    # Environment variables (not committed)
├── .env.example            # Environment template
└── package.json            # Dependencies
```

## Architecture

- **Routes** → Define endpoints
- **Controllers** → Handle requests
- **Services** → Business logic
- **Repositories** → Database operations
- **Middleware** → Request processing

## Environment Variables

Required:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL for CORS

## License

ISC
