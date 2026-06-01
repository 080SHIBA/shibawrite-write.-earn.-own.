import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  UserPlus,
  PenLine,
  Coins,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  KeyRound,
  Network,
  LinkIcon,
  Rocket,
  Bot,
  FileSearch,
  Users,
  Lock,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader, SiteFooter } from "@/components/site/branding";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ShibaWrite Works — From Writing to Earning" },
      {
        name: "description",
        content:
          "Learn exactly how ShibaWrite pays you in $WORD tokens for publishing content. Step-by-step guide to earning real cryptocurrency from your writing.",
      },
      { property: "og:title", content: "How ShibaWrite Works — From Writing to Earning" },
      {
        property: "og:description",
        content:
          "Step-by-step guide to earning $WORD tokens for the content you publish on ShibaWrite.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero />
        <Steps />
        <Calculator />
        <AntiSpam />
        <WalletGuide />
        <FAQ />
        <BottomCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* --------------------------------- Hero ---------------------------------- */
function PageHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-foreground/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold">
          <Sparkles className="h-3.5 w-3.5" /> How ShibaWrite Works
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
          Everything You Need to Know About{" "}
          <span className="text-gold">Earning $WORD</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-foreground/75">
          ShibaWrite is simple to use and powerful in what it delivers. Here's
          exactly how the platform turns your writing into real income.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button className="bg-gradient-gold text-navy shadow-gold hover:opacity-95">
            Create Your Free Account <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-gold/60 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
          >
            <Wallet className="mr-1.5 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Steps --------------------------------- */
type Step = {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  mock: React.ReactNode;
};

const STEPS: Step[] = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create Your Account & Connect Wallet",
    body:
      "Sign up with your email. Complete a quick writer profile (name, bio, writing niches). Connect your Ethereum-compatible wallet (MetaMask, Coinbase Wallet, or any WalletConnect wallet). Your wallet is your bank account on ShibaWrite — all $WORD tokens are sent directly there. No wallet? No problem. We have a built-in guide to set one up in 3 minutes.",
    mock: <MockSignup />,
  },
  {
    num: "02",
    icon: PenLine,
    title: "Choose Your Niche & Write",
    body:
      "Select from 47+ content categories or create across multiple niches. Use our built-in professional editor. Write articles, blog posts, opinion pieces, research papers, short stories, novel chapters, poetry, tutorials, news reports — any written format qualifies. Minimum 200 words per post to qualify for rewards. The longer and more detailed, the higher your base reward.",
    mock: <MockEditor />,
  },
  {
    num: "03",
    icon: Coins,
    title: "Content Scoring & Token Issuance",
    body:
      "After you publish, our Quality Scoring Engine evaluates your content on three dimensions: Originality Score (0-100), Quality Score (0-100), and a Word Count Multiplier. Your final score determines your $WORD reward. Scores and rewards are transparent — you can see exactly why you earned what you earned. Tokens are deposited to your wallet within minutes of approval.",
    mock: <MockScoring />,
  },
  {
    num: "04",
    icon: Wallet,
    title: "Use, Spend, or Cash Out",
    body:
      "Your $WORD tokens are real cryptocurrency. Spend them in the marketplace, tip other writers, boost your posts on the homepage feed, stake for bonus rewards (30/90/180 days), or cash out — swap to USDC or ETH on Uniswap (Base) and withdraw to your bank via Transak, directly in the platform.",
    mock: <MockWalletActions />,
  },
];

function Steps() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            The Process
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            From your first word to your first payout
          </h2>
        </div>
        <div className="mt-20 space-y-24">
          {STEPS.map((s, i) => (
            <StepRow key={s.num} step={s} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepRow({ step, flip }: { step: Step; flip: boolean }) {
  const Icon = step.icon;
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className={flip ? "lg:order-2" : ""}>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-navy text-gold shadow-elegant">
            <Icon className="h-6 w-6" />
          </div>
          <span className="font-display text-5xl font-bold text-gold/30">
            {step.num}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl font-bold md:text-4xl">
          {step.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {step.body}
        </p>
      </div>
      <div className={flip ? "lg:order-1" : ""}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
          {step.mock}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Mocks --------------------------------- */
function MockSignup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-navy">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Writer Profile</p>
          <p className="text-xs text-muted-foreground">Name · Bio · Niches</p>
        </div>
        <CheckCircle2 className="ml-auto h-5 w-5 text-gold" />
      </div>
      {["MetaMask", "Coinbase Wallet", "WalletConnect"].map((w, i) => (
        <div
          key={w}
          className="flex items-center justify-between rounded-lg border border-border bg-background p-3 text-sm"
        >
          <span className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gold" /> {w}
          </span>
          <span className={i === 0 ? "text-xs font-semibold text-gold" : "text-xs text-muted-foreground"}>
            {i === 0 ? "Connected" : "Available"}
          </span>
        </div>
      ))}
    </div>
  );
}

function MockEditor() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <p className="font-display text-sm font-semibold">New Post</p>
        <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold">
          Tech · Finance
        </span>
      </div>
      <div className="font-display text-lg font-bold">
        Why On-Chain Publishing Changes Everything
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="h-2 w-full rounded bg-muted" />
        <div className="h-2 w-11/12 rounded bg-muted" />
        <div className="h-2 w-10/12 rounded bg-muted" />
        <div className="h-2 w-9/12 rounded bg-muted" />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">1,284 words · 6 min read</span>
        <span className="font-semibold text-gold">Eligible ✓</span>
      </div>
    </div>
  );
}

function MockScoring() {
  const rows = [
    { l: "Originality", v: 96 },
    { l: "Quality", v: 88 },
    { l: "Word Count", v: 78 },
  ];
  return (
    <div className="space-y-4">
      <p className="font-display text-sm font-semibold">Quality Scoring Engine</p>
      {rows.map((r) => (
        <div key={r.l}>
          <div className="flex justify-between text-sm">
            <span>{r.l}</span>
            <span className="font-semibold text-gold">{r.v}/100</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-gradient-gold"
              style={{ width: `${r.v}%` }}
            />
          </div>
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-navy p-4 text-navy-foreground">
        <span className="text-sm">Reward issued</span>
        <span className="font-display text-xl font-bold text-gold">
          +1,284 $WORD
        </span>
      </div>
    </div>
  );
}

function MockWalletActions() {
  const actions = [
    { i: Sparkles, l: "Spend in Marketplace" },
    { i: Coins, l: "Tip Other Writers" },
    { i: Rocket, l: "Boost Your Posts" },
    { i: Lock, l: "Stake 30 / 90 / 180 days" },
    { i: ArrowRight, l: "Cash Out via Uniswap + Transak" },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-navy p-4 text-navy-foreground">
        <p className="text-xs uppercase tracking-wide text-navy-foreground/60">
          Wallet Balance
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-gold">
          12,480 <span className="text-base text-navy-foreground/70">$WORD</span>
        </p>
      </div>
      {actions.map((a) => (
        <div
          key={a.l}
          className="flex items-center justify-between rounded-lg border border-border bg-background p-3 text-sm"
        >
          <span className="flex items-center gap-2.5">
            <a.i className="h-4 w-4 text-gold" /> {a.l}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Calculator ------------------------------- */
function Calculator() {
  const [posts, setPosts] = useState("3");
  const [words, setWords] = useState("1000-2000");
  const [quality, setQuality] = useState("Intermediate");

  const earnings = useMemo(() => {
    const p = posts === "10+" ? 12 : parseInt(posts, 10);
    const wMap: Record<string, number> = {
      "200-500": 350,
      "500-1000": 750,
      "1000-2000": 1500,
      "2000+": 2800,
    };
    const qMap: Record<string, number> = {
      Beginner: 0.6,
      Intermediate: 1,
      Expert: 1.5,
    };
    const w = wMap[words];
    const q = qMap[quality];
    return Math.round((p * (w / 100) * 8 * q) / 5) * 5;
  }, [posts, words, quality]);

  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            Reward Calculator
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Estimate Your Earnings
          </h2>
        </div>
        <div className="mt-12 grid gap-8 rounded-2xl border border-border bg-card p-8 shadow-elegant md:grid-cols-2">
          <div className="space-y-5">
            <Field label="Posts per week">
              <Select value={posts} onValueChange={setPosts}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "5", "10+"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Average word count per post">
              <Select value={words} onValueChange={setWords}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["200-500", "500-1000", "1000-2000", "2000+"].map((v) => (
                    <SelectItem key={v} value={v}>{v} words</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Quality level">
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Expert"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-navy p-8 text-navy-foreground">
            <p className="text-sm uppercase tracking-wide text-navy-foreground/60">
              Estimated weekly earnings
            </p>
            <p className="mt-3 font-display text-5xl font-bold text-gold md:text-6xl">
              {earnings.toLocaleString()}
            </p>
            <p className="mt-1 font-display text-lg font-semibold">$WORD / week</p>
            <p className="mt-6 text-xs text-navy-foreground/60">
              Estimates based on current reward rates. Actual earnings vary
              based on content quality and platform growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

/* ------------------------------- Anti-spam ------------------------------- */
function AntiSpam() {
  const items = [
    { i: Bot, t: "AI Content Detection", d: "Mass AI-generated spam is flagged and rejected before rewards are issued." },
    { i: FileSearch, t: "Plagiarism Checking", d: "Copied content is detected and does not earn $WORD rewards." },
    { i: Users, t: "Human Review", d: "Our moderation team spot-checks flagged content for fairness and accuracy." },
    { i: Lock, t: "Stake-to-Post (Coming Soon)", d: "Higher-tier publishing requires staked tokens — slashed for violations." },
    { i: Flag, t: "Community Flagging", d: "Readers can flag low-quality content for moderator review." },
  ];
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Integrity First
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            We Reward Real Writers, Not Bots
          </h2>
          <p className="mt-4 text-muted-foreground">
            ShibaWrite uses a multi-layer protection system to ensure only
            genuine, quality content earns $WORD. We protect the integrity of
            every token earned.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.t}
              className="group rounded-xl border border-border bg-card p-6 transition hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-navy text-gold">
                <it.i className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold">{it.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Wallet Guide ------------------------------ */
function WalletGuide() {
  const steps = [
    { i: Download, t: "Download MetaMask", d: "Install the MetaMask browser extension or mobile app from the official site." },
    { i: KeyRound, t: "Create a wallet & save your seed phrase", d: "Generate a new wallet. Write down your 12-word seed phrase and store it offline." },
    { i: Network, t: "Add Base Network", d: "Use our one-click button to add Base (Ethereum L2) to MetaMask." },
    { i: LinkIcon, t: "Connect to ShibaWrite", d: "Click Connect Wallet on ShibaWrite and approve the connection." },
    { i: Rocket, t: "Start earning", d: "Tokens arrive automatically in your wallet after each approved post." },
  ];
  return (
    <section className="bg-navy py-24 text-navy-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            Wallet Setup
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Don't Have a Crypto Wallet? Get One in 3 Minutes
          </h2>
          <p className="mt-4 text-navy-foreground/70">
            Follow these five simple steps. No prior crypto experience required.
          </p>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li
              key={s.t}
              className="relative rounded-xl border border-gold/20 bg-navy-foreground/5 p-5"
            >
              <span className="font-display text-3xl font-bold text-gold/40">
                0{i + 1}
              </span>
              <s.i className="mt-2 h-5 w-5 text-gold" />
              <p className="mt-3 font-display text-base font-semibold">{s.t}</p>
              <p className="mt-1.5 text-sm text-navy-foreground/70">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */
const FAQS = [
  { q: "Is ShibaWrite free to join?", a: "Yes. Creating an account and publishing content is completely free." },
  { q: "Do I need crypto experience to use ShibaWrite?", a: "No. If you can set up a MetaMask wallet (takes 3 minutes), you can earn $WORD tokens. We have step-by-step guides for everything." },
  { q: "How quickly do I receive tokens after publishing?", a: "Approved posts receive token rewards within 15–30 minutes of publication." },
  { q: "Can I write in any niche or topic?", a: "Yes. ShibaWrite supports 47+ content categories including fiction, novels, academic writing, news, tech, finance, lifestyle, poetry, and more." },
  { q: "What is the minimum I can earn per post?", a: "Any post over 200 words that passes quality checks earns at least a base $WORD reward. Higher word count and quality score = higher earnings." },
  { q: "Can I sell my own products on the marketplace?", a: "Yes. Any verified writer can list digital products (ebooks, courses, templates, guides) and receive $WORD tokens from buyers." },
  { q: "How do I convert $WORD to real money?", a: "Through Uniswap (swap to USDC/ETH), then via Transak to withdraw to your bank account — all accessible directly from your ShibaWrite dashboard." },
];

function FAQ() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Most Common Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="border-border">
              <AccordionTrigger className="text-left font-display text-base font-semibold hover:text-gold hover:no-underline md:text-lg">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ----------------------------------- */
function BottomCTA() {
  return (
    <section className="bg-gradient-hero py-24 text-navy-foreground">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Ready to Start <span className="text-gold">Earning?</span>
        </h2>
        <p className="mt-5 text-lg text-navy-foreground/75">
          Join thousands of writers turning their words into real income on
          ShibaWrite.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="bg-gradient-gold text-navy shadow-gold hover:opacity-95"
          >
            Create Your Free Account <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
