FROM node:23.11-bookworm AS builder

WORKDIR /app

COPY package.json package-lock.json ./
ENV NODE_ENV=development
RUN npm i
RUN npm install @tailwindcss/oxide-linux-x64-gnu
RUN npm install lightningcss

COPY . .
ENV NODE_ENV=production

RUN npm run build

# Production stage
FROM node:18-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public


ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]