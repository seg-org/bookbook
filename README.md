# BookBook

online book store.

## Stack

- nextjs
- typescript
- tailwindcss
- (what should we use for state management? React Context?)

## Prerequisites

Download these tools before you start working on the project.

- node.js 22 or later
- pnpm 9.5.0 or later
- Prettier VSCode extension (also set format on save)
- Docker (if you want to run the database locally)

## Setup

1. Clone the repository
2. Run `pnpm install`
3. Copy `.env.template` file in root of the project as `.env` into the root of the project fill in the values (in discord).
4. If you want to use local databse, run `docker-compose up` to start it (you need to have Docker Desktop running, and you can use the default values in `.env.template` for the database connection)
5. Run `npx prisma migrate deploy` to create tables in the database
6. Run `npx prisma generate` to generate the Prisma client
7. Run `npx prisma db seed` to seed the database
8. Run `pnpm dev` to start the application
