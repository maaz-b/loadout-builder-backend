# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Final image ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app/node_modules \
    && chown -R appuser:appgroup /app
    
USER appuser

EXPOSE 3000

# Optional but good practice
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --spider -q http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]