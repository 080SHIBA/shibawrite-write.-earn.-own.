import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShibaMark } from "@/components/site/branding";
import { ConnectWallet } from "@/components/web3/ConnectWallet";

const nav = [
  { l: "Dashboard", to: "/dashboard" as const },
  { l: "Write", to: "/write" as const },
  { l: "Achievements", to: "/nfts" as const },
  { l: "Marketplace", to: "/marketplace" as const },
  { l: "$WORD", to: "/token" as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <ShibaMark />
            <span className="font-display text-lg font-bold tracking-tight">
              Shiba<span className="text-electric">Write</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {nav.map((n) => (
              <Link
                key={n.l}
                to={n.to}
                activeProps={{ className: "text-electric" }}
                className="transition hover:text-electric"
              >
                {n.l}
              </Link>
            ))}
          </nav>
          <ConnectWallet />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}

export function PageHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <header className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-bold">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
    </header>
  );
}
