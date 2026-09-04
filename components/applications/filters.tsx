"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, STATUS_META } from "@/lib/constants";
import { Input, NativeSelect } from "@/components/ui/field";

export function Filters({
  query,
  status,
  sort,
}: {
  query: string;
  status: string;
  sort: string;
}) {
  const router = useRouter();
  const timer = useRef<number | null>(null);

  function write(next: Record<string, string>, immediate = true) {
    const apply = () => {
      const params = new URLSearchParams({
        q: query,
        status,
        sort,
        ...next,
      });
      for (const [key, value] of params.entries()) {
        if (!value || value === "all") params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `/applications?${qs}` : "/applications");
    };

    if (immediate) {
      apply();
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(apply, 250);
  }

  return (
    <form
      className="grid gap-3 md:grid-cols-12"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        write({
          q: String(form.get("q") ?? ""),
          status: String(form.get("status") ?? "all"),
          sort: String(form.get("sort") ?? "updated"),
        });
      }}
    >
      <div className="md:col-span-6">
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search company, role, or city"
          onChange={(event) => write({ q: event.target.value }, false)}
        />
      </div>
      <div className="md:col-span-3">
        <NativeSelect
          name="status"
          defaultValue={status}
          onChange={(event) => write({ status: event.target.value })}
        >
          <option value="all">Every stage</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_META[value].label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="md:col-span-3">
        <NativeSelect
          name="sort"
          defaultValue={sort}
          onChange={(event) => write({ sort: event.target.value })}
        >
          <option value="updated">Latest mark</option>
          <option value="company">Company</option>
          <option value="applied">Application date</option>
          <option value="salary">Salary</option>
        </NativeSelect>
      </div>
    </form>
  );
}
