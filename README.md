# LoadSense

LoadSense is a single-page training load monitoring dashboard built around the **ACWR (Acute:Chronic Workload Ratio)** methodology. It helps athletes and coaches track workout sessions, detect over/under-training trends, and make informed decisions about training intensity and recovery.

The app displays a week-by-week timeline of sessions, computes acute (7-day) and chronic (28-day) workload averages, and surfaces the current ACWR ratio with a clear visual gauge so you always know whether you're in the optimal training zone, under-loading, or pushing toward injury risk.

This is an **AI-first, code-generated project** built entirely with [Cursor](https://cursor.com) following a **Spec-Driven Development** workflow. Every feature starts as a structured specification (proposal, design, delta specs, tasks) before any code is written, and AI agents handle implementation guided by those specs and the project's architecture rules.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** (strict mode)
- **React 19**
- **Tailwind CSS v4** (theme tokens in `globals.css`, no config file)
- **Prisma 7** with libSQL / SQLite
- **Vitest** + React Testing Library for tests
- **Feature-Sliced Design (FSD)** architecture

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional — loads sample data)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

The codebase follows **Feature-Sliced Design** with layers that enforce a strict import hierarchy:

```
src/
├── app/          # Next.js routing, layouts, API handlers
├── views/        # Full-page compositions (FSD "pages" layer)
├── widgets/      # Composite UI blocks
├── features/     # User-facing interactions
├── entities/     # Domain models and entity-scoped UI
└── shared/       # Pure utilities, UI primitives, types
```

Each layer can only import from layers below it. See [`AGENTS.md`](./AGENTS.md) for full architecture guidelines.

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Build for production                |
| `npm run start`      | Start production server             |
| `npm run lint`       | Run ESLint                          |
| `npm run test`       | Run tests in watch mode             |
| `npm run test:ci`    | Run tests once (CI)                 |
| `npm run db:generate`| Generate Prisma client              |
| `npm run db:migrate` | Run database migrations             |
| `npm run db:push`    | Push schema changes (no migration)  |
| `npm run db:studio`  | Open Prisma Studio                  |
| `npm run db:seed`    | Seed database with sample data      |

## Roadmap

Planned features and future development directions are tracked in [`docs/ROADMAP.md`](./docs/ROADMAP.md).
