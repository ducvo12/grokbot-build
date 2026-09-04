"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Toaster } from "sonner";
import type { Application } from "@/lib/db/schema";
import { AddDialog } from "@/components/applications/add-dialog";
import { ApplicationDrawer } from "@/components/applications/application-drawer";

type FolioUi = {
  openCreate: () => void;
  openApplication: (application: Application) => void;
};

const FolioUiContext = createContext<FolioUi | null>(null);

export function useFolioUi() {
  const value = useContext(FolioUiContext);
  if (!value) {
    throw new Error("useFolioUi must be used within FolioProviders");
  }
  return value;
}

export function FolioProviders({ children }: { children: React.ReactNode }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  const api = useMemo<FolioUi>(
    () => ({
      openCreate: () => setCreateOpen(true),
      openApplication: (application) => setSelected(application),
    }),
    [],
  );

  return (
    <FolioUiContext.Provider value={api}>
      {children}
      <AddDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ApplicationDrawer
        application={selected}
        onClose={() => setSelected(null)}
        onUpdated={setSelected}
      />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "!bg-paper !text-ink !border-rule !shadow-lg !rounded-sm !font-[inherit]",
        }}
      />
    </FolioUiContext.Provider>
  );
}
