import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { STATUSES, type Status } from "@/lib/constants";

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  companyLogoUrl: text("company_logo_url"),
  location: text("location"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  jobUrl: text("job_url"),
  appliedAt: text("applied_at"),
  interviewAt: text("interview_at"),
  status: text("status", { enum: STATUSES }).$type<Status>().notNull(),
  notes: text("notes"),
  source: text("source"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const statusEvents = sqliteTable("status_events", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  fromStatus: text("from_status").$type<Status | null>(),
  toStatus: text("to_status").$type<Status>().notNull(),
  changedAt: text("changed_at").notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type StatusEvent = typeof statusEvents.$inferSelect;
