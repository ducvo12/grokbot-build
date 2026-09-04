"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-[#1c1914]/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[min(420px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-rule bg-paper p-6 shadow-xl">
          <p className="text-[11px] tracking-[0.2em] text-rust uppercase">Irreversible</p>
          <AlertDialog.Title className="font-display mt-1 text-3xl">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-ink-soft">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="line">Keep it</Button>
            </AlertDialog.Cancel>
            <Button variant="danger" onClick={onConfirm} disabled={pending}>
              {pending ? "Tearing out…" : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
