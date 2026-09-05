"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { applications, statusEvents, type Application } from "@/lib/db/schema";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/lib/validations/application";
import type { Status } from "@/lib/constants";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function refresh() {
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath("/applications");
}

function nowIso() {
  return new Date().toISOString();
}

export async function createApplication(
  input: ApplicationInput,
): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  const data = parsed.data;

  try {
    db.insert(applications)
      .values({
        id,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        companyLogoUrl: data.companyLogoUrl ?? null,
        location: data.location ?? null,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        jobUrl: data.jobUrl ?? null,
        appliedAt: data.appliedAt ?? null,
        interviewAt: data.interviewAt ?? null,
        status: data.status,
        notes: data.notes ?? null,
        source: data.source ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();

    db.insert(statusEvents)
      .values({
        id: crypto.randomUUID(),
        applicationId: id,
        fromStatus: null,
        toStatus: data.status,
        changedAt: timestamp,
      })
      .run();
  } catch {
    return { ok: false, error: "Could not save that role. Try again." };
  }

  refresh();
  return { ok: true, id };
}

export async function updateApplication(
  id: string,
  input: ApplicationInput,
): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = db.select().from(applications).where(eq(applications.id, id)).get();
  if (!existing) {
    return { ok: false, error: "That application is no longer in the folio." };
  }

  const data = parsed.data;
  const timestamp = nowIso();

  try {
    db.update(applications)
      .set({
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        companyLogoUrl: data.companyLogoUrl ?? null,
        location: data.location ?? null,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        jobUrl: data.jobUrl ?? null,
        appliedAt: data.appliedAt ?? null,
        interviewAt: data.interviewAt ?? null,
        status: data.status,
        notes: data.notes ?? null,
        source: data.source ?? null,
        updatedAt: timestamp,
      })
      .where(eq(applications.id, id))
      .run();

    if (existing.status !== data.status) {
      db.insert(statusEvents)
        .values({
          id: crypto.randomUUID(),
          applicationId: id,
          fromStatus: existing.status,
          toStatus: data.status,
          changedAt: timestamp,
        })
        .run();
    }
  } catch {
    return { ok: false, error: "The update did not land. Try again." };
  }

  refresh();
  return { ok: true, id };
}

export async function updateApplicationStatus(id: string, status: Status): Promise<ActionResult> {
  const existing = db.select().from(applications).where(eq(applications.id, id)).get();
  if (!existing) {
    return { ok: false, error: "That card is gone." };
  }
  if (existing.status === status) {
    return { ok: true, id };
  }

  const timestamp = nowIso();
  try {
    db.update(applications)
      .set({ status, updatedAt: timestamp })
      .where(eq(applications.id, id))
      .run();
    db.insert(statusEvents)
      .values({
        id: crypto.randomUUID(),
        applicationId: id,
        fromStatus: existing.status,
        toStatus: status,
        changedAt: timestamp,
      })
      .run();
  } catch {
    return { ok: false, error: "Could not move that card." };
  }

  refresh();
  return { ok: true, id };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const existing = db.select().from(applications).where(eq(applications.id, id)).get();
  if (!existing) {
    return { ok: false, error: "Already removed." };
  }

  try {
    db.delete(statusEvents).where(eq(statusEvents.applicationId, id)).run();
    db.delete(applications).where(eq(applications.id, id)).run();
  } catch {
    return { ok: false, error: "Could not tear out that page." };
  }

  refresh();
  return { ok: true, id };
}

export async function restoreApplication(row: Application): Promise<ActionResult> {
  const existing = db.select().from(applications).where(eq(applications.id, row.id)).get();
  if (existing) {
    return { ok: true, id: row.id };
  }

  try {
    db.insert(applications)
      .values({
        id: row.id,
        companyName: row.companyName,
        jobTitle: row.jobTitle,
        companyLogoUrl: row.companyLogoUrl,
        location: row.location,
        salaryMin: row.salaryMin,
        salaryMax: row.salaryMax,
        jobUrl: row.jobUrl,
        appliedAt: row.appliedAt,
        interviewAt: row.interviewAt,
        status: row.status,
        notes: row.notes,
        source: row.source,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })
      .run();

    db.insert(statusEvents)
      .values({
        id: crypto.randomUUID(),
        applicationId: row.id,
        fromStatus: null,
        toStatus: row.status,
        changedAt: nowIso(),
      })
      .run();
  } catch {
    return { ok: false, error: "Could not put that leaf back." };
  }

  refresh();
  return { ok: true, id: row.id };
}
