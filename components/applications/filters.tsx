"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, STATUS_META } from "@/lib/constants";
import { Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "all", label: "Every stage" },
  ...STATUSES.map((value) => ({ value, label: STATUS_META[value].label })),
];

const SORT_OPTIONS = [
  { value: "updated", label: "Latest mark" },
  { value: "company", label: "Company" },
  { value: "applied", label: "Application date" },
  { value: "salary", label: "Salary" },
];

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
        <Select
          name="status"
          aria-label="Stage"
          value={status}
          onChange={(value) => commit({ status: value })}
          options={STATUS_OPTIONS}
        />
      </div>
      <div className="md:col-span-3">
        <Select
          name="sort"
          aria-label="Sort"
          value={sort}
          onChange={(value) => commit({ sort: value })}
          options={SORT_OPTIONS}
        />
      </div>
    </form>
  );
}
