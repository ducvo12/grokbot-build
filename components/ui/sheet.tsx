"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Sheet = Dialog.Root;

export function SheetContent({
  children,
  className,
  title,
  eyebrow,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  eyebrow?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay/40 data-[state=open]:opacity-100" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(560px,100vw)] flex-col border-l border-rule bg-paper shadow-[-24px_0_60px_-32px_rgb(28_25_20_/_0.55)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-6 py-5">
          <div>
            {eyebrow ? (
              <p className="text-[11px] tracking-[0.22em] text-clay uppercase">{eyebrow}</p>
            ) : null}
            <Dialog.Title className="font-display text-3xl leading-tight text-ink">
              {title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          </div>
          <Dialog.Close className="rounded-full p-2 text-ink-soft hover:bg-paper-2">
            <X size={18} />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
