# Folio

A private journal for the job search. Track roles from the shelf to an offer, with a desk you can rearrange and a ledger you can search.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first boot creates `data/folio.db` and presses eighteen example roles into the folio.

```bash
npm run db:seed
```

Resets the database to those example roles.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, SQLite, Drizzle ORM. Mutations go through Server Actions. The interface is custom; Radix is used only for dialogs and focus.
