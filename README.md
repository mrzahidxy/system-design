# System Design Template

## System design workflow

Use `main` as the baseline template for every topic. Create a new branch per topic and keep changes isolated.

### Create a topic branch

```bash
git checkout -b topic/<name>
```

### Recommended structure per topic

- `notes/README.md` for problem statement and requirements
- `notes/decisions.md` for tradeoffs
- `notes/assumptions.md` for constraints and risks
- `diagrams/` for architecture images

### Template files

See `TEMPLATE.md` for a quick-start outline you can copy into `notes/README.md`.

## Prereqs

- Node.js 18+
- Docker (for Postgres)

## Postgres (Docker)

```bash
docker run --name system-design-postgres \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=appdb \
  -p 9090:5432 \
  -d postgres:16
```

Set `.env`:

```
DATABASE_URL="postgresql://app:app@localhost:9090/appdb?schema=public"
```

## Prisma setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

## Run the API

```bash
npm run dev
```

## Build and run

```bash
npm run build
npm start
```

## REST client

Open `rest-client.http` in a REST client (VS Code REST Client, IntelliJ HTTP client, etc.) and run the requests.

## Sample data

Seed data lives in `prisma/seed.ts`. Edit the carrier routes there to match each topic.
