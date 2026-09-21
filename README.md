# Masterclass

A live, interactive 3D ed-tech site for **MBA & engineering students** — career-clarity
mentorship, live cohorts and self-paced courses to switch roles and companies. Built with
Next.js, React Three Fiber, Supabase auth/DB and Razorpay payments.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** — custom "midnight + violet + gold" design system
- **React Three Fiber / drei** — interactive 3D hero
- **Supabase** — email/password auth + Postgres (`enrollments`)
- **Razorpay** — checkout, order creation and server-side signature verification
- **Vitest + Testing Library** — **100% coverage** enforced on all feature code

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Razorpay keys
npm run dev                  # http://localhost:3000
```

### Environment variables

See `.env.example`. You need a Supabase project (URL + anon key) and Razorpay
test keys. Never commit real secrets.

### Database

Run `supabase/schema.sql` in the Supabase SQL editor to create the `enrollments`
table with row-level security.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm test` | Run the test suite |
| `npm run test:coverage` | Run tests with 100% coverage thresholds |
| `npm run lint` | Lint |

## Testing

Feature logic lives in `lib/` and presentational/interactive components in
`components/`, both covered to 100% (statements, branches, functions, lines).
Thresholds are enforced in `vitest.config.ts`, so a regression in coverage fails
the run (and CI).

## Deploying to Vercel

1. Push to GitHub (done).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the env vars from `.env.example` in **Project Settings → Environment Variables**
   (use Razorpay **live** keys for production, **test** keys for preview).
4. Deploy. Course detail pages are statically generated; API routes and the
   dashboard run on-demand.

Add your deployed URL to Supabase **Auth → URL Configuration** (Site URL +
redirect URLs) and to `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
app/            Routes (landing, courses, live-classes, auth, dashboard, api)
components/     UI + 3D + auth forms (100% tested)
lib/            Domain logic: courses, pricing, validation, razorpay, checkout
supabase/       SQL schema
```

> Prices in `lib/courses.ts` are placeholders (in paise) — update them once
> finalised.
