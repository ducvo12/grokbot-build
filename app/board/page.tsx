import { listApplications } from "@/lib/db/queries";
import { KanbanBoard } from "@/components/board/kanban-board";

export const dynamic = "force-dynamic";
export const metadata = { title: "Board" };

export default function BoardPage() {
  const applications = listApplications({ sort: "updated" });

  return (
    <div className="rise-in">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The desk</p>
          <h2 className="font-display text-4xl text-ink">Drag a leaf to stamp it.</h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-ink-soft sm:block">
          Five stages. One desk. The card remembers where you left it.
        </p>
      </div>
      <KanbanBoard initial={applications} />
    </div>
  );
}
