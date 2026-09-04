"use client";

import { Button } from "@/components/ui/button";

export default function ErrorState({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-sm border border-rust/40 bg-vellum px-6 py-12 text-center">
      <p className="text-[11px] tracking-[0.22em] text-rust uppercase">A smudge</p>
      <h2 className="font-display mt-2 text-4xl">The page did not set.</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
        Something in the folio jammed. Try again — the ink is still there.
      </p>
      <Button className="mt-6" onClick={reset}>
        Reset the press
      </Button>
    </div>
  );
}
