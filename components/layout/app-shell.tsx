import { FolioProviders } from "@/components/providers";
import { Masthead } from "@/components/layout/masthead";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FolioProviders>
      <div className="grain" />
      <div className="relative mx-auto min-h-screen w-full max-w-[1440px] px-0 md:px-4 md:py-6">
        <div className="relative min-h-screen overflow-hidden border-y border-rule bg-paper md:min-h-[calc(100vh-3rem)] md:border md:shadow-[0_40px_80px_-48px_rgb(28_25_20_/_0.7)]">
          <div className="spine absolute inset-y-0 left-0 hidden w-3 md:block" aria-hidden />
          <div className="relative px-4 pt-6 pb-24 sm:px-8 md:pl-12 md:pb-10">
            <Masthead />
            <main className="mt-8">{children}</main>
            <footer className="mt-16 border-t border-rule pt-5 text-[11px] tracking-[0.18em] text-ink-soft uppercase">
              Set in Fraunces & Outfit · Folio keeps the search honest
            </footer>
          </div>
        </div>
      </div>
      <MobileNav />
    </FolioProviders>
  );
}
