// app/docs/page.tsx
export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl card space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Full-Stack Code Test — Next.js</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Implement the missing features for a small “Work Orders” app. Keep it simple, secure, and tidy.
        </p>
      </header>

      {/* What’s already wired */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Already provided in this starter</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Next.js (App Router) + TypeScript, Node 20+.</li>
          <li>Tailwind v4 via <code>@tailwindcss/postcss</code> and <code>@import "tailwindcss"</code> in <code>app/globals.css</code>.</li>
          <li>Auth: NextAuth (Credentials + JWT), sign-in at <code>/login</code>, middleware protects <code>/orders/*</code>.</li>
          <li>DB: Prisma + SQLite. Models: <code>User</code>, <code>WorkOrder</code> (string fields for role/priority/status).</li>
          <li>Seed script via <code>tsx</code>; test accounts: <code>manager@example.com</code> / <code>Password123!</code>, <code>user@example.com</code> / <code>Password123!</code>.</li>
          <li>Scaffolded pages: <code>/login</code>, <code>/orders</code> (placeholder), <code>/docs</code> (this brief).</li>
        </ul>
      </section>

      {/* What you need to build */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your tasks</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Orders list — <code>/orders</code></strong><br />
            Server-side pagination (10/page), text search across title & description, filter by
            <code> status</code> and <code>priority</code>, sorted newest first. Scope results by role:
            <em> user → own orders; manager → all.</em>
          </li>
          <li>
            <strong>Create order — <code>/orders/new</code></strong><br />
            Form with Zod server validation; create via server action or route handler; set
            <code> createdById</code> from session; default <code>status="open"</code>. Revalidate list after create.
          </li>
          <li>
            <strong>Order detail — <code>/orders/[id]</code></strong><br />
            Fetch by id with access control. Inline edits for title, description, priority.
            Managers can also set <code>status</code> and <code>assignedTo</code>. Use optimistic UI or revalidation.
          </li>
          <li>
            <strong>Authorization</strong><br />
            Enforce on the server for all reads/writes (don’t rely on client checks).
          </li>
          <li>
            <strong>States & polish</strong><br />
            Visible empty/error states; basic loading where it helps (Suspense is fine). Keep UI minimal but neat.
          </li>
        </ol>
      </section>

      {/* Implementation notes */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Implementation notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use Prisma for all data access. Compose one query for list + filters + search + pagination.</li>
          <li>Validate inputs with Zod at the server boundary; return appropriate HTTP codes/messages.</li>
          <li>Prefer server actions; route handlers are fine if you prefer explicit APIs.</li>
          <li>Keep component structure simple; avoid <code>any</code>; no need for extra UI libs.</li>
        </ul>
      </section>

      {/* Stretch */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Stretch (optional)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Single image upload per order (store locally; preview on detail page).</li>
          <li>Activity log (who changed what) rendered as a timeline.</li>
          <li>Basic role management (promote/demote) for managers.</li>
          <li>Simple rate limiting on create/update.</li>
          <li>Playwright tests for login + CRUD happy paths.</li>
          <li>Dockerfile to run locally with one command.</li>
        </ul>
      </section>

      {/* Acceptance */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Acceptance criteria</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sign in works with seeded accounts.</li>
          <li>User can create, list (own only), and edit their orders.</li>
          <li>Manager can view all, assign <code>assignedTo</code>, and change <code>status</code>.</li>
          <li>List supports search, filters, and server-side pagination.</li>
          <li>Server validates inputs and returns useful errors.</li>
          <li>Clear loading/empty/error states are visible.</li>
        </ul>
      </section>

      {/* What we evaluate */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What we evaluate</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sound use of App Router patterns and data fetching.</li>
          <li>Correct, server-enforced auth & authorization.</li>
          <li>Clean Prisma usage and query composition.</li>
          <li>Validation and defensive coding at boundaries.</li>
          <li>Readable structure and sensible abstractions.</li>
          <li>Thoughtful UX for loading/empty/error states.</li>
          <li>README clarity and local run instructions.</li>
        </ul>
      </section>

      {/* Submission */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Submission</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Public Git repo with source, updated <strong>README.md</strong>, and notes on trade-offs.</li>
          <li>Include <code>schema.prisma</code> and your seed changes (if any).</li>
          <li>If you add tests or Docker, include run instructions.</li>
        </ul>
        <p className="text-xs text-zinc-500">
          Time guidance: 3–5 hours. It’s fine to leave TODOs explaining next steps.
        </p>
      </section>
    </div>
  );
}
