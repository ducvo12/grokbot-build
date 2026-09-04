import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { seedIfEmpty } from "@/lib/db/seed";

const dbPath = path.join(process.cwd(), "data", "folio.db");

function createDatabase() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      job_title TEXT NOT NULL,
      company_logo_url TEXT,
      location TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      job_url TEXT,
      applied_at TEXT,
      status TEXT NOT NULL,
      notes TEXT,
      source TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_events (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
    CREATE INDEX IF NOT EXISTS applications_created_idx ON applications(created_at);
    CREATE INDEX IF NOT EXISTS status_events_changed_idx ON status_events(changed_at);
  `);

  const db = drizzle(sqlite, { schema });
  seedIfEmpty(db);
  return db;
}

const globalForDb = globalThis as unknown as {
  folioDb?: ReturnType<typeof createDatabase>;
};

export const db = globalForDb.folioDb ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDb.folioDb = db;
}
