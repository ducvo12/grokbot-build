import { count } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { applications, statusEvents } from "@/lib/db/schema";
import type { Status } from "@/lib/constants";
import * as schema from "@/lib/db/schema";

type Db = BetterSQLite3Database<typeof schema>;

type SeedRow = {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobUrl?: string;
  appliedAt?: string;
  status: Status;
  notes?: string;
  source?: string;
  createdAt: string;
  history: { to: Status; at: string }[];
};

const seedRows: SeedRow[] = [
  {
    id: "app_stripe",
    companyName: "Stripe",
    jobTitle: "Staff Product Engineer",
    location: "San Francisco, CA",
    salaryMin: 210000,
    salaryMax: 280000,
    jobUrl: "https://stripe.com/jobs",
    appliedAt: "2026-07-18",
    status: "interview",
    source: "Company site",
    notes:
      "Second conversation with the payments platform team. They want someone who has lived through API versioning pain. Sending a short write-up on idempotency keys before Thursday.",
    createdAt: "2026-07-12T15:10:00.000Z",
    history: [
      { to: "saved", at: "2026-07-12T15:10:00.000Z" },
      { to: "applied", at: "2026-07-18T16:40:00.000Z" },
      { to: "interview", at: "2026-08-04T18:05:00.000Z" },
    ],
  },
  {
    id: "app_linear",
    companyName: "Linear",
    jobTitle: "Product Engineer",
    location: "Remote",
    salaryMin: 170000,
    salaryMax: 220000,
    jobUrl: "https://linear.app/careers",
    appliedAt: "2026-08-02",
    status: "interview",
    source: "Referral",
    notes:
      "Referred by Maya. They asked about taste as much as systems. Prepare a teardown of how Folio would feel inside Linear.",
    createdAt: "2026-07-28T11:20:00.000Z",
    history: [
      { to: "saved", at: "2026-07-28T11:20:00.000Z" },
      { to: "applied", at: "2026-08-02T14:00:00.000Z" },
      { to: "interview", at: "2026-08-19T17:30:00.000Z" },
    ],
  },
  {
    id: "app_notion",
    companyName: "Notion",
    jobTitle: "Frontend Engineer, Editor",
    location: "New York, NY",
    salaryMin: 160000,
    salaryMax: 210000,
    status: "saved",
    source: "LinkedIn",
    notes: "Wait until the portfolio rewrite is live. The editor role wants proven rich-text work.",
    createdAt: "2026-08-26T09:15:00.000Z",
    history: [{ to: "saved", at: "2026-08-26T09:15:00.000Z" }],
  },
  {
    id: "app_figma",
    companyName: "Figma",
    jobTitle: "Design Engineer",
    location: "San Francisco, CA",
    salaryMin: 180000,
    salaryMax: 240000,
    jobUrl: "https://www.figma.com/careers",
    appliedAt: "2026-07-09",
    status: "interview",
    source: "Company site",
    notes: "Design exercise due Sunday. Keep it opinionated, not a component library tour.",
    createdAt: "2026-07-03T20:45:00.000Z",
    history: [
      { to: "saved", at: "2026-07-03T20:45:00.000Z" },
      { to: "applied", at: "2026-07-09T13:12:00.000Z" },
      { to: "interview", at: "2026-07-28T15:50:00.000Z" },
    ],
  },
  {
    id: "app_vercel",
    companyName: "Vercel",
    jobTitle: "Developer Experience Engineer",
    location: "Remote",
    salaryMin: 175000,
    salaryMax: 230000,
    jobUrl: "https://vercel.com/careers",
    appliedAt: "2026-08-11",
    status: "applied",
    source: "Otta",
    notes: "Emphasized docs, templates, and the ugly parts of framework upgrades.",
    createdAt: "2026-08-08T10:00:00.000Z",
    history: [
      { to: "saved", at: "2026-08-08T10:00:00.000Z" },
      { to: "applied", at: "2026-08-11T19:22:00.000Z" },
    ],
  },
  {
    id: "app_anthropic",
    companyName: "Anthropic",
    jobTitle: "Applied AI Engineer",
    location: "San Francisco, CA",
    salaryMin: 220000,
    salaryMax: 300000,
    status: "saved",
    source: "Company site",
    notes: "Need a tighter narrative around evaluation harnesses before applying.",
    createdAt: "2026-08-30T08:40:00.000Z",
    history: [{ to: "saved", at: "2026-08-30T08:40:00.000Z" }],
  },
  {
    id: "app_ramp",
    companyName: "Ramp",
    jobTitle: "Full Stack Engineer",
    location: "New York, NY",
    salaryMin: 170000,
    salaryMax: 225000,
    jobUrl: "https://ramp.com/careers",
    appliedAt: "2026-06-22",
    status: "offer",
    source: "Referral",
    notes:
      "Verbal offer 1 Sept. Comp is strong; ask about the product pod I would join. Decision by Friday.",
    createdAt: "2026-06-16T12:30:00.000Z",
    history: [
      { to: "saved", at: "2026-06-16T12:30:00.000Z" },
      { to: "applied", at: "2026-06-22T15:00:00.000Z" },
      { to: "interview", at: "2026-07-08T16:20:00.000Z" },
      { to: "offer", at: "2026-09-01T21:10:00.000Z" },
    ],
  },
  {
    id: "app_arc",
    companyName: "The Browser Company",
    jobTitle: "Software Engineer, Arc",
    location: "New York, NY",
    salaryMin: 160000,
    salaryMax: 200000,
    appliedAt: "2026-06-04",
    status: "rejected",
    source: "Wellfound",
    notes: "Kind rejection after the product sense round. They hired an internal transfer.",
    createdAt: "2026-05-28T18:05:00.000Z",
    history: [
      { to: "saved", at: "2026-05-28T18:05:00.000Z" },
      { to: "applied", at: "2026-06-04T14:18:00.000Z" },
      { to: "interview", at: "2026-06-20T17:00:00.000Z" },
      { to: "rejected", at: "2026-07-14T13:44:00.000Z" },
    ],
  },
  {
    id: "app_shopify",
    companyName: "Shopify",
    jobTitle: "Senior Frontend Developer",
    location: "Toronto, ON",
    salaryMin: 150000,
    salaryMax: 195000,
    appliedAt: "2026-08-20",
    status: "applied",
    source: "LinkedIn",
    notes: "Checkout team. Mentioned the edge-rendered cart work from last spring.",
    createdAt: "2026-08-17T09:50:00.000Z",
    history: [
      { to: "saved", at: "2026-08-17T09:50:00.000Z" },
      { to: "applied", at: "2026-08-20T11:05:00.000Z" },
    ],
  },
  {
    id: "app_spotify",
    companyName: "Spotify",
    jobTitle: "Backend Engineer, Playlist",
    location: "Stockholm, SE",
    salaryMin: 140000,
    salaryMax: 185000,
    status: "saved",
    source: "Company site",
    notes: "Relocation package looks real. Bookmark until September interviews calm down.",
    createdAt: "2026-08-05T07:25:00.000Z",
    history: [{ to: "saved", at: "2026-08-05T07:25:00.000Z" }],
  },
  {
    id: "app_airbnb",
    companyName: "Airbnb",
    jobTitle: "iOS Engineer",
    location: "San Francisco, CA",
    salaryMin: 190000,
    salaryMax: 250000,
    appliedAt: "2026-07-24",
    status: "interview",
    source: "Recruiter",
    notes: "Recruiter wants onsite in late September. Confirm travel before accepting.",
    createdAt: "2026-07-21T16:10:00.000Z",
    history: [
      { to: "saved", at: "2026-07-21T16:10:00.000Z" },
      { to: "applied", at: "2026-07-24T18:30:00.000Z" },
      { to: "interview", at: "2026-08-15T20:00:00.000Z" },
    ],
  },
  {
    id: "app_pitch",
    companyName: "Pitch",
    jobTitle: "Product Designer",
    location: "Berlin, DE",
    salaryMin: 95000,
    salaryMax: 125000,
    appliedAt: "2026-08-07",
    status: "applied",
    source: "Otta",
    notes: "Portfolio sent with the Folio masthead case study attached.",
    createdAt: "2026-08-03T13:40:00.000Z",
    history: [
      { to: "saved", at: "2026-08-03T13:40:00.000Z" },
      { to: "applied", at: "2026-08-07T10:12:00.000Z" },
    ],
  },
  {
    id: "app_mercury",
    companyName: "Mercury",
    jobTitle: "Growth Engineer",
    location: "Remote",
    salaryMin: 155000,
    salaryMax: 200000,
    status: "saved",
    source: "LinkedIn",
    notes: "Interesting blend of brand and funnel. Need a sharper take on banking onboarding.",
    createdAt: "2026-09-01T15:00:00.000Z",
    history: [{ to: "saved", at: "2026-09-01T15:00:00.000Z" }],
  },
  {
    id: "app_watershed",
    companyName: "Watershed",
    jobTitle: "Climate Software Engineer",
    location: "San Francisco, CA",
    salaryMin: 165000,
    salaryMax: 215000,
    appliedAt: "2026-08-14",
    status: "applied",
    source: "Referral",
    notes: "Care about measurement integrity. Mentioned the Scope 3 data model from the last role.",
    createdAt: "2026-08-10T17:18:00.000Z",
    history: [
      { to: "saved", at: "2026-08-10T17:18:00.000Z" },
      { to: "applied", at: "2026-08-14T16:45:00.000Z" },
    ],
  },
  {
    id: "app_runway",
    companyName: "Runway",
    jobTitle: "Machine Learning Engineer",
    location: "New York, NY",
    salaryMin: 200000,
    salaryMax: 270000,
    appliedAt: "2026-06-12",
    status: "rejected",
    source: "Company site",
    notes: "Stopped after the research screen. They wanted deeper diffusion paper work than I have.",
    createdAt: "2026-06-08T21:00:00.000Z",
    history: [
      { to: "saved", at: "2026-06-08T21:00:00.000Z" },
      { to: "applied", at: "2026-06-12T12:30:00.000Z" },
      { to: "rejected", at: "2026-06-27T14:05:00.000Z" },
    ],
  },
  {
    id: "app_superhuman",
    companyName: "Superhuman",
    jobTitle: "Frontend Engineer",
    location: "Remote",
    salaryMin: 160000,
    salaryMax: 210000,
    appliedAt: "2026-07-30",
    status: "interview",
    source: "Wellfound",
    notes: "Keyboard-first take-home. They noticed the command palette in my last product.",
    createdAt: "2026-07-25T19:10:00.000Z",
    history: [
      { to: "saved", at: "2026-07-25T19:10:00.000Z" },
      { to: "applied", at: "2026-07-30T15:55:00.000Z" },
      { to: "interview", at: "2026-08-22T18:40:00.000Z" },
    ],
  },
  {
    id: "app_patagonia",
    companyName: "Patagonia",
    jobTitle: "Digital Product Manager",
    location: "Ventura, CA",
    salaryMin: 130000,
    salaryMax: 165000,
    status: "saved",
    source: "Company site",
    notes: "The worn wear brief is the one I actually want. Draft a one-pager this weekend.",
    createdAt: "2026-08-28T22:30:00.000Z",
    history: [{ to: "saved", at: "2026-08-28T22:30:00.000Z" }],
  },
  {
    id: "app_nyt",
    companyName: "The New York Times",
    jobTitle: "Software Engineer, Newsroom Tools",
    location: "New York, NY",
    salaryMin: 145000,
    salaryMax: 185000,
    appliedAt: "2026-08-25",
    status: "applied",
    source: "Company site",
    notes:
      "Cover letter leaned on editorial software, not generic CRUD. Follow up with the hiring editor next week.",
    createdAt: "2026-08-21T14:05:00.000Z",
    history: [
      { to: "saved", at: "2026-08-21T14:05:00.000Z" },
      { to: "applied", at: "2026-08-25T13:20:00.000Z" },
    ],
  },
];

export function seedIfEmpty(db: Db) {
  const [{ value }] = db.select({ value: count() }).from(applications).all();
  if (value > 0) return;
  insertSeed(db);
}

export function reseed(db: Db) {
  db.delete(statusEvents).run();
  db.delete(applications).run();
  insertSeed(db);
}

function insertSeed(db: Db) {
  for (const row of seedRows) {
    db.insert(applications)
      .values({
        id: row.id,
        companyName: row.companyName,
        jobTitle: row.jobTitle,
        companyLogoUrl: null,
        location: row.location,
        salaryMin: row.salaryMin ?? null,
        salaryMax: row.salaryMax ?? null,
        jobUrl: row.jobUrl ?? null,
        appliedAt: row.appliedAt ?? null,
        status: row.status,
        notes: row.notes ?? null,
        source: row.source ?? null,
        createdAt: row.createdAt,
        updatedAt: row.history.at(-1)?.at ?? row.createdAt,
      })
      .run();

    let previous: Status | null = null;
    for (const event of row.history) {
      db.insert(statusEvents)
        .values({
          id: `${row.id}_${event.to}_${event.at}`,
          applicationId: row.id,
          fromStatus: previous,
          toStatus: event.to,
          changedAt: event.at,
        })
        .run();
      previous = event.to;
    }
  }
}
