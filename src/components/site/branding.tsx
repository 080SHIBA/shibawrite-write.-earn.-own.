import { Link } from "@tanstack/react-router";
import {
  Wallet,
  Twitter,
  MessageCircle,
  Send,
  Linkedin,
  BookMarked,
  Globe2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShibaMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-md bg-gradient-gold shadow-gold">
      <span className="font-display text-lg font-bold text-navy">S</span>
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-navy ring-2 ring-navy" />
    </div>
  );
}

export function SiteHeader() {
  const nav = [
    { l: "Home", to: "/" as const, hash: undefined },
    { l: "How It Works", to: "/how-it-works" as const, hash: undefined },
    { l: "Marketplace", to: "/" as const, hash: "marketplace" },
    { l: "Token ($WORD)", to: "/token" as const, hash: undefined },
    { l: "Leaderboard", to: "/" as const, hash: "leaderboard" },
    { l: "Blog", to: "/" as const, hash: "blog" },
  ];
  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-gold/15 bg-navy/95 text-navy-foreground backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <ShibaMark />
          <span className="font-display text-xl font-bold tracking-tight">
            Shiba<span className="text-gold">Write</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-navy-foreground/80 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.l}
              to={n.to}
              hash={n.hash}
              className="transition hover:text-gold"
            >
              {n.l}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ConnectWallet />
          <Button asChild className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            <Link to="/write">Start Writing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    { h: "Platform", l: ["Home", "How It Works", "Marketplace", "Leaderboard", "Blog"] },
    { h: "Token", l: ["$WORD Overview", "Tokenomics", "Staking", "Governance", "Whitepaper"] },
    { h: "Writers", l: ["Start Writing", "Writing Guidelines", "Reward Structure", "Top Writers", "Creator Marketplace"] },
    { h: "Company", l: ["About Us", "Contact", "Privacy Policy", "Terms of Service", "Smart Contract (Basescan)"] },
  ];
  const socials = [
    { i: Twitter, l: "Twitter / X" },
    { i: MessageCircle, l: "Discord" },
    { i: Send, l: "Telegram" },
    { i: Linkedin, l: "LinkedIn" },
    { i: BookMarked, l: "Medium" },
  ];
  return (
    <footer id="blog" className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <ShibaMark />
            <span className="font-display text-xl font-bold">
              Shiba<span className="text-gold">Write</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-navy-foreground/70">
            The professional platform where writing meets Web3 income.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.l}
                href="#"
                aria-label={s.l}
                className="grid h-9 w-9 place-items-center rounded-md border border-gold/30 text-gold transition hover:bg-gold/10"
              >
                <s.i className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-display text-sm font-semibold text-gold uppercase tracking-wider">
              {c.h}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-gold">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-navy-foreground/60 md:flex-row">
          <p>© 2025 ShibaWrite. $WORD token is a utility token on Base Network. Not financial advice.</p>
          <p className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" /> Built on Base ·
            <TrendingUp className="h-3.5 w-3.5" /> Powered by $WORD
          </p>
        </div>
      </div>
    </footer>
  );
}
