"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { STATUSES, STATUS_META, type Status } from "@/lib/constants";
import type { Application } from "@/lib/db/schema";
import { updateApplicationStatus } from "@/actions/applications";
import { KanbanColumn } from "@/components/board/kanban-column";
import { KanbanCard } from "@/components/board/kanban-card";
import { EmptyState } from "@/components/shared/empty-state";
import { BoardSkeleton } from "@/components/shared/skeletons";

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

function findContainer(id: UniqueIdentifier, list: Application[]): Status | undefined {
  const key = String(id);
  if (isStatus(key)) return key;
  return list.find((item) => item.id === key)?.status;
}

/** Swap one status column's cards while preserving the relative order of other columns. */
function replaceColumn(
  list: Application[],
  column: Status,
  columnItems: Application[],
): Application[] {
  const result: Application[] = [];
  let inserted = false;
  for (const item of list) {
    if (item.status !== column) {
      result.push(item);
      continue;
    }
    if (!inserted) {
      result.push(...columnItems);
      inserted = true;
    }
  }
  if (!inserted) result.push(...columnItems);
  return result;
}

/** Rebuild the flat list so `moved` sits at `index` within its status column. */
function placeInColumn(
  list: Application[],
  moved: Application,
  column: Status,
  index: number,
): Application[] {
  const rest = list.filter((item) => item.id !== moved.id);
  const columnItems = rest.filter((item) => item.status === column);
  const clamped = Math.max(0, Math.min(index, columnItems.length));
  return replaceColumn(rest, column, [
    ...columnItems.slice(0, clamped),
    moved,
    ...columnItems.slice(clamped),
  ]);
}

export function KanbanBoard({ initial }: { initial: Application[] }) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<Application | null>(null);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef(items);
  const originStatusRef = useRef<Status | null>(null);
  const snapshotRef = useRef<Application[] | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  itemsRef.current = items;

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

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
    const application = itemsRef.current.find((item) => item.id === event.active.id);
    setActive(application ?? null);
    originStatusRef.current = application?.status ?? null;
    snapshotRef.current = itemsRef.current;
  }

  function onDragOver(event: DragOverEvent) {
    const { active: dragged, over } = event;
    if (!over || recentlyMovedToNewContainer.current) return;

    const list = itemsRef.current;
    const activeId = String(dragged.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId, list);
    const overContainer = findContainer(overId, list);
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const activeItem = list.find((item) => item.id === activeId);
    if (!activeItem) return;

    const overItems = list.filter((item) => item.status === overContainer);
    const overIndex = overItems.findIndex((item) => item.id === overId);

    let newIndex: number;
    if (isStatus(overId)) {
      newIndex = overItems.length;
    } else {
      const isBelowOverItem =
        dragged.rect.current.translated &&
        dragged.rect.current.translated.top > over.rect.top + over.rect.height / 2;
      newIndex = overIndex >= 0 ? overIndex + (isBelowOverItem ? 1 : 0) : overItems.length;
    }

    recentlyMovedToNewContainer.current = true;
    const moved = { ...activeItem, status: overContainer };
    setItems(placeInColumn(list, moved, overContainer, newIndex));
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active: dragged, over } = event;
    const originStatus = originStatusRef.current;
    const snapshot = snapshotRef.current;
    setActive(null);
    originStatusRef.current = null;
    snapshotRef.current = null;

    if (!over) {
      if (snapshot) setItems(snapshot);
      return;
    }

    const activeId = String(dragged.id);
    const overId = String(over.id);
    const list = itemsRef.current;
    const current = list.find((item) => item.id === activeId);
    if (!current) return;

    const overContainer = findContainer(overId, list) ?? current.status;

    // Settle final order within the landing column.
    if (!isStatus(overId) && current.status === overContainer) {
      const columnItems = list.filter((item) => item.status === overContainer);
      const oldIndex = columnItems.findIndex((item) => item.id === activeId);
      const newIndex = columnItems.findIndex((item) => item.id === overId);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        setItems(replaceColumn(list, overContainer, arrayMove(columnItems, oldIndex, newIndex)));
      }
    }

    const nextStatus = overContainer;
    if (!originStatus || nextStatus === originStatus) return;

    const previous = snapshot ?? list;
    const result = await updateApplicationStatus(activeId, nextStatus);
    if (!result.ok) {
      setItems(previous);
      toast.error(result.error);
      return;
    }
    toast.success(`Stamped ${STATUS_META[nextStatus].label}.`);
  }

  function onDragCancel() {
    if (snapshotRef.current) setItems(snapshotRef.current);
    setActive(null);
    originStatusRef.current = null;
    snapshotRef.current = null;
  }

  if (initial.length === 0) {
    return (
      <EmptyState
        title="No cards on the desk."
        copy="Press a role and it will appear as a leaf you can drag from shelf to offer."
      />
    );
  }

  if (!ready) {
    return <BoardSkeleton />;
  }

  return (
    <DndContext
      id="folio-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 folio-scroll">
        {columns.map((column) => (
          <KanbanColumn key={column.status} status={column.status} items={column.items} />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {active ? <KanbanCard application={active} overlay /> : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
