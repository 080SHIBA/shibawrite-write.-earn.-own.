import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-writer.jpg";
import { Button } from "@/components/ui/button";
import {
  PenLine,
  Coins,
  ShoppingBag,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Globe2,
  BookOpen,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShibaWrite — Write. Earn. Own Your Words." },
      {
        name: "description",
        content:
          "ShibaWrite is the content-to-earn platform where writers earn $WORD tokens for every story they publish. Built on Base. No middlemen.",
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
        <TrustBar />
        <HowItWorks />
        <TokenSection />
        <Marketplace />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <ShibaMark />
          <span className="font-display text-xl font-bold tracking-tight text-navy">
            ShibaWrite
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-brand md:flex">
          <a href="#how" className="transition hover:text-navy">How it works</a>
          <a href="#token" className="transition hover:text-navy">$WORD Token</a>
          <a href="#marketplace" className="transition hover:text-navy">Marketplace</a>
          <a href="#voices" className="transition hover:text-navy">Writers</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden text-navy hover:bg-muted md:inline-flex">
            Sign in
          </Button>
          <Button className="bg-navy text-navy-foreground shadow-elegant hover:bg-navy/90">
            Start writing
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
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-navy ring-2 ring-background" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-foreground/5 px-3 py-1 text-xs font-medium tracking-wide text-gold uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Built on Base · Powered by $WORD
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Write. Earn. <br />
            <span className="text-gold">Own Your Words.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/80">
            ShibaWrite is the professional content-to-earn platform where every paragraph
            becomes income. Publish your work, earn $WORD tokens, and convert your craft
            into real value — no middlemen, no gatekeepers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-gold text-navy shadow-gold hover:opacity-95"
            >
              Start earning today <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              Read the whitepaper
            </Button>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-navy-foreground/15 pt-8">
            {[
              { v: "42K+", l: "Writers earning" },
              { v: "$3.4M", l: "Paid in $WORD" },
              { v: "120+", l: "Countries" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl font-bold text-gold">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-navy-foreground/60">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-gold opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-elegant">
            <img
              src={heroImage}
              alt="Writer typing with glowing golden words rising from the screen"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-navy/80 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold">
                  <Coins className="h-4 w-4 text-navy" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-navy-foreground/60">
                    Latest payout
                  </p>
                  <p className="font-display text-sm font-semibold text-navy-foreground">
                    +1,284 $WORD
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = ["Base Network", "Uniswap", "Transak", "MoonPay", "Ethereum L2", "Coinbase"];
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-brand">
          Integrated with
        </p>
        {items.map((i) => (
          <span key={i} className="font-display text-lg font-semibold text-navy/70">
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: PenLine,
      title: "Publish your work",
      body: "Write across any niche — fiction, finance, research, journalism, tutorials. Your voice, your category.",
    },
    {
      icon: ShieldCheck,
      title: "Get scored by quality",
      body: "Our engine evaluates originality, depth, and craft. Stronger writing earns stronger payouts.",
    },
    {
      icon: Wallet,
      title: "Earn $WORD instantly",
      body: "Tokens land directly in your connected wallet — spend in the marketplace or convert to fiat.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          How it works
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          From your first paragraph to your first payout.
        </h2>
        <p className="mt-4 text-lg text-slate-brand">
          A clean three-step path designed for serious writers who want their work
          to compound into ownership.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <article
            key={s.title}
            className="group relative rounded-xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-navy text-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="font-display text-3xl font-bold text-muted-foreground/40">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-navy">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-brand">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TokenSection() {
  return (
    <section id="token" className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The $WORD Token
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            A currency built for <span className="text-gold">writers, not algorithms.</span>
          </h2>
          <p className="mt-4 text-lg text-navy-foreground/75">
            WordContent ($WORD) lives on the Base Network — fast, low-fee, and globally
            accessible. Stake it, spend it, trade it, or cash it out. Your craft, your call.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { i: TrendingUp, t: "Stake & earn", d: "Bonus rewards and governance votes for long-term holders." },
              { i: Coins, t: "Tip & boost", d: "Reward writers you love or amplify your own reach." },
              { i: Globe2, t: "Convert anywhere", d: "Off-ramp via Uniswap, Transak, MoonPay, or P2P." },
            ].map((b) => (
              <li key={b.t} className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gold/30 bg-navy-foreground/5 text-gold">
                  <b.i className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{b.t}</p>
                  <p className="text-sm text-navy-foreground/65">{b.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-gold opacity-15 blur-3xl" />
          <div className="relative rounded-2xl border border-gold/25 bg-gradient-to-br from-navy-foreground/[0.03] to-navy-foreground/[0.01] p-8 shadow-elegant">
            <div className="flex items-center justify-between border-b border-navy-foreground/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-navy shadow-gold">
                  <span className="font-display text-lg font-bold">W</span>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">WordContent</p>
                  <p className="text-xs uppercase tracking-wider text-navy-foreground/55">
                    $WORD · Base Network
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                +12.4%
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              {[
                { k: "Circulating", v: "184.2M" },
                { k: "Holders", v: "61,420" },
                { k: "Avg payout", v: "920 $WORD" },
                { k: "Staked", v: "37%" },
              ].map((m) => (
                <div key={m.k} className="rounded-lg border border-navy-foreground/10 bg-navy-foreground/[0.03] p-4">
                  <dt className="text-xs uppercase tracking-wider text-navy-foreground/55">
                    {m.k}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-gold">{m.v}</dd>
                </div>
              ))}
            </dl>
            <Button className="mt-6 w-full bg-gradient-gold text-navy hover:opacity-95">
              View token details
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marketplace() {
  const items = [
    { tag: "Templates", title: "Long-form Essay System", price: "240", icon: BookOpen },
    { tag: "Course", title: "Crafting the Modern Novel", price: "1,800", icon: PenLine },
    { tag: "Toolkit", title: "Research & Citation Pack", price: "560", icon: ShoppingBag },
  ];
  return (
    <section id="marketplace" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The Marketplace
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Spend what you earn on what makes you better.
          </h2>
        </div>
        <p className="max-w-md text-slate-brand">
          Templates, courses, research packs, newsletter kits and collab passes — all
          priced in $WORD. Sell your own products and earn directly.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.title}
            className="group overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="relative h-44 bg-gradient-hero">
              <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
              <div className="absolute left-6 top-6 grid h-12 w-12 place-items-center rounded-lg bg-gradient-gold text-navy shadow-gold">
                <p.icon className="h-5 w-5" />
              </div>
              <span className="absolute right-6 top-6 rounded-full border border-gold/30 bg-navy/40 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
                {p.tag}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold text-navy">{p.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-xl font-bold text-navy">
                  {p.price} <span className="text-sm text-gold">$WORD</span>
                </span>
                <Button variant="ghost" size="sm" className="text-navy hover:bg-muted">
                  View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "I wrote three essays in a weekend and earned more $WORD than my monthly Medium payout. ShibaWrite respects writers.",
      n: "Adaeze O.",
      r: "Essayist · Lagos",
    },
    {
      q: "Finally a platform where my research has a market. I sell methodology guides and get paid the same day.",
      n: "Rahul M.",
      r: "Academic writer · Bengaluru",
    },
  ];
  return (
    <section id="voices" className="bg-muted/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Voices on ShibaWrite
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          Writers from every continent are getting paid for their craft.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {quotes.map((t) => (
            <figure
              key={t.n}
              className="relative rounded-xl border border-border bg-card p-8 shadow-sm"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-gold/30" />
              <blockquote className="font-display text-xl leading-snug text-navy">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-navy font-display text-gold">
                  {t.n[0]}
                </div>
                <div>
                  <p className="font-semibold text-navy">{t.n}</p>
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

function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
          Your content is your <span className="text-gold">income.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-foreground/75">
          Join thousands of writers earning $WORD for the work they were going to do anyway.
          No middlemen. No gatekeepers. Just you, your words, and your wallet.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            Create your writer profile <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            Connect wallet
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <ShibaMark />
            <span className="font-display text-xl font-bold text-navy">ShibaWrite</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-slate-brand">
            The professional content-to-earn platform. Powered by $WORD on Base Network.
          </p>
        </div>
        {[
          { h: "Platform", l: ["How it works", "Marketplace", "Staking", "Boost"] },
          { h: "Resources", l: ["Whitepaper", "Docs", "Brand", "Support"] },
        ].map((c) => (
          <div key={c.h}>
            <p className="font-display text-sm font-semibold text-navy">{c.h}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-brand">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-navy">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-brand md:flex-row">
          <p>© {new Date().getFullYear()} ShibaWrite. All rights reserved.</p>
          <p>Built on Base · WordContent ($WORD)</p>
        </div>
      </div>
    </footer>
  );
}
