import type { DashboardData } from "@/lib/db/queries";
import { StatBlock } from "@/components/dashboard/stat-block";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { Pipeline } from "@/components/dashboard/pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { EmptyState } from "@/components/shared/empty-state";

export function Overview({ data }: { data: DashboardData }) {
  if (data.total === 0) {
    return (
      <EmptyState
        title="The folio is empty."
        copy="Press the first role and the weather, the current, and the trail will start writing themselves."
      />
    );
  }

  const rate = Math.round(data.interviewRate * 100);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-12">
        <StatBlock
          index="I"
          label="In the folio"
          value={data.total}
          hint="Every role you were willing to write down."
          className="md:col-span-4"
        />
        <StatBlock
          index="II"
          label="This month"
          value={data.thisMonth}
          hint="Leaves pressed since the calendar turned."
          className="md:col-span-4"
        />
        <StatBlock
          index="III"
          label="Interview rate"
          value={rate}
          suffix="%"
          hint="Of roles that left the shelf, how many became a conversation."
          className="md:col-span-4"
        />
        <StatBlock
          index="IV"
          label="Talking"
          value={data.interviews}
          className="md:col-span-4"
        />
        <StatBlock
          index="V"
          label="Offers"
          value={data.offers}
          className="md:col-span-4"
        />
        <StatBlock
          index="VI"
          label="Rejections"
          value={data.rejections}
          hint="Not a verdict on you. Just a door that shut."
          className="md:col-span-4"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ActivityChart data={data.activity} />
        </div>
        <div className="lg:col-span-4">
          <Pipeline counts={data.byStatus} />
        </div>
      </div>

      <RecentActivity events={data.recent} />
    </div>
  );
}
