# LEVEL UP — Evolução Pessoal

Personal evolution platform focused on fitness, studies, nutrition and discipline through gamification.

## Stack

React, TypeScript, Express, tRPC, Drizzle and MySQL-compatible managed database.

## Commands

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations.
- `pnpm db:push`: generate and apply schema changes.
- `pnpm check`: run TypeScript validation.

## Product

LEVEL UP turns daily missions, training, cardio, nutrition, study and discipline into a personal progression system with XP, levels, streaks and rewards. The app uses Manus OAuth for authentication, persists the core gamification engine per user, and provides server-side LEVEL AI guidance.

The application also includes separate routes for missions, workouts, cardio, nutrition, studies, evolution, rewards and profile. Local activity records are namespaced by the authenticated user in the browser while core XP, missions and streak data use the managed database.

Private credentials stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.
