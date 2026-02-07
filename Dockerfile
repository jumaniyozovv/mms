# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build Next.js (dummy DB URL for build, real one used at runtime)
ENV DATABASE_URL="postgresql://nodir:nodir@db:5432/mms"
RUN pnpm build

# Compile custom server to a single JS file for production
# Bundles server.ts + all @/ imports, externalizes node_modules packages
RUN npx esbuild server.ts \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=cjs \
  --outfile=.next/standalone/custom-server.js \
  --external:next \
  --external:socket.io \
  --external:ua-parser-js \
  --external:ioredis \
  --external:pg \
  --external:cookie \
  --external:jsonwebtoken \
  --external:@prisma/client \
  --external:@prisma/adapter-pg \
  --alias:@/backend=./src/backend \
  --alias:@/app=./src/app

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install prisma CLI for migrations and fix permissions
RUN pnpm add -g prisma && chown -R nextjs:nodejs /pnpm

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma schema for migrations
COPY --from=builder /app/src/prisma ./prisma
COPY --chown=nextjs:nodejs start.sh ./
RUN chmod +x start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
