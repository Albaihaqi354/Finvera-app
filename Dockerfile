# Stage 1: Install dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Stage 2: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# NEXT_PUBLIC_* vars are inlined at build time by Next.js.
# For Docker, we use a placeholder here and override at runtime via env.
# See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Minimal production runner using Next.js standalone output
# Standalone bundles only the required server files — no full node_modules copy.
# Image size drops from ~1 GB to ~200 MB.
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone server bundle
COPY --from=builder /app/.next/standalone ./
# Copy static assets (CSS, JS chunks, images)
COPY --from=builder /app/.next/static ./.next/static
# Copy public folder (favicon, icons, etc.)
COPY --from=builder /app/public ./public

EXPOSE 3000

# Standalone output uses server.js instead of npm start
CMD ["node", "server.js"]
