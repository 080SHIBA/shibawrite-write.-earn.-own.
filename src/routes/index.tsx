import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImage from "@/assets/hero-network.jpg";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site/branding";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wallet,
  PenLine,
  Cpu,
  Timer,
  Coins,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Gem,
  Flame,
  Lock,
  ArrowUpRight,
  BadgeCheck,
  Crown,
  CircleDot,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShibaWrite — Write. Earn. Own Your Words." },
      {
        name: "description",
        content:
          "Connect your wallet, publish content, and earn $WORD tokens on Base. AI-scored rewards, soulbound achievement NFTs, and an escrow-protected creator marketplace.",
      },
      { property: "og:title", content: "ShibaWrite — Write. Earn. Own Your Words." },
      {
        property: "og:description",
        content:
          "The content-to-earn platform where every word you publish mints real value in $WORD on Base Network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

/* ---------------------------------- data --------------------------------- */

const wallets = [
  { name: "MetaMask", desc: "Most popular browser wallet", tag: "Recommended" },
  { name: "Coinbase Wallet", desc: "Native Base Network support", tag: "Base" },
  { name: "WalletConnect", desc: "Scan with 400+ mobile wallets", tag: "Mobile" },
];

const stats = [
  { v: "30", u: "$WORD", l: "per 150 words, base rate" },
  { v: "1.3x", u: "", l: "top category multiplier" },
  { v: "2.0x", u: "", l: "max quality multiplier" },
  { v: "5 min", u: "", l: "reward hold, then claim" },
];

const flow = [
  {
    i: Wallet,
    step: "01",
    t: "Connect & Sign In",
    d: "MetaMask, Coinbase, or WalletConnect. Sign a gasless SIWE message — no passwords, no custody, no gatekeepers.",
  },
  {
    i: PenLine,
    step: "02",
    t: "Write & Estimate",
    d: "Draft in the editor with a live reward estimator: word count × base rate × category multiplier, updating as you type.",
  },
  {
    i: Cpu,
    step: "03",
    t: "AI Scoring",
    d: "A 5-layer engine grades originality, quality, and authenticity. Score drives a 0.5x–2.0x multiplier on your full reward.",
  },
  {
    i: Timer,
    step: "04",
    t: "Hold, Then Claim",
    d: "Approved rewards unlock after a 5-minute anti-fraud window. Claim on-chain with an EIP-712 signature — you keep custody.",
  },
];

const tiers = [
  {
    i: CircleDot,
    name: "New Writer",
    range: "0–5 approved posts",
    perks: ["Full reward formula", "AI score feedback", "Wallet payouts in $WORD"],
  },
  {
    i: BadgeCheck,
    name: "Verified Writer",
    range: "5–50 approved posts",
    perks: ["Sell in the marketplace", "Verified creator badge", "Priority scoring queue"],
    featured: true,
  },
  {
    i: Crown,
    name: "Elite Writer",
    range: "50+ approved, high avg quality",
    perks: ["Bonus reward multiplier", "Featured placement", "Governance weight on $WORD"],
  },
];

const spend = [
  { i: Coins, t: "Tip Writers", d: "Send $WORD straight to a creator's wallet." },
  { i: Flame, t: "Boost Posts", d: "Promote reach — 50% of the spend is burned." },
  { i: Gem, t: "Mint Soulbound NFTs", d: "Score above 90% and mint a non-transferable badge." },
  { i: ShoppingBag, t: "Buy Digital Products", d: "Courses, templates, research packs, themes." },
  { i: Lock, t: "Unlock Premium", d: "Token-gate your best work behind a $WORD price." },
  { i: ArrowUpRight, t: "Cash Out", d: "Swap to USDC on Uniswap, off-ramp to your bank." },
];

const trust = [
  { t: "Non-custodial by design", d: "Rewards are claimed by you with your own signature. The backend never moves your funds." },
  { t: "Escrow-protected market", d: "Purchases are held for 1 hour. Raise a dispute and a human moderator reviews it." },
  { t: "Anti-farming enforced on-chain", d: "2,000 $WORD daily wallet cap, 200–3,500 word bounds, behavioral bot detection." },
];

/* -------------------------------- sections -------------------------------- */

function WalletDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to sign in on Base Network. You'll sign a message — never a transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          {wallets.map((w) => (
            <button
              key={w.name}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-surface-glass px-4 py-3.5 text-left transition hover:border-electric/60 hover:shadow-gold"
              onClick={() => setOpen(false)}
            >
              <span>
                <span className="block font-display text-sm font-semibold">{w.name}</span>
                <span className="block text-xs text-muted-foreground">{w.desc}</span>
              </span>
              <span className="rounded-full border border-electric/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-electric">
                {w.tag}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          No wallet yet? <span className="text-electric">Read the install guide</span> — it takes about two minutes.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-gold opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/35 bg-surface-glass px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-electric">
            <Sparkles className="h-3.5 w-3.5" /> Live on Base Network
          </span>
          <h1 className="mt-7 font-display text-5xl font-bold leading-[1.05] sm:text-6xl xl:text-7xl">
            Write. Earn.
            <br />
            <span className="text-electric text-glow">Own Your Words.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ShibaWrite pays you for your talent. Every word you publish is scored, rewarded, and
            settled on-chain in $WORD. No middlemen. No gatekeepers. Just you, your words, and your wallet.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-13 bg-gradient-gold px-7 text-base font-semibold text-electric-foreground shadow-gold hover:opacity-95"
            >
              Start Writing Free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <WalletDialog>
              <Button
                size="lg"
                variant="outline"
                className="h-13 border-border bg-transparent px-7 text-base font-semibold hover:border-electric/60 hover:bg-electric/10"
              >
                <Wallet className="mr-1.5 h-4 w-4" /> Connect Wallet
              </Button>
            </WalletDialog>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl font-bold text-electric">
                  {s.v}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">{s.u}</span>
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-gold opacity-20 blur-3xl" aria-hidden />
          <img
            src={heroImage}
            alt="Holographic wireframe document representing on-chain content rewards"
            width={1044}
            height={1024}
            className="relative w-full rounded-2xl border border-border object-cover shadow-elegant"
          />
          <div className="relative mx-auto -mt-14 w-[86%] rounded-2xl border border-border bg-card/90 p-5 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>Reward preview</span>
              <span className="text-electric">Quality 94%</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">
              1,820 <span className="text-base text-electric">$WORD</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              3,500 words × 1.3x technical × 2.0x quality — claimable in 5:00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Flow() {
  return (
    <section id="how" className="relative border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">The flow</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            From blank page to on-chain payout
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four steps, fully transparent, entirely non-custodial.
          </p>
        </header>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {flow.map((f) => (
            <article
              key={f.step}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-glass p-6 transition hover:border-electric/50 hover:shadow-gold"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-electric-foreground shadow-gold">
                  <f.i className="h-5 w-5" />
                </span>
                <span className="font-display text-sm text-muted-foreground">{f.step}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">Progression</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Earn your tier, unlock the economy</h2>
        </header>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={`relative rounded-2xl border p-7 transition ${
                t.featured
                  ? "border-electric/60 bg-surface-glass shadow-glow"
                  : "border-border bg-surface-glass hover:border-electric/40"
              }`}
            >
              <t.i className="h-6 w-6 text-electric" />
              <h3 className="mt-5 font-display text-xl font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.range}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-electric" /> {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpendLayer() {
  return (
    <section id="marketplace" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">The spend layer</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">$WORD does more than sit in your wallet</h2>
        </header>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {spend.map((s) => (
            <div key={s.t} className="bg-background p-7 transition hover:bg-card">
              <s.i className="h-5 w-5 text-electric" />
              <h3 className="mt-4 font-display text-base font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section id="leaderboard" className="border-t border-border bg-background py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
        {trust.map((t) => (
          <div key={t.t} className="border-l border-electric/40 pl-6">
            <h3 className="font-display text-lg font-semibold">{t.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-hero py-28">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Your content is your income.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Connect a wallet, publish your first post, and watch the reward land in your own custody.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-13 bg-gradient-gold px-7 text-base font-semibold text-electric-foreground shadow-gold hover:opacity-95"
          >
            Start Writing Free <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-13 border-border bg-transparent px-7 text-base font-semibold hover:border-electric/60 hover:bg-electric/10"
          >
            <Link to="/how-it-works">See How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Flow />
        <Tiers />
        <SpendLayer />
        <Trust />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
