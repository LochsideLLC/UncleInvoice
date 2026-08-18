# Uncle Invoice

That invoice, already filled in.

Bookkeepers seed a draft from the books. The contractor opens a magic link, edits if needed, and confirms. The confirmed invoice is emailed to the client and stored as a PDF.

Repo: [LochsideLLC/UncleInvoice](https://github.com/LochsideLLC/UncleInvoice)  
Site: [uncleinvoice.com](https://uncleinvoice.com)

## Local setup (Docker Postgres)

Postgres runs in Docker so the schema matches Supabase. The Next app can run on your machine or in Compose. The database is on **localhost:5433** so it does not collide with other local Postgres containers.

```bash
npm install
npm run db:up
npx prisma migrate dev
npm run db:seed
npm run dev
```

Or the whole stack in Docker:

```bash
npm run stack
```

Open [http://localhost:3000](http://localhost:3000).

Demo bookkeeper:

- Email: `ada@ledgerandco.test`
- Password: `demo1234`
- Client: Sunrise Cleaning Co.

There is no email provider in the default local setup. Review links and invoice emails are written to **Outbox** (`/app/outbox`) so you can copy them. To actually send mail, set `RESEND_API_KEY` in `.env`.

## Stack

- Next.js 16 (App Router)
- React 19
- Prisma + Postgres (Docker locally, Supabase in production)
- Netlify for deploys
- Cloudflare for DNS (`uncleinvoice.com`)

## Moving to the Lochside datastore

Uncle Invoice tables live in the Postgres schema `uncleinvoice`, so they stay out of the other apps in [datastore](https://supabase.com/dashboard/project/pvolllgvujjvteijtnid).

When you have the datastore database password:

1. Set `DATABASE_URL` / `DIRECT_URL` to that project (session pooler + `?sslmode=require`).
2. `npx prisma migrate deploy` — this only creates/updates the `uncleinvoice` schema.
3. `npm run db:seed` if you want demo data.

Do not run migrations against `public`. That schema already holds the other Lochside apps.

## Deploy (Netlify)

1. Import `LochsideLLC/UncleInvoice` in Netlify.
2. Build command and publish directory come from `netlify.toml`.
3. Set environment variables:

```
DATABASE_URL=
APP_URL=https://uncleinvoice.com
SESSION_SECRET=
RESEND_API_KEY=
MAIL_FROM=Uncle Invoice <noreply@uncleinvoice.com>
```

Point `DATABASE_URL` at Supabase when you go live. Migrations live in `prisma/migrations`.

## DNS (Cloudflare → Netlify)

After Netlify assigns the site:

- Apex `uncleinvoice.com`: CNAME flatten to the Netlify hostname (e.g. `something.netlify.app`). Proxy can stay DNS-only (grey cloud) to avoid SSL fights, or Cloudflare SSL mode **Full**.
- `www`: CNAME to the same Netlify hostname.

## CSV import

`contractor_name,contractor_email,date,amount,description`

Each row becomes a contractor (if new) and a draft invoice.
