# IntervueX Backend API

Production-ready Express.js backend with TypeScript for the IntervueX AI Mock Interview Platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Middleware**: Cookie Parser, Compression
- **Code Quality**: ESLint, Prettier

## Project Structure

```
server/
├── src/
│   ├── config/          # Environment configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── repositories/    # Database access layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── sockets/         # WebSocket handlers
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express application setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript output
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn or pnpm

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   API_VERSION=v1
   CORS_ORIGIN=http://localhost:3000
   ```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Code Quality

- **Lint code**:
  ```bash
  npm run lint
  ```

- **Fix lint issues**:
  ```bash
  npm run lint:fix
  ```

- **Format code**:
  ```bash
  npm run format
  ```

- **Check formatting**:
  ```bash
  npm run format:check
  ```

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Available Endpoints

#### Health Check

**GET** `/api/v1/health`

Check server health and status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
}
```

### Response Format

All API responses follow a consistent format:

#### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Error detail 1", "Error detail 2"]
}
```

## Architecture

The backend follows a layered architecture pattern:

```
Request → Route → Controller → Service → Repository → Database
```

### Layer Responsibilities

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Repositories**: Perform database operations
- **Middleware**: Handle cross-cutting concerns (auth, validation, logging)

### Design Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Clean Architecture**: Business logic is isolated from infrastructure
3. **Dependency Injection**: Services receive dependencies through constructors
4. **Error Handling**: Centralized error handling middleware
5. **Validation**: All inputs are validated using Zod schemas

## Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: API abuse prevention (to be added)
- **Input Validation**: Request validation using Zod
- **Error Masking**: Production errors don't expose internal details

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `API_VERSION` | API version | `v1` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Development Guidelines

### Adding a New Feature

1. Create route definition in `routes/`
2. Implement controller in `controllers/`
3. Add business logic in `services/`
4. Create repository for database access in `repositories/`
5. Define validation schema in `validators/`
6. Update route index to include new routes

### Code Standards

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Keep functions small and focused
- Add JSDoc comments for complex logic
- Handle errors appropriately
- Use async/await instead of callbacks

### Best Practices

- Never put business logic in controllers
- Controllers should only coordinate requests
- Services contain all business rules
- Repositories only perform database operations
- Always validate user input
- Use proper HTTP status codes
- Return consistent response formats
- Log important events and errors

## Next Steps

After the basic backend setup, the next implementation units are:

1. **Database Setup**: Configure Prisma and PostgreSQL
2. **Authentication**: Integrate Clerk authentication middleware
3. **User Module**: User synchronization and profile management
4. **Resume Module**: Resume upload, view, and delete endpoints
5. **Interview Module**: Interview session management
6. **Reports Module**: Interview report generation

## License

ISC
