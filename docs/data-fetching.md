# Data Fetching

## Rule: Server Components Only

ALL data fetching in this app MUST be done via Server Components.

- **Never** fetch data in Client Components (`"use client"`)
- **Never** fetch data via Route Handlers (`route.ts`)
- **Never** use `useEffect` + `fetch` or any client-side data fetching pattern
- **Never** expose API endpoints that return database data

If a Client Component needs data, fetch it in a parent Server Component and pass it down as props.

## Rule: Helper Functions in `/data`

All database queries MUST live in helper functions under the `/data` directory (e.g. `src/data/workouts.ts`). Pages and components must not query the database directly.

```ts
// ✅ Correct — query lives in /data
// src/data/workouts.ts
export async function getWorkoutsForDate(userId: string, date: string) { ... }

// src/app/dashboard/page.tsx
import { getWorkoutsForDate } from "@/data/workouts";
const workouts = await getWorkoutsForDate(userId, date);
```

```ts
// ❌ Wrong — query inside a page/component
// src/app/dashboard/page.tsx
const workouts = await db.select().from(workouts).where(...);
```

## Rule: Drizzle ORM Only — No Raw SQL

All queries inside `/data` helpers MUST use Drizzle ORM. Raw SQL (`db.execute`, template literals, `sql` tag) is forbidden.

```ts
// ✅ Correct
import { eq, and } from "drizzle-orm";
return db.select().from(workouts).where(and(eq(workouts.userId, userId), eq(workouts.date, date)));

// ❌ Wrong
db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
```

## Rule: Users Can Only Access Their Own Data

Every `/data` helper that returns user-owned data MUST scope its query to the authenticated user's ID. This is non-negotiable.

1. Obtain `userId` from Clerk's `auth()` — never trust a userId passed in from the client or from URL params.
2. Always include `eq(table.userId, userId)` in the `where` clause.
3. If `auth()` returns no `userId`, return an empty result or throw — never fall through to an unscoped query.

```ts
// ✅ Correct
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsForDate(date: string) {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));
}

// ❌ Wrong — userId comes from outside, could be forged
export async function getWorkoutsForDate(userId: string, date: string) {
  return db.select().from(workouts).where(eq(workouts.date, date)); // missing userId filter!
}
```

## Summary

| Concern | Rule |
|---|---|
| Where to fetch data | Server Components only |
| Where to write queries | `/data` helper functions only |
| Query style | Drizzle ORM only — no raw SQL |
| Data access scope | Always filtered to the authenticated user via `auth()` |
