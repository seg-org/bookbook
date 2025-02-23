#!/bin/bash

cp .env.e2e .env

docker compose -f docker-compose.e2e.yaml up -d

# Wait 5 Seconds
sleep 5

docker exec e2e_s3 mc alias set e2e http://localhost:9000 admin password
docker exec e2e_s3 mc mb e2e/bookbook
docker exec e2e_s3 mc anonymous set public e2e/bookbook

pnpm prisma migrate deploy
pnpm prisma db seed
