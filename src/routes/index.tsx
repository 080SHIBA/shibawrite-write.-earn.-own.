import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImage from "@/assets/hero-writer.jpg";
import { Button } from "@/components/ui/button";
import {
  PenLine,
  Coins,
  ShoppingBag,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Globe2,
  BookOpen,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  UserPlus,
  FileText,
  CircleDollarSign,
  Banknote,
  Star,
  Vote,
  ArrowLeftRight,
  Twitter,
  MessageCircle,
  Send,
  Linkedin,
  BookMarked,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShibaWrite — Write. Earn. Own Your Words." },
      {
        name: "description",
        content:
          "ShibaWrite is the professional content-to-earn platform where every word you publish earns $WORD tokens on Base. Join thousands of writers getting paid for their talent.",
      },
      { property: "og:title", content: "ShibaWrite — Write. Earn. Own Your Words." },
      {
        property: "og:description",
        content:
          "Earn $WORD tokens for every story you publish. A professional writing economy on Base.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <LiveStats />
        <Niches />
        <RewardSystem />
        <MarketplacePreview />
        <TokenSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------------- Header --------------------------------- */
function Header() {
  const nav: { l: string; h?: string; to?: string }[] = [
    { l: "Home", h: "#top" },
    { l: "How It Works", to: "/how-it-works" },
    { l: "Marketplace", h: "#marketplace" },
    { l: "Token ($WORD)", h: "#token" },
    { l: "Leaderboard", h: "#leaderboard" },
    { l: "Blog", h: "#blog" },
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
          {nav.map((n) =>
            n.to ? (
              <Link key={n.l} to={n.to} className="transition hover:text-gold">
                {n.l}
              </Link>
            ) : (
              <a key={n.l} href={n.h} className="transition hover:text-gold">
                {n.l}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden border-gold/60 bg-transparent text-gold hover:bg-gold/10 hover:text-gold md:inline-flex"
          >
            <Wallet className="mr-1.5 h-4 w-4" /> Connect Wallet
          </Button>
          <Button className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            Start Writing
          </Button>
        </div>
      </div>
    </header>
  );
}

function ShibaMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-md bg-gradient-gold shadow-gold">
      <span className="font-display text-lg font-bold text-navy">S</span>
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-navy ring-2 ring-navy" />
    </div>
  );
}

/* ----------------------------------- Hero ---------------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      {/* Floating words background pattern */}
      <FloatingWords />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-foreground/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Built on Base · Powered by $WORD
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Write Content. <br />
            Earn $WORD. <br />
            <span className="text-gold">Own Your Future.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/80">
            ShibaWrite is the world's first professional content platform where every word
            you publish earns you real cryptocurrency. Join thousands of writers getting
            paid for their talent.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
              Start Writing Free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-navy-foreground/40 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              Learn How It Works
            </Button>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 border-t border-navy-foreground/15 pt-8 sm:grid-cols-3">
            {[
              { i: Users, t: "10,000+ Writers" },
              { i: LinkIcon, t: "$WORD on Base Network" },
              { i: Coins, t: "Earn Per Post Published" },
            ].map((b) => (
              <div key={b.t} className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-md border border-gold/30 bg-navy-foreground/5 text-gold">
                  <b.i className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-navy-foreground/85">{b.t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-gold opacity-20 blur-2xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function FloatingWords() {
  const words = ["Write", "Earn", "Publish", "Story", "Verse", "$WORD", "Craft", "Voice", "Chapter", "Token"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      {words.map((w, i) => (
        <span
          key={w}
          className="absolute select-none font-display text-2xl font-semibold text-gold/10 md:text-4xl"
          style={{
            top: `${(i * 53) % 90 + 5}%`,
            left: `${(i * 71) % 90 + 2}%`,
            transform: `rotate(${(i * 17) % 30 - 15}deg)`,
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-navy/60 shadow-elegant backdrop-blur">
      <div className="flex items-center justify-between border-b border-navy-foreground/10 bg-navy/80 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy-foreground/30" />
        </div>
        <span className="text-xs text-navy-foreground/50">shibawrite.io / dashboard</span>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/15 to-transparent p-5">
          <p className="text-xs uppercase tracking-wider text-gold/80">Wallet balance</p>
          <p className="mt-1 font-display text-4xl font-bold text-gold">12,840 $WORD</p>
          <p className="mt-1 text-xs text-navy-foreground/60">≈ $1,412.40 USDC</p>
        </div>

        <div className="rounded-xl border border-navy-foreground/10 bg-navy-foreground/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-foreground/60">
              Recent earnings
            </p>
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">
              Live
            </span>
          </div>
          <ul className="space-y-2.5 text-sm">
            {[
              { t: "Quantum Economics — Essay", v: "+1,284" },
              { t: "Chapter 7: The Long Drift", v: "+860" },
              { t: "Beginner's DeFi Tutorial", v: "+540" },
            ].map((r) => (
              <li key={r.t} className="flex items-center justify-between">
                <span className="truncate text-navy-foreground/80">{r.t}</span>
                <span className="font-display font-semibold text-gold">{r.v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-navy-foreground/10 bg-navy-foreground/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-navy-foreground/55">Quality</p>
            <p className="font-display text-lg font-bold text-navy-foreground">94/100</p>
          </div>
          <div className="rounded-lg border border-navy-foreground/10 bg-navy-foreground/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-navy-foreground/55">Streak</p>
            <p className="font-display text-lg font-bold text-navy-foreground">21 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- HowItWorks ------------------------------- */
function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      body: "Sign up, verify your identity, and connect your crypto wallet to receive earnings — onboarding takes under three minutes.",
    },
    {
      icon: FileText,
      title: "Write & Publish",
      body: "Create original content across any niche. Articles, stories, novels, tutorials, opinion pieces — all categories are welcome.",
    },
    {
      icon: CircleDollarSign,
      title: "Earn $WORD Tokens",
      body: "Our quality scoring engine evaluates your content and automatically deposits $WORD tokens straight to your connected wallet.",
    },
    {
      icon: Banknote,
      title: "Cash Out or Spend",
      body: "Convert tokens to real money on major exchanges, or spend them in our marketplace for premium writing tools and resources.",
    },
  ];
  return (
    <section id="how" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            From Words to Wealth in 4 Simple Steps
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <article
              key={s.title}
              className="group relative rounded-xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <span className="font-display text-5xl font-bold text-gold">
                0{i + 1}
              </span>
              <div className="mt-4 grid h-11 w-11 place-items-center rounded-lg bg-navy text-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-brand">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Live Stats ------------------------------- */
function useCountUp(target: number, duration = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function LiveStats() {
  const words = useCountUp(2.4);
  const niches = useCountUp(47);
  const countries = useCountUp(80);
  const stats = useMemo(
    () => [
      { v: `${words.toFixed(1)}M+`, l: "Words Written Today" },
      { v: "Growing Daily", l: "$WORD Tokens Distributed" },
      { v: `${Math.round(niches)}`, l: "Content Niches Supported" },
      { v: `${Math.round(countries)}+`, l: "Writers in Countries" },
    ],
    [words, niches, countries],
  );
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="border-l border-gold/30 pl-5">
            <p className="font-display text-3xl font-bold text-gold md:text-4xl">{s.v}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-navy-foreground/65">
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Niches --------------------------------- */
function Niches() {
  const niches = [
    "Technology", "Finance & Investing", "Health & Wellness", "Fiction & Novels",
    "Poetry", "Academic Research", "News & Journalism", "Travel",
    "Food & Lifestyle", "Business", "Self-Development", "Parenting",
    "Sports", "Environment", "History", "Science", "Politics",
    "Entertainment", "Education", "Philosophy", "Law", "Real Estate",
    "Crypto & Web3", "Marketing",
  ];
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Every category welcome
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Write About Anything. Earn For Everything.
          </h2>
          <p className="mt-4 text-lg text-slate-brand">
            ShibaWrite supports every writing category from short-form posts to full-length
            novels.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {niches.map((n, i) => (
            <span
              key={n}
              className={
                i % 5 === 0
                  ? "rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-navy shadow-gold"
                  : "rounded-full border border-navy/15 bg-card px-4 py-2 text-sm font-medium text-navy transition hover:border-gold/50 hover:text-gold"
              }
            >
              {n}
            </span>
          ))}
          <span className="rounded-full border border-dashed border-navy/30 px-4 py-2 text-sm font-medium italic text-slate-brand">
            and more…
          </span>
        </div>
        <p className="mt-8 text-center text-sm text-slate-brand">
          Don't see your niche?{" "}
          <span className="font-semibold text-navy">
            Every topic is welcome on ShibaWrite.
          </span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Reward System ------------------------------ */
function RewardSystem() {
  const [words, setWords] = useState(1500);
  const quality = 88;
  const earnings = Math.round((words / 100) * 8 * (quality / 100) * 10) / 10;
  return (
    <section className="bg-muted/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The Reward Engine
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            How $WORD Token Rewards Work
          </h2>
          <p className="mt-5 text-lg text-slate-brand">
            Your earnings are based on three factors:
          </p>
          <ul className="mt-6 space-y-4">
            {[
              { t: "Word Count", d: "Longer, detailed content earns more base rewards." },
              { t: "Quality Score", d: "Original, well-structured writing gets a quality multiplier." },
              { t: "Engagement", d: "Posts that get read, tipped, and shared earn bonus tokens." },
            ].map((f) => (
              <li key={f.t} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <p className="text-base text-navy">
                  <span className="font-display font-semibold">{f.t}</span>{" "}
                  <span className="text-slate-brand">— {f.d}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base font-medium text-navy">
            The better you write, the more you earn. It's that simple.
          </p>
          <Button className="mt-8 bg-navy text-navy-foreground shadow-elegant hover:bg-navy/90">
            See Full Reward Structure <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-gold opacity-15 blur-2xl" />
          <div className="relative rounded-2xl border border-gold/25 bg-card p-7 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-brand">
              Reward calculator
            </p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-navy">Word count</span>
                <span className="font-display text-lg font-bold text-navy">
                  {words.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={words}
                onChange={(e) => setWords(Number(e.target.value))}
                className="mt-3 w-full accent-[oklch(0.74_0.13_85)]"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-brand">
                <span>200</span>
                <span>5,000</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-navy">Quality score</span>
                <span className="font-display text-lg font-bold text-navy">{quality}/100</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-gold"
                  style={{ width: `${quality}%` }}
                />
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-gold/30 bg-gradient-to-br from-gold/15 to-transparent p-5 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-brand">
                Estimated earning
              </p>
              <p className="mt-1 font-display text-4xl font-bold text-navy">
                {earnings.toLocaleString()} <span className="text-gold">$WORD</span>
              </p>
              <p className="mt-1 text-xs text-slate-brand">per published post</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Marketplace Preview --------------------------- */
function MarketplacePreview() {
  const items = [
    { t: "Novel Writing Masterclass", p: "500", s: "@TopWriter", tag: "Course", i: BookOpen },
    { t: "SEO Content Templates Pack", p: "200", s: "@ContentPro", tag: "Templates", i: FileText },
    { t: "Research Bundle: Finance Topics", p: "350", s: "@FinanceWriter", tag: "Research", i: BookMarked },
    { t: "Premium Blog Theme Pack", p: "150", s: "@DesignWriter", tag: "Themes", i: Sparkles },
    { t: "Newsletter Sequence Templates", p: "250", s: "@EmailMaster", tag: "Templates", i: Send },
    { t: "Freelance Writing Contracts Kit", p: "180", s: "@LegalWriter", tag: "Toolkit", i: ShoppingBag },
  ];
  return (
    <section id="marketplace" className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              The Marketplace
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
              Spend, Sell, and Grow in the ShibaWrite Marketplace
            </h2>
          </div>
          <p className="max-w-md text-slate-brand">
            Use your earned $WORD tokens to buy premium resources — or sell your own
            digital products and earn even more.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.t}
              className="group overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="relative h-40 bg-gradient-hero">
                <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-lg bg-gradient-gold text-navy shadow-gold">
                  <p.i className="h-5 w-5" />
                </div>
                <span className="absolute right-5 top-5 rounded-full border border-gold/30 bg-navy/40 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
                  {p.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-navy">{p.t}</h3>
                <p className="mt-1 text-xs text-slate-brand">by {p.s}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-navy">
                    {p.p} <span className="text-sm text-gold">$WORD</span>
                  </span>
                  <Button variant="ghost" size="sm" className="text-navy hover:bg-muted">
                    View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-navy text-navy-foreground shadow-elegant hover:bg-navy/90">
            Explore Full Marketplace <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Token Section ----------------------------- */
function TokenSection() {
  const blocks = [
    { i: Coins, t: "Earn", d: "Write quality content and earn $WORD automatically to your wallet." },
    { i: ShoppingBag, t: "Spend", d: "Buy digital products, boost posts, tip creators, unlock premium features." },
    { i: ArrowLeftRight, t: "Trade", d: "Swap $WORD for USDC or ETH on Uniswap, or cash out to your bank via Transak." },
    { i: Vote, t: "Govern", d: "Stake $WORD to vote on platform decisions — reward rates, new features, treasury spending." },
  ];
  return (
    <section id="token" className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The Token
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            The $WORD Token —{" "}
            <span className="text-gold">Powering the ShibaWrite Economy</span>
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {blocks.map((b) => (
            <article
              key={b.t}
              className="rounded-xl border border-gold/20 bg-navy-foreground/[0.03] p-7 transition hover:border-gold/50"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-gradient-gold text-navy shadow-gold">
                  <b.i className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-semibold">{b.t}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-navy-foreground/75">{b.d}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-xl border border-gold/25 bg-navy-foreground/[0.04] p-5">
          <dl className="grid grid-cols-2 gap-y-4 text-sm md:grid-cols-4">
            {[
              ["Token Name", "WordContent"],
              ["Symbol", "$WORD"],
              ["Network", "Base"],
              ["Standard", "ERC-20"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-navy-foreground/55">{k}</dt>
                <dd className="mt-1 font-display text-lg font-bold text-gold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            View $WORD Token Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Testimonials ------------------------------- */
function Testimonials() {
  const quotes = [
    {
      q: "I published 3 articles last week and earned enough $WORD tokens to buy a premium SEO course from the marketplace. This platform actually pays you.",
      n: "Emeka O.",
      r: "Tech Writer, Lagos",
      flag: "🇳🇬",
    },
    {
      q: "I'm working on my novel and earning tokens chapter by chapter. ShibaWrite is the only platform that rewards me for the process, not just the end result.",
      n: "Priya S.",
      r: "Fiction Writer, Mumbai",
      flag: "🇮🇳",
    },
    {
      q: "I converted my $WORD tokens to USDC last month. Real money from writing. No middlemen. No waiting for a brand deal. Just my content and my wallet.",
      n: "Marco L.",
      r: "Finance Blogger, Manila",
      flag: "🇵🇭",
    },
  ];
  return (
    <section id="leaderboard" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Voices on ShibaWrite
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Writers Who Are Already Earning
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((t) => (
            <figure
              key={t.n}
              className="relative flex flex-col rounded-xl border border-border bg-card p-7 shadow-sm transition hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-lg leading-snug text-navy">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-navy font-display text-gold">
                  {t.n[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-navy">
                    {t.n} <span className="ml-1">{t.flag}</span>
                  </p>
                  <p className="text-xs text-slate-brand">{t.r}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Final CTA ------------------------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
          Your Words Have Value. <br />
          <span className="text-gold">Start Claiming It.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-foreground/80">
          Join ShibaWrite today. Write your first post and see your wallet grow. No
          experience required. All niches welcome.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            Create Free Account <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-navy-foreground/40 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            Read the Whitepaper
          </Button>
        </div>
        <p className="mt-6 text-xs uppercase tracking-wider text-navy-foreground/60">
          Free to join · No crypto knowledge required · Earn from your first post
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------- Footer --------------------------------- */
function Footer() {
  const cols = [
    {
      h: "Platform",
      l: ["Home", "How It Works", "Marketplace", "Leaderboard", "Blog"],
    },
    {
      h: "Token",
      l: ["$WORD Overview", "Tokenomics", "Staking", "Governance", "Whitepaper"],
    },
    {
      h: "Writers",
      l: ["Start Writing", "Writing Guidelines", "Reward Structure", "Top Writers", "Creator Marketplace"],
    },
    {
      h: "Company",
      l: ["About Us", "Contact", "Privacy Policy", "Terms of Service", "Smart Contract (Basescan)"],
    },
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
          <p>
            © 2025 ShibaWrite. $WORD token is a utility token on Base Network.
          </p>
          <p className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" /> Not financial advice. Built on Base ·
            <TrendingUp className="h-3.5 w-3.5" /> Powered by $WORD
          </p>
        </div>
      </div>
    </footer>
  );
}
