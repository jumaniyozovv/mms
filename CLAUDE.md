# MMS Project

## Tech Stack
- Next.js 16 (App Router, standalone output)
- React 19, TypeScript 5
- Tailwind CSS v4, tw-animate-css
- shadcn/ui (radix-ui), lucide-react icons
- TanStack Query v5 (react-query), TanStack Table v8
- React Hook Form + Zod v4 validation
- Prisma 7 with PrismaPg adapter (PostgreSQL)
- Redis (ioredis) for refresh token storage
- JWT (jsonwebtoken) + bcrypt for auth
- Axios with interceptor for auto token refresh
- date-fns, xlsx (export), sonner (toasts)

## Path Alias
`@/*` → `./src/*`

## Project Structure (FIXED — do not reorganize)

```
src/
├── app/
│   ├── (auth)/              # Public auth pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/         # Auth-required pages (wrapped with AuthProvider)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/            # register, login, logout, refresh, me, change-password
│   │   └── users/           # list, route.ts
│   ├── generated/prisma/    # Generated Prisma client (DO NOT edit)
│   ├── layout.tsx
│   └── page.tsx
├── backend/
│   ├── config/              # constants (token expiry, bcrypt rounds)
│   ├── lib/                 # prisma.ts, redis.ts, jwt.ts, password.ts
│   ├── middleware/           # auth.ts (withAuth), roles.ts
│   ├── repositories/        # user.repository.ts, refresh-token.repository.ts
│   ├── services/            # auth.service.ts, user.service.ts
│   ├── types/               # auth.types.ts, user.types.ts, api.types.ts
│   ├── utils/               # api-response.ts
│   └── validators/          # auth.validators.ts
├── components/
│   ├── common/              # app-sidebar, nav-main, nav-user, data-table/
│   └── ui/                  # shadcn components (NEVER move, auto-generated)
├── features/                # Each feature has the SAME structure:
│   ├── auth/
│   │   ├── components/      # login-form, register-form
│   │   ├── hooks/           # use-auth.ts
│   │   ├── schema/          # login.schema.ts, register.schema.ts
│   │   ├── services/        # auth.service.ts (frontend API calls)
│   │   └── types.ts
│   └── users/
│       ├── components/      # users-columns.tsx
│       ├── hooks/
│       ├── schema/
│       ├── services/
│       └── types.ts
├── lib/                     # main-layout.tsx, menu.ts, utils.ts
├── shared/
│   ├── lib/                 # axios.ts (interceptor), cookie.ts
│   └── providers/           # AuthProvider, QueryProvider, ThemeProvider
└── prisma/
    └── schema.prisma
```

## Feature Module Convention
Every feature in `src/features/<name>/` follows:
- `components/` — React components
- `hooks/` — React Query hooks
- `services/` — Axios API calls
- `schema/` — Zod validation schemas
- `types.ts` — TypeScript interfaces
- `utils/` — (optional) helper functions

## Auth Flow
- First registered user becomes ADMIN; subsequent registration is blocked
- Access token: 3min expiry (httpOnly cookie)
- Refresh token: 7 days (httpOnly cookie + stored in Redis)
- Auto-refresh via axios interceptor on 401
- Roles: ADMIN > MANAGER > USER

## Database
- PostgreSQL via Prisma with PrismaPg adapter
- No migrations — uses `prisma db push`
- Scripts: `npm run db:generate`, `npm run db:push`, `npm run db:studio`

## API Response Pattern
All API routes use helpers from `@/backend/utils/api-response`:
- `successResponse(data, status?)`
- `errorResponse(message, status?, errors?)`
- `validationErrorResponse(errors)`

## Important Notes
- `isActive` was removed from User model — do not add it back
- Generated Prisma client lives in `src/app/generated/prisma/` — never edit manually
- If Prisma client is out of sync: `npx prisma db push`
- 500 errors on API often mean PostgreSQL or Redis is down
- Next.js 16 uses "proxy" (renamed from middleware) in next.config.ts
