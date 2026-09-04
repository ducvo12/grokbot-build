import { listApplications, type ApplicationSort } from "@/lib/db/queries";
import { STATUSES, type Status } from "@/lib/constants";
import { Filters } from "@/components/applications/filters";
import { ApplicationList } from "@/components/applications/application-list";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ledger" };

function isStatus(value: string | undefined): value is Status {
  return Boolean(value && (STATUSES as readonly string[]).includes(value));
}

function isSort(value: string | undefined): value is ApplicationSort {
  return ["updated", "company", "applied", "salary"].includes(value ?? "");
}

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const status = isStatus(params.status) ? params.status : "all";
  const sort = isSort(params.sort) ? params.sort : "updated";
  const applications = listApplications({ query, status, sort });

  return (
    <div className="rise-in space-y-6">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The ledger</p>
        <h2 className="font-display text-4xl text-ink">Every leaf, in a line.</h2>
      </div>
      <Filters
        key={`${query}-${status}-${sort}`}
        query={query}
        status={status}
        sort={sort}
      />
      <p className="text-sm text-ink-soft">
        {applications.length} {applications.length === 1 ? "entry" : "entries"}
      </p>
      <ApplicationList applications={applications} hasFilters={Boolean(query) || status !== "all"} />
    </div>
  );
}
