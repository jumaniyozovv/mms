# MMS - Management System

A full-stack employee management system built with Next.js, featuring day-off tracking, user management, and role-based access control.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, standalone output)
- **Language:** TypeScript 5, React 19
- **Styling:** Tailwind CSS v4, shadcn/ui (radix-ui), lucide-react
- **State & Data:** TanStack Query v5, TanStack Table v8
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts, FullCalendar
- **Database:** PostgreSQL via Prisma 7 (PrismaPg adapter)
- **Cache:** Redis (ioredis) for refresh token storage
- **Auth:** JWT + bcrypt, httpOnly cookies, auto-refresh via axios interceptor
- **Export:** XLSX/CSV via xlsx
- **Containerization:** Docker + Docker Compose

## Features

### Authentication & Authorization
- JWT-based auth with access token (3 min) and refresh token (7 days)
- Auto token refresh via axios interceptor on 401
- Role-based access: **ADMIN** > **MANAGER** > **USER**
- First registered user becomes ADMIN; subsequent registration is blocked

### User Management
- CRUD operations for users (admin only)
- Per-user day-off limits (paid, sick, personal)
- User listing with search, pagination, and XLSX/CSV export

### Day-Off Management
- Request day-offs with type selection (paid, sick, personal)
- Calendar view with FullCalendar integration
- Approval workflow (pending / approved / rejected)
- Holiday-aware day counting (holidays excluded from limits)
- My Requests page for tracking personal submissions

### Day-Off Reports
- **Balance Report** — radial charts + table showing used vs. total days per type
- **Detailed Report** — full day-off history with usage chart
- **Monthly Report** — calendar-based monthly view
- **Total Report** — aggregated statistics
- Role-based filtering: admins see all users, regular users see only their own data

### Day-Off Settings (Admin)
- Configure default day-off limits (paid, sick, personal)
- Update individual user limits
- Holiday management (CRUD)

### Dashboard
- Overview statistics (users, day-offs, pending requests)
- Pending day-off list with approve/reject actions (admin)

### Settings
- Change password
- Theme toggle (light/dark mode)

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Public pages (login, register)
│   ├── (protected)/            # Auth-required pages
│   │   ├── dashboard/          # Overview & stats
│   │   ├── users/              # User management
│   │   ├── settings/           # User settings
│   │   └── day-off/            # Day-off module
│   │       ├── dashboard/      # Day-off calendar & pending list
│   │       ├── my-requests/    # Personal day-off requests
│   │       ├── reports/        # Balance, detailed, monthly, total
│   │       └── settings/       # Limits config & holidays
│   └── api/                    # API routes
│       ├── auth/               # login, register, logout, refresh, me, change-password
│       ├── dashboard/          # stats
│       ├── day-off/            # CRUD, list, usage, balance, reports
│       ├── holidays/           # CRUD, in-range
│       └── users/              # CRUD, list
├── backend/                    # Server-side logic
│   ├── config/                 # Constants (token expiry, bcrypt rounds)
│   ├── lib/                    # Prisma, Redis, JWT, password utils
│   ├── middleware/             # Auth (withAuth), role checks
│   ├── repositories/           # Data access layer
│   ├── services/               # Business logic
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # API response helpers
│   └── validators/             # Zod schemas
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   └── common/                 # App-level shared components (sidebar, data-table)
├── features/                   # Feature modules
│   ├── auth/                   # Login & register
│   ├── users/                  # User management
│   └── day-off/                # Day-off (dashboard, reports, settings, my-requests)
├── shared/
│   ├── lib/                    # Axios instance, cookie helpers
│   └── providers/              # AuthProvider, QueryProvider, ThemeProvider
├── hooks/                      # Global hooks
├── lib/                        # Utils (cn), layout, menu config
└── prisma/schema.prisma        # Database schema
```

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 16+
- Redis 7+

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd mms
pnpm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mms"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### 3. Set up the database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Register the first user to become ADMIN.

## Docker

Run the entire stack with Docker Compose:

```bash
docker compose up --build
```

This starts:
- **app** — Next.js on port 3000
- **db** — PostgreSQL 16 on port 5432
- **redis** — Redis 7 on port 6379

## Database Commands

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema changes to database
pnpm db:studio      # Open Prisma Studio GUI
```

## API Response Format

All API routes return consistent responses:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```
