# configuring base stage for pnpm 

# --- Stage 1: Base ---
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


# # --- Stage 2: Production Dependencies --- 
# FROM base AS prod-deps
# COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
# # Cache the pnpm store across builds and install production-only dependencies
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
#   pnpm install --prod --frozen-lockfile
#
# --- Stage 2: Build ---
FROM base AS build
ARG VITE_API_URL
ARG VITE_API_KEY
ENV VITE_API_URL=$VITE_API_URL \ VITE_API_KEY=$VITE_API_KEY
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
# Install ALL dependencies (including devDependencies needed for compiling/building)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile
# Copy the rest of the application source code
COPY . .
# Run your build step (e.g., Next.js, Vite, NestJS build)
RUN pnpm run build


FROM alpine:3.20

COPY --from=build /app/dist /output

# # --- Stage 4: Production Runtime ---
# FROM base AS runtime
# # Copy production dependencies from Stage 2
# COPY --from=prod-deps /app/node_modules /app/node_modules
# # Copy compiled assets/dist files from Stage 3
# COPY --from=build /app/dist /app/dist
# # If you need package.json scripts at runtime, copy it over too
# COPY package.json ./
#

