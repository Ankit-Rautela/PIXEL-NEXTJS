# Public Git repo — template with source, README, schema.prisma, and seed

This document contains a ready-to-publish repository layout (files & content) you can copy into a new public Git repo. It includes:

* `README.md` (installation, run, migration, seed, publish steps)
* `schema.prisma` (example schema)
* `prisma/seed.ts` (seed script and any seed changes)
* Example server source (simple Node + Express + Prisma) and package.json

---

## Repository structure

```
app/
  api/
    auth/[...nextauth]/route.ts
    health/route.ts
    orders/
      route.ts
      [id]/route.ts
  login/page.tsx
  orders/
    [id]/page.tsx
    new/page.tsx
  layout.tsx
  page.tsx
  globals.css

components/
  SignOut.tsx

lib/
  auth.ts
  orderSchema.ts
  prisma.ts

prisma/
  migrations/
  schema.prisma
  seed.ts
  dev.db

```

---

## README.md (ready-to-publish)

````md
# My App (example)

A minimal Node/TypeScript/Prisma example app with schema and seed. Intended as a template you can publish as a public Git repository.

## What is included

- Prisma schema (`prisma/schema.prisma`) with `User` and `Post` models
- A small Express server that exposes basic CRUD for `Order`
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

* `GET /orders/login`
* `GET /orders`
* `GET /orders/new`
* `GET /orders/:id`

## How to publish

1. Make repository public on GitHub (or push to an existing public repo)
2. `git push` to `origin main`
3. Add a license file if needed (MIT suggested for example projects)

## Files to review before publishing

* Remove any secrets from `.env`
* Replace example `DATABASE_URL` with production DB URL when deploying

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

---

## prisma/seed.ts (seed changes)

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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

### src/routes/orders.ts

```ts
import { Router } from 'express'
import { prisma } from '../db'
const router = Router()

router.get('/login', async (req, res) => {
  res.json({ message: 'Login endpoint placeholder' })
})

router.get('/', async (req, res) => {
  const orders = await prisma.post.findMany()
  res.json(orders)
})

router.get('/new', async (req, res) => {
  res.json({ message: 'Create new order endpoint placeholder' })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const order = await prisma.post.findUnique({ where: { id } })
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})

export default router
```

### src/server.ts

```ts
import express from 'express'
import orders from './routes/orders'

const app = express()
app.use(express.json())
app.use('/orders', orders)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server listening on ${port}`))
```

---
