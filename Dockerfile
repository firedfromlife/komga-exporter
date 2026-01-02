# Build stage
FROM denoland/deno:alpine AS builder
WORKDIR /app
COPY . .
RUN deno install --entrypoint main.ts
# Production stage
FROM denoland/deno:alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["deno","run","--allow-read","--allow-env","--allow-net","main.ts"]