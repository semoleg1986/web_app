FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get upgrade -y \
  && rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.output /app/.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
