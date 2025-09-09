# Public Git repo — template with source, README, schema.prisma, and seed

This document contains a ready-to-publish repository layout (files & content) you can copy into a new public Git repo. It includes:

* `README.md` (installation, run, migration, seed, publish steps)
* `schema.prisma` (example schema)
* `prisma/seed.ts` (seed script and any seed changes)
* Example server source (simple Node + Express + Prisma) and package.json
* Notes on trade-offs and design decisions

---

## Repository structure

```
my-app/
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── server.ts
│   ├── routes/
│   │   └── users.ts
│   └── db.ts
└── .github/
    └── WORKFLOWS.md
```

---

## README.md (ready-to-publish)

````md
# My App (example)

A minimal Node/TypeScript/Prisma example app with schema and seed. Intended as a template you can publish as a public Git repository. Includes trade-off notes.

## What is included

- Prisma schema (`prisma/schema.prisma`) with `User` and `Post` models
- A small Express server that exposes basic CRUD for `User`
- `prisma/seed.ts` script to populate initial data
- Instructions to run locally, migrate, seed, and publish on GitHub

## Quick start

1. Clone this repo

```bash
git clone <repo-url>
cd my-app
````

2. Install

```bash
npm install
```

3. Create `.env` (example)

```
DATABASE_URL="file:./dev.db"
```

4. Run Prisma migrate and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

> If using SQLite with `DATABASE_URL="file:./dev.db"` the `migrate dev` step will create `dev.db`.

5. Start the server

```bash
npm run dev
# or build + run
npm run build
npm start
```

6. API endpoints

* `GET /users` — list users
* `GET /users/:id` — get user
* `POST /users` — create user

## How to publish

1. Make repository public on GitHub (or push to an existing public repo)
2. `git push` to `origin main`
3. Add a license file if needed (MIT suggested for example projects)

## Files to review before publishing

* Remove any secrets from `.env`
* Replace example `DATABASE_URL` with production DB URL when deploying

## Notes on trade-offs (short)

See the `TRADEOFFS.md` section in this repo for decisions and alternatives.

```
```

---

## schema.prisma (place under `prisma/schema.prisma`)

```prisma
// Prisma schema for a small example app
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Notes:

* `uuid()` keys are used for safer public repos and easier merging across environments (vs. integer autoincrement). If you prefer smaller keys or a performant DB with integer PKs, change to `Int @id @default(autoincrement())`.

---

## prisma/seed.ts (seed changes)

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // idempotent-ish seeding: use upsert to avoid duplicates when seed is re-run
  await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: [
          { title: 'Hello World', content: 'First post', published: true },
        ],
      },
    },
  })

  await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', name: 'Bob' },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add this line to `package.json` so `npx prisma db seed` can run the script:

```json
"prisma": {
  "seed": "ts-node --transpile-only prisma/seed.ts"
}
```

(If you prefer JavaScript, compile the `seed.ts` to `seed.js` or write a plain `seed.js`.)

---

## Example source files

### package.json

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  },
  "prisma": {
    "seed": "ts-node --transpile-only prisma/seed.ts"
  }
}
```

### src/db.ts

```ts
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
```

### src/routes/users.ts

```ts
import { Router } from 'express'
import { prisma } from '../db'
const router = Router()

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({ where: { id }, include: { posts: true } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

router.post('/', async (req, res) => {
  const { email, name } = req.body
  try {
    const user = await prisma.user.create({ data: { email, name } })
    res.status(201).json(user)
  } catch (e) {
    res.status(400).json({ error: (e as Error).message })
  }
})

export default router
```

### src/server.ts

```ts
import express from 'express'
import users from './routes/users'

const app = express()
app.use(express.json())
app.use('/users', users)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server listening on ${port}`))
```

---

## .gitignore (suggested)

```
node_modules/
.env
dev.db
dist/
coverage/
```

---

## Trade-offs & design notes (detailed)

### 1) Database: SQLite (dev) vs Postgres (prod)

* **Why SQLite as default?**

  * Zero-config, easy for reviewers to run (`DATABASE_URL="file:./dev.db"`). Good for template/public repos.
* **Trade-off:** SQLite lacks advanced concurrency and some SQL features. For production use, prefer PostgreSQL or MySQL.

### 2) Primary keys: UUID vs autoincrement Int

* **UUID** chosen here for nicer merging across distributed systems and to avoid leaking row counts.
* **Trade-off:** UUIDs are larger and can be slightly slower; autoincrement ints are smaller and faster for some indexes.

### 3) Seeding approach

* Use `upsert` to make seed idempotent (safe to run multiple times). This is convenient for CI and local dev.
* **Trade-off:** Upserts can mask problems if seed and migrations diverge — sometimes you want seed to fail loudly.

### 4) Prisma for ORM

* Prisma offers great developer DX and type-safe client.
* **Trade-off:** Adds a layer of abstraction. Raw SQL or an alternative ORM (TypeORM, Objection.js) may be needed for complex queries.

### 5) API Server: Express + TypeScript

* Simple and familiar stack for small examples and templates.
* **Trade-off:** For larger projects consider NestJS, Fastify, or a serverless approach for performance and structure.

### 6) Tests & CI omitted

* For brevity tests are not included. For production-ready repos include unit/integration tests and a GitHub Actions workflow.

### 7) Migrations

* Use `prisma migrate dev` in dev. For production run `prisma migrate deploy` as part of CI/CD.

### 8) Soft Deletes

* Not implemented here. If you need audit/history, add `deletedAt DateTime?` and filter queries accordingly.

---

## How to push this as a public repo quickly

1. Create repo on GitHub (public)
2. Initialize local git and push

```bash
git init
git add .
git commit -m "Initial commit — prisma template"
git branch -M main
git remote add origin git@github.com:<your-username>/<repo>.git
git push -u origin main
```
