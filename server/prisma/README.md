# Prisma Database Setup

## Prerequisites

Before running migrations, you need to have PostgreSQL installed and running.

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL Service**:
   - Windows: PostgreSQL service should start automatically
   - macOS: `brew services start postgresql@15`
   - Linux: `sudo systemctl start postgresql`

3. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE intervuex;

   # Exit
   \q
   ```

### Option 2: Cloud PostgreSQL (Recommended for Development)

Use a cloud PostgreSQL provider:
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **Railway** (free trial): https://railway.app

After creating a database, copy the connection string and update `DATABASE_URL` in `.env`.

## Running Migrations

Once PostgreSQL is running:

```bash
# Generate Prisma Client (if not already done)
npx prisma generate

# Create and apply the initial migration
npx prisma migrate dev --name init_core

# View migration status
npx prisma migrate status
```

## Prisma Studio (Database GUI)

View and edit your database using Prisma Studio:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## Schema Changes

After modifying `schema.prisma`:

1. Validate schema: `npx prisma validate`
2. Generate client: `npx prisma generate`
3. Create migration: `npx prisma migrate dev --name <migration_name>`

## Resetting Database (Development Only)

⚠️ **Warning**: This deletes all data

```bash
npx prisma migrate reset
```

## Production Deployment

```bash
# Run pending migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Troubleshooting

### Can't reach database server

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Test connection: `psql "postgresql://postgres:postgres@localhost:5432/intervuex"`

### Migration conflicts

If migrations are out of sync:

```bash
# Development only
npx prisma migrate reset

# Or resolve manually
npx prisma migrate resolve --rolled-back <migration_name>
```

### Schema validation errors

```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

## Database Schema

The IntervueX database includes:

- **User**: Local user records synced from Clerk
- **Interview**: Mock interview sessions
- **InterviewQuestion**: Questions within an interview
- **Submission**: Candidate answers to questions
- **Evaluation**: Performance reports and scores
- **Resume**: Resume metadata (files stored in Cloudinary)

See `../context/backend/03-DATABASE_DESIGN.md` for detailed schema documentation.
