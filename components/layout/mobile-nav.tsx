"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Columns3, NotebookPen, Plus, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFolioUi } from "@/components/providers";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/board", label: "Board", icon: Columns3 },
  { href: "/applications", label: "Ledger", icon: NotebookPen },
];

export function MobileNav() {
  const pathname = usePathname();
  const { openCreate } = useFolioUi();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 px-3 py-2 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 text-[11px] tracking-wide",
                active ? "text-clay" : "text-ink-soft",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={openCreate}
          className="flex flex-col items-center gap-1 py-1 text-[11px] tracking-wide text-clay"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-clay text-vellum">
            <Plus size={16} />
          </span>
          Add
        </button>
      </div>
    </nav>
  );
}
