"use client";

import { useDndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { STATUS_META, STATUS_THEME, type Status } from "@/lib/constants";
import type { Application } from "@/lib/db/schema";
import { KanbanCard } from "@/components/board/kanban-card";
import { cn } from "@/lib/cn";

export function KanbanColumn({
  status,
  items,
}: {
  status: Status;
  items: Application[];
}) {
  const { over } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });
  const overInColumn =
    isOver ||
    (over != null &&
      (over.id === status || items.some((item) => item.id === over.id)));

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex w-[min(18rem,80vw)] shrink-0 flex-col rounded-sm border border-rule bg-paper-2/40",
        overInColumn && "bg-paper-2",
      )}
    >
      <header className={cn("flex items-end justify-between border-b-2 px-3 py-3", STATUS_THEME[status].column)}>
        <h2 className="font-display text-2xl text-ink mt-4">{STATUS_META[status].label}</h2>
        <span className="font-display text-xl tracking-[0.2em] uppercase">{items.length}</span>
      </header>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-40 flex-1 flex-col gap-3 p-3">
          {items.map((item) => (
            <KanbanCard key={item.id} application={item} />
          ))}
          {items.length === 0 ? (
            <p className="px-1 py-8 text-center text-sm text-ink-soft/70">
              Drop a leaf here.
            </p>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
}
