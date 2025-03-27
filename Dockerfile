FROM node:22-alpine3.21 AS base

RUN npm i -g pnpm 

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${NEXT_PUBLIC_STRIPE_PUBLIC_KEY}

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

ARG NEXT_PUBLIC_ABLY_CLIENT_API_KEY
ENV NEXT_PUBLIC_ABLY_CLIENT_API_KEY=${NEXT_PUBLIC_ABLY_CLIENT_API_KEY}

ARG STRIPE_SECRET_KEY
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine3.21 AS production

WORKDIR /app

COPY --from=base /app/.next/standalone .
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["node", "server.js", "-H", "0.0.0.0"]