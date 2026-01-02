# Quickstart: Photo Album Organizer

**Feature**: 001-photo-album-organizer  
**Date**: 2026-01-02  
**Phase**: 1 - Design

## Prerequisites

- **Node.js**: v20+ (LTS recommended)
- **npm**: v10+ (comes with Node.js)
- **Supabase CLI**: v1.150+ (`npm install -g supabase`)
- **Git**: For version control

## Initial Setup

### 1. Clone and Install Dependencies

```bash
cd photo-album-organizer
npm install
```

### 2. Set Up Supabase Local Development

```bash
# Start Supabase local stack (requires Docker)
supabase start

# Output will include:
# API URL: http://localhost:54321
# anon key: eyJ...
# service_role key: eyJ...
```

### 3. Configure Environment Variables

Create `.env.local` in project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For production, use your Supabase project values:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

```bash
# Apply migrations to local database
supabase db reset

# This runs all migrations in supabase/migrations/
```

### 5. Start Development Server

```bash
npm run dev

# Opens at http://localhost:5173
```

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest unit tests |
| `npm run test:integration` | Run integration tests (requires Supabase running) |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `supabase start` | Start local Supabase stack |
| `supabase stop` | Stop local Supabase stack |
| `supabase db reset` | Reset database and run migrations |
| `supabase gen types typescript` | Generate TypeScript types from schema |

## Development Workflow

### Creating a New Feature

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Write tests first (TDD encouraged):
   ```bash
   npm run test -- --watch
   ```

4. Make changes and ensure tests pass:
   ```bash
   npm run test && npm run lint && npm run typecheck
   ```

5. Create a pull request

### Database Changes

1. Create a new migration:
   ```bash
   supabase migration new your_migration_name
   ```

2. Edit the migration file in `supabase/migrations/`

3. Apply locally:
   ```bash
   supabase db reset
   ```

4. Generate updated TypeScript types:
   ```bash
   supabase gen types typescript --local > src/types/database.ts
   ```

### Testing

```bash
# Unit tests only
npm run test

# With coverage
npm run test -- --coverage

# Integration tests (requires Supabase running)
npm run test:integration

# E2E tests (requires dev server running)
npm run test:e2e

# E2E tests in headed mode (see browser)
npm run test:e2e -- --headed
```

## Project Structure Overview

```
photo-album-organizer/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Business logic
│   ├── lib/            # Infrastructure (Supabase client)
│   ├── types/          # TypeScript types
│   └── pages/          # Route components
├── tests/
│   ├── unit/           # Vitest unit tests
│   ├── integration/    # Supabase integration tests
│   └── e2e/            # Playwright E2E tests
├── supabase/
│   ├── migrations/     # SQL migrations
│   └── config.toml     # Supabase config
└── specs/              # Feature specifications
```

## Supabase Studio

Access the local Supabase dashboard:

```
http://localhost:54323
```

From here you can:
- View and edit database tables
- Test RLS policies
- Manage storage buckets
- View auth users
- Run SQL queries

## Troubleshooting

### Supabase won't start

```bash
# Ensure Docker is running
docker info

# Reset Supabase
supabase stop --no-backup
supabase start
```

### Type generation fails

```bash
# Ensure Supabase is running
supabase status

# Reset and regenerate
supabase db reset
supabase gen types typescript --local > src/types/database.ts
```

### Port conflicts

```bash
# Check what's using port 5173
lsof -i :5173

# Use a different port
npm run dev -- --port 3000
```

## Deployment

### Deploy to Supabase (Production)

1. Create a Supabase project at https://supabase.com

2. Link local project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Push migrations:
   ```bash
   supabase db push
   ```

4. Create storage bucket via Supabase dashboard:
   - Name: `photos`
   - Public: Yes
   - File size limit: 20MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

### Deploy Frontend

Build and deploy to any static hosting (Vercel, Netlify, etc.):

```bash
npm run build
# Output in dist/
```

Set production environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
