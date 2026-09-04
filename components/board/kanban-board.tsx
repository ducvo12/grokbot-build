"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { STATUSES, STATUS_META, type Status } from "@/lib/constants";
import type { Application } from "@/lib/db/schema";
import { updateApplicationStatus } from "@/actions/applications";
import { KanbanColumn } from "@/components/board/kanban-column";
import { KanbanCard } from "@/components/board/kanban-card";
import { EmptyState } from "@/components/shared/empty-state";

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export function KanbanBoard({ initial }: { initial: Application[] }) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<Application | null>(null);

  useEffect(() => {
    setItems(initial);
  }, [initial]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const columns = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        items: items.filter((item) => item.status === status),
      })),
    [items],
  );

  function onDragStart(event: DragStartEvent) {
    const application = items.find((item) => item.id === event.active.id);
    setActive(application ?? null);
  }

  async function onDragEnd(event: DragEndEvent) {
    setActive(null);
    const { active: dragged, over } = event;
    if (!over) return;

    const current = items.find((item) => item.id === dragged.id);
    if (!current) return;

    const overId = String(over.id);
    const nextStatus = isStatus(overId)
      ? overId
      : items.find((item) => item.id === overId)?.status;
    if (!nextStatus || nextStatus === current.status) return;

    const previous = items;
    setItems((list) =>
      list.map((item) =>
        item.id === current.id
          ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
          : item,
      ),
    );

    const result = await updateApplicationStatus(current.id, nextStatus);
    if (!result.ok) {
      setItems(previous);
      toast.error(result.error);
      return;
    }
    toast.success(`Stamped ${STATUS_META[nextStatus].label}.`);
  }

  if (initial.length === 0) {
    return (
      <EmptyState
        title="No cards on the desk."
        copy="Press a role and it will appear as a leaf you can drag from shelf to offer."
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 folio-scroll">
        {columns.map((column) => (
          <KanbanColumn key={column.status} status={column.status} items={column.items} />
        ))}
      </div>
      <DragOverlay>
        {active ? <KanbanCard application={active} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
