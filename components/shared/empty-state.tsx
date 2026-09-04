"use client";

import { Button } from "@/components/ui/button";
import { useFolioUi } from "@/components/providers";

export function EmptyState({
  title,
  copy,
  action = "Press the first role",
}: {
  title: string;
  copy: string;
  action?: string;
}) {
  const { openCreate } = useFolioUi();

  return (
    <div className="relative overflow-hidden rounded-sm border border-dashed border-rule bg-vellum/70 px-6 py-16 text-center">
      <p className="text-[11px] tracking-[0.24em] text-clay uppercase">Blank page</p>
      <h2 className="font-display mt-2 text-4xl text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">{copy}</p>
      <Button className="mt-6" onClick={openCreate}>
        {action}
      </Button>
    </div>
  );
}
