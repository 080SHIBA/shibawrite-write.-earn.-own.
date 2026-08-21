import { createFileRoute } from "@tanstack/react-router";
import { Download, Network, ShieldCheck, Wallet } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { ACTIVE_CHAIN, EXPLORER_URL } from "@/lib/contracts";

export const Route = createFileRoute("/wallet-setup")({
  head: () => ({
    meta: [
      { title: "Wallet Setup Guide — ShibaWrite on Base" },
      {
        name: "description",
        content:
          "Install MetaMask or Coinbase Wallet, add the Base network, and connect to ShibaWrite in under two minutes.",
      },
      { property: "og:title", content: "Wallet Setup Guide — ShibaWrite on Base" },
      {
        property: "og:description",
        content: "A two-minute guide to getting a Base-ready wallet for earning $WORD.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WalletSetupPage,
});

const steps = [
  {
    i: Download,
    t: "Install a wallet",
    d: "MetaMask (browser extension) or Coinbase Wallet. Both are free and take about a minute to set up.",
  },
  {
    i: ShieldCheck,
    t: "Back up your recovery phrase",
    d: "Write the 12 words on paper and store them offline. Nobody at ShibaWrite will ever ask for them.",
  },
  {
    i: Network,
    t: `Add ${ACTIVE_CHAIN.name}`,
    d: `Chain ID ${ACTIVE_CHAIN.id} · RPC ${ACTIVE_CHAIN.rpcUrls.default.http[0]} · Explorer ${EXPLORER_URL}. Most wallets add it automatically when you connect.`,
  },
  {
    i: Wallet,
    t: "Connect to ShibaWrite",
    d: "Hit Connect Wallet, pick your provider, and sign the free message. No transaction, no gas, no custody.",
  },
];

function WalletSetupPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Getting started"
        title="Set up a wallet for Base"
        sub="Your wallet is your ShibaWrite account. Here's the whole setup, start to finish."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((s, idx) => (
          <article key={s.t} className="rounded-2xl border border-border bg-surface-glass p-7">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-electric-foreground shadow-gold">
                <s.i className="h-5 w-5" />
              </span>
              <span className="font-display text-sm text-muted-foreground">0{idx + 1}</span>
            </div>
            <h2 className="mt-5 font-display text-lg font-semibold">{s.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
