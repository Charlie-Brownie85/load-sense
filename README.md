# Load Sense

Small training workload tracker to monitor under/over train status and workout sessions.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** with SQLite

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start development server           |
| `npm run build`    | Build for production                |
| `npm run start`    | Start production server             |
| `npm run lint`     | Run ESLint                          |
| `npm run db:generate` | Generate Prisma client           |
| `npm run db:migrate`  | Run database migrations          |
| `npm run db:push`     | Push schema changes (no migration)|
| `npm run db:studio`   | Open Prisma Studio               |
