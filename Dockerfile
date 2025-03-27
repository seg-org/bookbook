FROM node:22-alpine3.21 AS base

RUN npm i -g pnpm 

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}

ARG DIRECT_URL
ENV DIRECT_URL=${DIRECT_URL}

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ARG AWS_REGION
ENV AWS_REGION=${AWS_REGION}

ARG AWS_BUCKET_NAME
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME}

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG HF_API_KEY
ENV HF_API_KEY=${HF_API_KEY}

ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${NEXT_PUBLIC_STRIPE_PUBLIC_KEY}

ARG STRIPE_SECRET_KEY
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

ARG ABLY_SERVER_API_KEY
ENV ABLY_SERVER_API_KEY=${ABLY_SERVER_API_KEY}

ARG NEXT_PUBLIC_ABLY_CLIENT_API_KEY
ENV NEXT_PUBLIC_ABLY_CLIENT_API_KEY=${NEXT_PUBLIC_ABLY_CLIENT_API_KEY}

COPY package.json pnpm-lock.yaml ./
# ignore postinstall (prisma)
RUN pnpm install --frozen-lockfile  --ignore-scripts

COPY . .

RUN pnpm build

FROM node:22-alpine3.21 AS production

WORKDIR /app

COPY --from=base /app/.next/standalone .
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]