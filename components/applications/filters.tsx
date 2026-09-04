"use client";

import { useEffect, useState } from "react";
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
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  function commit(next: { q?: string; status?: string; sort?: string } = {}) {
    const q = next.q ?? draft;
    const nextStatus = next.status ?? status;
    const nextSort = next.sort ?? sort;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextSort && nextSort !== "updated") params.set("sort", nextSort);
    const href = params.toString() ? `/applications?${params}` : "/applications";
    router.push(href);
  }

  return (
    <form
      className="grid gap-3 md:grid-cols-12"
      onSubmit={(event) => {
        event.preventDefault();
        commit({ q: draft });
        const input = event.currentTarget.querySelector<HTMLInputElement>('input[name="q"]');
        input?.blur();
      }}
    >
      <div className="md:col-span-6">
        <Input
          name="q"
          value={draft}
          placeholder="Search company, role, or city"
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            if (draft.trim() !== query) commit({ q: draft });
          }}
        />
      </div>
      <div className="md:col-span-3">
        <NativeSelect
          name="status"
          value={status}
          onChange={(event) => commit({ status: event.target.value })}
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
          value={sort}
          onChange={(event) => commit({ sort: event.target.value })}
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
