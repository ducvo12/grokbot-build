export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="h-40 rounded-sm bg-paper-2 md:col-span-7" />
        <div className="h-40 rounded-sm bg-paper-2 md:col-span-5" />
      </div>
      <div className="h-72 rounded-sm bg-paper-2" />
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-[28rem] w-72 shrink-0 rounded-sm bg-paper-2" />
      ))}
    </div>
  );
}

export function LedgerSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-20 rounded-sm bg-paper-2" />
      ))}
    </div>
  );
}
