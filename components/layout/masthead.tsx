"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { todayLine } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { useFolioUi } from "@/components/providers";

export function Masthead() {
  const pathname = usePathname();
  const { openCreate } = useFolioUi();

  return (
    <header className="relative">
      <div className="flex items-end justify-between gap-6 border-b border-ink/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] text-ink-soft uppercase">
            A private journal of the search
          </p>
          <Link href="/" className="group block">
            <h1 className="font-display text-[clamp(3.4rem,9vw,6.4rem)] leading-[0.8] tracking-[-0.04em] text-ink">
              Folio
              <span className="ml-3 align-super font-sans text-[11px] tracking-[0.3em] text-clay">
                VOL. I
              </span>
            </h1>
          </Link>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="font-display text-xl text-ink">{todayLine()}</p>
          <p className="mt-1 text-[11px] tracking-[0.18em] text-ink-soft uppercase">
            Printed in the browser
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Primary" className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  "ink-underline text-sm tracking-wide",
                  active ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <span className="mr-2 font-display text-clay">{item.index}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button onClick={openCreate} className="font-display tracking-[0.08em]">
          <Plus size={16} />
          Press a role
        </Button>
      </div>
    </header>
  );
}
