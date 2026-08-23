import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import { Coins, PenLine, Timer, Trophy, Wallet } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { claimReward, myPosts } from "@/lib/posts.functions";
import { shibaWriteAbi } from "@/lib/abi/shibawrite";
import { pendingRewardIdForPost } from "@/lib/chain";
import { EXPLORER_URL, SHIBAWRITE_CONTRACT, TIER_LABEL } from "@/lib/contracts";
import { shortAddress, useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Writer Dashboard — ShibaWrite" },
      {
        name: "description",
        content:
          "Track your $WORD earnings, AI scores, claimable rewards and writer tier progress in one place.",
      },
      { property: "og:title", content: "Writer Dashboard — ShibaWrite" },
      {
        property: "og:description",
        content: "Your ShibaWrite earnings, posts and claimable $WORD rewards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const STATUS_STYLE: Record<string, string> = {
  approved: "border-electric/50 text-electric",
  claimed: "border-emerald-500/50 text-emerald-400",
  pending_review: "border-amber-500/50 text-amber-400",
  rejected: "border-destructive/50 text-destructive",
  draft: "border-border text-muted-foreground",
};

function DashboardPage() {
  const { token, writer, loading } = useWriter();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!loading && !token) void navigate({ to: "/" });
    if (!loading && writer && !writer.name) void navigate({ to: "/register" });
  }, [loading, token, writer, navigate]);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["my-posts", token],
    enabled: !!token,
    queryFn: () => myPosts({ data: { token: token! } }),
  });

  const posts = data?.posts ?? [];
  const claimable = posts.filter(
    (p) => p.status === "approved" && p.claim_available_at && new Date(p.claim_available_at).getTime() <= now,
  );
  const pending = posts.filter(
    (p) => p.status === "approved" && p.claim_available_at && new Date(p.claim_available_at).getTime() > now,
  );
  const lifetime = Number(writer?.total_earned ?? 0);

  const claim = async (postId: string) => {
    if (!address) return;
    setClaiming(postId);
    try {
      const rewardId = await pendingRewardIdForPost(address, postId);
      if (rewardId === null)
        throw new Error("No claimable on-chain reward found for this post yet.");
      const hash = await writeContractAsync({
        address: SHIBAWRITE_CONTRACT,
        abi: shibaWriteAbi,
        functionName: "claimReward",
        args: [rewardId],
      });
      await claimReward({ data: { token: token!, postId, txHash: hash } });
      toast.success("Reward claimed on-chain.");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Claim failed.");
    } finally {
      setClaiming(null);
    }
  };

  const stats = [
    { i: Coins, l: "Lifetime earned", v: `${lifetime.toLocaleString()} $WORD` },
    {
      i: Wallet,
      l: "Claimable now",
      v: `${claimable.reduce((s, p) => s + Number(p.reward_amount ?? 0), 0).toLocaleString()} $WORD`,
    },
    { i: Timer, l: "On hold", v: `${pending.length} post${pending.length === 1 ? "" : "s"}` },
    { i: Trophy, l: "Tier", v: TIER_LABEL[writer?.tier ?? "new"] ?? "New Writer" },
  ];

  return (
    <AppShell>
      <PageHeading
        eyebrow={shortAddress(writer?.wallet_address)}
        title={`Welcome back, ${writer?.name || "writer"}`}
        sub="Everything you've published, scored and earned — settled on Base."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-surface-glass p-6">
            <s.i className="h-5 w-5 text-electric" />
            <p className="mt-4 font-display text-2xl font-bold">{s.v}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">Your posts</h2>
        <Button asChild className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95">
          <Link to="/write">
            <PenLine className="mr-1.5 h-4 w-4" /> Write a new post
          </Link>
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading your posts…</p>}
        {!isLoading && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No posts yet. Your first approved post unlocks your earning history.
          </div>
        )}
        {posts.map((p) => {
          const unlockIn = p.claim_available_at
            ? Math.max(0, new Date(p.claim_available_at).getTime() - now)
            : 0;
          return (
            <article
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface-glass p-6"
            >
              <div className="min-w-0">
                <Link to="/post/$id" params={{ id: p.id }} className="font-display text-lg font-semibold hover:text-electric">
                  {p.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.word_count} words · quality {Math.round(Number(p.quality_score ?? 0))}% · originality{" "}
                  {Math.round(Number(p.originality_score ?? 0))}%
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                    STATUS_STYLE[p.status] ?? "border-border"
                  }`}
                >
                  {p.status.replace("_", " ")}
                </span>
                <span className="font-display text-lg text-electric">
                  {Number(p.reward_amount ?? 0).toLocaleString()} $WORD
                </span>
                {p.status === "approved" && unlockIn > 0 && (
                  <span className="text-xs text-muted-foreground">
                    unlocks in {Math.floor(unlockIn / 60000)}:
                    {String(Math.floor((unlockIn % 60000) / 1000)).padStart(2, "0")}
                  </span>
                )}
                {p.status === "approved" && unlockIn === 0 && (
                  <Button
                    size="sm"
                    disabled={claiming === p.id}
                    onClick={() => claim(p.id, Number(p.reward_amount ?? 0))}
                    className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
                  >
                    {claiming === p.id ? "Claiming…" : "Claim"}
                  </Button>
                )}
                {p.status === "claimed" && p.claim_tx && (
                  <a
                    href={`${EXPLORER_URL}/tx/${p.claim_tx}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-electric underline-offset-4 hover:underline"
                  >
                    View tx
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
