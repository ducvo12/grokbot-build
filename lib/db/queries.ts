import { and, asc, desc, eq, like, or } from "drizzle-orm";
import { eachWeekOfInterval, formatISO, parseISO, startOfWeek, subWeeks } from "date-fns";
import { db } from "@/lib/db";
import { applications, statusEvents, type Application } from "@/lib/db/schema";
import { STATUSES, type Status } from "@/lib/constants";
import { isInCurrentMonth } from "@/lib/format";

export type ApplicationSort = "updated" | "company" | "applied" | "salary";

export type ApplicationFilters = {
  query?: string;
  status?: Status | "all";
  sort?: ApplicationSort;
};

export function listApplications(filters: ApplicationFilters = {}) {
  const clauses = [];
  const q = filters.query?.trim();
  if (q) {
    const fuzzy = `%${q}%`;
    clauses.push(
      or(
        like(applications.companyName, fuzzy),
        like(applications.jobTitle, fuzzy),
        like(applications.location, fuzzy),
      ),
    );
  }
  if (filters.status && filters.status !== "all") {
    clauses.push(eq(applications.status, filters.status));
  }

  const order = (() => {
    switch (filters.sort) {
      case "company":
        return asc(applications.companyName);
      case "applied":
        return desc(applications.appliedAt);
      case "salary":
        return desc(applications.salaryMax);
      default:
        return desc(applications.updatedAt);
    }
  })();

  return db
    .select()
    .from(applications)
    .where(clauses.length ? and(...clauses) : undefined)
    .orderBy(order)
    .all();
}

export function getApplication(id: string) {
  return (
    db.select().from(applications).where(eq(applications.id, id)).get() ?? null
  );
}

export function listStatusEvents(applicationId?: string) {
  const rows = applicationId
    ? db
        .select()
        .from(statusEvents)
        .where(eq(statusEvents.applicationId, applicationId))
        .orderBy(desc(statusEvents.changedAt))
        .all()
    : db
        .select()
        .from(statusEvents)
        .orderBy(desc(statusEvents.changedAt))
        .all();
  return rows;
}

export type DashboardData = {
  total: number;
  thisMonth: number;
  interviews: number;
  offers: number;
  rejections: number;
  interviewRate: number;
  byStatus: Record<Status, number>;
  activity: {
    week: string;
    label: string;
    created: number;
    interviews: number;
    offers: number;
  }[];
  recent: {
    id: string;
    companyName: string;
    jobTitle: string;
    fromStatus: Status | null;
    toStatus: Status;
    changedAt: string;
  }[];
};

export function getDashboardData(): DashboardData {
  const all = db.select().from(applications).all();
  const events = db
    .select()
    .from(statusEvents)
    .orderBy(desc(statusEvents.changedAt))
    .all();

  const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<
    Status,
    number
  >;
  for (const row of all) {
    byStatus[row.status] += 1;
  }

  const submitted = all.filter((row) => row.status !== "saved").length;
  const reachedInterview = new Set(
    events
      .filter((event) => event.toStatus === "interview" || event.toStatus === "offer")
      .map((event) => event.applicationId),
  ).size;

  const now = new Date();
  const start = startOfWeek(subWeeks(now, 11), { weekStartsOn: 1 });
  const weeks = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });

  const activity = weeks.map((week) => {
    const key = formatISO(week, { representation: "date" });
    const next = new Date(week);
    next.setDate(week.getDate() + 7);
    const created = all.filter((row) => {
      const date = parseISO(row.createdAt);
      return date >= week && date < next;
    }).length;
    const interviews = events.filter((event) => {
      const date = parseISO(event.changedAt);
      return event.toStatus === "interview" && date >= week && date < next;
    }).length;
    const offers = events.filter((event) => {
      const date = parseISO(event.changedAt);
      return event.toStatus === "offer" && date >= week && date < next;
    }).length;
    return {
      week: key,
      label: week.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created,
      interviews,
      offers,
    };
  });

  const companyById = new Map(all.map((row) => [row.id, row]));
  const recent = events.slice(0, 8).flatMap((event) => {
    const app = companyById.get(event.applicationId);
    if (!app) return [];
    return [
      {
        id: event.id,
        companyName: app.companyName,
        jobTitle: app.jobTitle,
        fromStatus: event.fromStatus,
        toStatus: event.toStatus,
        changedAt: event.changedAt,
      },
    ];
  });

  return {
    total: all.length,
    thisMonth: all.filter((row) => isInCurrentMonth(row.createdAt)).length,
    interviews: byStatus.interview,
    offers: byStatus.offer,
    rejections: byStatus.rejected,
    interviewRate: submitted === 0 ? 0 : reachedInterview / submitted,
    byStatus,
    activity,
    recent,
  };
}

export function applicationsByStatus(rows: Application[]) {
  return STATUSES.map((status) => ({
    status,
    items: rows.filter((row) => row.status === status),
  }));
}

