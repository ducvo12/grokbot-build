import { getDashboardData } from "@/lib/db/queries";
import { Overview } from "@/components/dashboard/overview";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  const data = getDashboardData();

  return (
    <div className="rise-in">
      <p className="max-w-2xl font-display text-2xl leading-snug text-ink-soft sm:text-3xl">
        The search, set in type. What you saved, what you sent, and what came back.
      </p>
      <div className="mt-8">
        <Overview data={data} />
      </div>
    </div>
  );
}
