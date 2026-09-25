A slate.
 SOME DETAILS -

## Overview

This is a Next.js 16 full-stack starter for building a frontend on top of a small, typed backend. The project currently includes a minimal task API backed by SQLite and Prisma. Authentication, authorization, and application-specific domain logic are not included yet.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript in strict mode
- Tailwind CSS 4 and shadcn/ui components
- Prisma 7 with SQLite through the libSQL adapter
- Zod validation for API input
- ESLint and Prettier

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Local Setup

```powershell
npm install
Copy-Item .env.example .env
npm run migrate
npm run dev
```

Open `http://localhost:3000` after the dev server starts. The default local database is `prisma/dev.db` and is created by `npm run migrate`.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint:check` | Generate route types, run TypeScript, and run ESLint |
| `npm run build` | Generate Prisma and create a production build |
| `npm run start` | Start the production build |
| `npm run migrate` | Apply database migrations and generate Prisma Client |
| `npm run studio` | Open Prisma Studio without launching a browser |

## Backend API

All API routes are under `src/app/api` and return JSON.

| Method | Endpoint | Body or query | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | None | Returns the server health status |
| `GET` | `/api/tasks` | `completed=true\|false`, `limit=1..100` | Lists tasks |
| `POST` | `/api/tasks` | `{ "title": "Ship feature" }` | Creates a task |
| `GET` | `/api/tasks/:id` | None | Gets one task |
| `PATCH` | `/api/tasks/:id` | `{ "title": "...", "completed": true }` | Updates a task |
| `DELETE` | `/api/tasks/:id` | None | Deletes a task |

Example request:

```powershell
Invoke-RestMethod http://localhost:3000/api/tasks -Method Post `
	-ContentType "application/json" `
	-Body '{"title":"Build the first screen"}'
```

Task titles are required and must be between 1 and 200 characters. Invalid input returns HTTP `400`. Missing task IDs return HTTP `404`.

## Project Layout

```text
src/app/                 Next.js routes and pages
src/app/api/             Backend route handlers
src/components/          Reusable UI components
src/lib/dbClient/        Prisma client singleton
src/lib/env/             Validated server and client environment variables
prisma/schema.prisma     Database schema
prisma/migrations/       Database migration history
public/                  Static assets
```

## Adding Backend Features

1. Add or update models in `prisma/schema.prisma`.
2. Run `npm run migrate` and give the migration a descriptive name.
3. Add route handlers under `src/app/api`.
4. Validate request bodies and query parameters with Zod.
5. Run `npm run lint:check` before handing the work off.

The Prisma client is imported from `@/lib/dbClient/prisma`. Environment variables are validated in `src/lib/env/serverEnv.ts`.
