import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PenLine,
  Coins,
  ShoppingBag,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Globe2,
  ShieldCheck,
  Lock,
  FileSearch,
  Vote,
  Gift,
  Banknote,
  CreditCard,
  ArrowUpRight,
  BookOpen,
  Zap,
  Heart,
  Megaphone,
  Landmark,
  TrendingUp,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site/branding";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/token")({
  head: () => ({
    meta: [
      { title: "$WORD Token — The Currency of ShibaWrite" },
      {
        name: "description",
        content:
          "Learn about WordContent ($WORD), the ERC-20 utility token on Base Network that powers the ShibaWrite content economy.",
      },
      { property: "og:title", content: "$WORD Token — The Currency of ShibaWrite" },
      {
        property: "og:description",
        content:
          "WordContent ($WORD) is the ERC-20 utility token powering the ShibaWrite content economy on Base Network.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/token" },
    ],
    links: [{ rel: "canonical", href: "/token" }],
  }),
  component: TokenPage,
});

function TokenPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <TokenHero />
        <WhatIsWord />
        <TokenUses />
        <HowToGet />
        <HowToCashOut />
        <Tokenomics />
        <SecurityTrust />
        <TokenCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------- Token Hero -------------------------------- */
function TokenHero() {
  const stats = [
    { label: "Token Name", value: "WordContent" },
    { label: "Symbol", value: "$WORD" },
    { label: "Network", value: "Base (Ethereum L2)" },
    { label: "Standard", value: "ERC-20" },
    { label: "Status", value: "Launching Soon" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-gold/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-foreground/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Utility Token on Base Network
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            WordContent ($WORD) — <br />
            <span className="text-gold">Where Writing Meets Real Value</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-foreground/80">
            $WORD is the lifeblood of the ShibaWrite economy. Earn it by writing. Spend it on what you need.
            Trade it for real money. Use it to shape the future of the platform.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gold/20 bg-navy-foreground/5 p-5 text-center backdrop-blur-sm transition hover:border-gold/40"
            >
              <p className="text-xs uppercase tracking-wider text-navy-foreground/60">{s.label}</p>
              <p className="mt-1 font-display text-lg font-bold text-gold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- What Is $WORD ---------------------------- */
function WhatIsWord() {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The Foundation</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            What Is $WORD?
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-brand">
            <p>
              $WORD is a utility token — it is the official currency of the ShibaWrite platform. It is not an
              investment product. It is a tool with real uses: writers earn it for creating content, readers spend it
              to tip creators, and creators use it to buy and sell in the marketplace.
            </p>
            <p>
              $WORD lives on the Base Network, an Ethereum Layer 2 blockchain. This means transactions cost less than a
              cent, settle in seconds, and are secured by Ethereum&apos;s infrastructure.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
              <ShieldCheck className="h-4 w-4" /> ERC-20 Standard
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
              <Globe2 className="h-4 w-4" /> Base Network
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
              <Lock className="h-4 w-4" /> Fixed 100M Supply
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-gradient-gold opacity-15 blur-3xl" />
          <div className="relative grid h-72 w-72 place-items-center rounded-full border-4 border-gold/40 bg-gradient-to-br from-gold/20 to-gold/5 shadow-gold md:h-80 md:w-80">
            <div className="text-center">
              <span className="font-display text-6xl font-bold text-gold md:text-7xl">$</span>
              <span className="font-display text-5xl font-bold text-navy md:text-6xl">WORD</span>
              <p className="mt-2 text-sm font-medium uppercase tracking-widest text-slate-brand">
                WordContent
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Token Uses -------------------------------- */
function TokenUses() {
  const cards = [
    {
      icon: PenLine,
      title: "Earn",
      body: "Publish quality content and earn $WORD automatically to your wallet. The more you write and the better the quality, the more you earn.",
    },
    {
      icon: ShoppingBag,
      title: "Buy Digital Products",
      body: "Browse the ShibaWrite Marketplace and spend $WORD on writing courses, templates, ebooks, research packs, and more from fellow creators.",
    },
    {
      icon: BookOpen,
      title: "Sell Your Products",
      body: "List your own digital products in the Marketplace and receive $WORD from buyers. Build a passive income stream from your expertise.",
    },
    {
      icon: Heart,
      title: "Tip & Support Writers",
      body: "Send $WORD directly to any writer on the platform. Support great content and build community relationships.",
    },
    {
      icon: Megaphone,
      title: "Boost & Promote",
      body: "Pay $WORD to boost your post to the homepage feed, category spotlight, or weekly digest. Get your best work seen.",
    },
    {
      icon: Vote,
      title: "Stake & Govern",
      body: "Lock $WORD in the staking contract to earn bonus rewards. Stakers also receive voting rights on platform governance decisions.",
    },
  ];

  return (
    <section className="bg-muted/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The Spending Economy</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            6 Ways $WORD Works For You
          </h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="group rounded-xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-navy text-gold">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-brand">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- How to Get $WORD -------------------------- */
function HowToGet() {
  const columns = [
    {
      icon: PenLine,
      title: "Earn It",
      badge: "Recommended",
      body: "The most rewarding way. Write and publish original content on ShibaWrite. Every approved post earns $WORD tokens directly to your wallet. No investment needed.",
      cta: "Start Writing",
      href: "/",
    },
    {
      icon: ArrowLeftRight,
      title: "Buy It",
      badge: null,
      body: "Purchase $WORD on Uniswap (Base Network). Connect your wallet, swap USDC or ETH for $WORD. Useful if you want to immediately access the marketplace or boost posts before your first post is approved.",
      cta: "View on Uniswap (Coming Soon)",
      href: "#",
    },
    {
      icon: Gift,
      title: "Receive It",
      badge: null,
      body: "Get tipped by other writers and readers. Participate in platform contests and writing challenges. Earn referral bonuses by inviting writers to join ShibaWrite.",
      cta: "Learn About Referrals",
      href: "#",
    },
  ];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Acquisition</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Three Ways to Acquire $WORD
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {columns.map((col) => (
            <div
              key={col.title}
              className="relative rounded-xl border border-border bg-card p-8 transition hover:border-gold/40 hover:shadow-elegant"
            >
              {col.badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-navy shadow-gold">
                  {col.badge}
                </span>
              )}
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-navy text-gold">
                <col.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy">{col.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-brand">{col.body}</p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"
                  asChild
                >
                  <Link to={col.href}>
                    {col.cta} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- How to Cash Out --------------------------- */
function HowToCashOut() {
  const steps = [
    { icon: PenLine, title: "Earn $WORD", desc: "Publish content on ShibaWrite and receive tokens." },
    { icon: Wallet, title: "Open Wallet", desc: "Access your wallet dashboard on ShibaWrite." },
    { icon: CreditCard, title: "Click Cash Out", desc: "Choose Uniswap swap or direct bank withdrawal." },
    { icon: ArrowLeftRight, title: "Swap via Uniswap", desc: "$WORD → USDC → send to Binance/Coinbase → bank transfer." },
    { icon: Banknote, title: "Withdraw via Transak", desc: "Enter bank details, convert $WORD directly to local currency." },
  ];

  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Liquidity</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Turning $WORD Into Real Money
          </h2>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Connector line */}
            <div
              aria-hidden
              className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent md:block"
              style={{ marginLeft: "1.25rem" }}
            />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.title} className="relative flex items-start gap-6 md:gap-8">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-navy text-gold shadow-gold md:h-14 md:w-14">
                    <span className="font-display text-lg font-bold">{i + 1}</span>
                  </div>
                  <div className="rounded-xl border border-gold/15 bg-navy-foreground/5 p-5 backdrop-blur-sm md:p-6">
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-navy-foreground/75">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-gold/20 bg-navy-foreground/5 p-6 text-center">
          <p className="text-sm leading-relaxed text-navy-foreground/70">
            <span className="font-semibold text-gold">Important:</span> Token value fluctuates based on market
            conditions. ShibaWrite is not a financial advisor. Treat $WORD as what it is: a utility token with real
            platform use cases.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Tokenomics -------------------------------- */
const TOKENOMICS_DATA = [
  { name: "Writer Rewards Pool", value: 40, color: "#C9A84C" },
  { name: "Marketplace Treasury", value: 20, color: "#3B82F6" },
  { name: "Team & Development", value: 15, color: "#10B981" },
  { name: "Liquidity", value: 10, color: "#F59E0B" },
  { name: "Community & Ecosystem", value: 10, color: "#8B5CF6" },
  { name: "Reserve Fund", value: 5, color: "#6B7280" },
];

function Tokenomics() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Distribution</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Token Distribution
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TOKENOMICS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {TOKENOMICS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0A1628",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {TOKENOMICS_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-navy">{item.name}</span>
                </div>
                <span className="font-display text-lg font-bold text-navy">{item.value}%</span>
              </div>
            ))}
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
              <p className="text-sm font-semibold text-navy">Total Supply: 100,000,000 $WORD</p>
              <p className="mt-1 text-xs text-slate-brand">
                No additional tokens can ever be minted beyond the 100M cap. The supply is hard-capped in the smart
                contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Security & Trust -------------------------- */
function SecurityTrust() {
  const pillars = [
    {
      icon: FileSearch,
      title: "Smart Contract Audited",
      body: "Contract code reviewed by independent security auditors before mainnet launch.",
    },
    {
      icon: Globe2,
      title: "Open Source",
      body: "Full contract code published and verified on Basescan. Anyone can read it.",
    },
    {
      icon: Lock,
      title: "Multisig Admin",
      body: "Platform is controlled by a Gnosis Safe multisig wallet. No single person can act unilaterally.",
    },
    {
      icon: ShieldCheck,
      title: "No Rug Mechanics",
      body: "Liquidity is locked. Team tokens vest over 3 years. Transparent tokenomics.",
    },
  ];

  return (
    <section className="bg-muted/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Security</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Built to Be Trusted
          </h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="rounded-xl border border-border bg-card p-7 text-center transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-gold">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-brand">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Token CTA --------------------------------- */
function TokenCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          $WORD Launches With ShibaWrite. <br />
          <span className="text-gold">Be Among the First.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            Join the Waitlist <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-navy-foreground/40 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            Read the Whitepaper
          </Button>
        </div>
      </div>
    </section>
  );
}
