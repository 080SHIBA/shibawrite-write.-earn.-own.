import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { stringToHex } from "viem";
import { Gem, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { mintAchievement, myPosts } from "@/lib/posts.functions";
import { shibaWriteAbi } from "@/lib/abi/shibawrite";
import { REWARD_CONFIG, SHIBAWRITE_CONTRACT } from "@/lib/contracts";
import { useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/post/$id")({
  head: () => ({
    meta: [
      { title: "Post Score & Reward — ShibaWrite" },
      {
        name: "description",
        content:
          "See the AI originality, authenticity and quality breakdown behind your ShibaWrite post and its $WORD reward.",
      },
      { property: "og:title", content: "Post Score & Reward — ShibaWrite" },
      {
        property: "og:description",
        content: "The full AI scoring breakdown behind a ShibaWrite reward.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PostPage,
});

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display text-electric">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function PostPage() {
  const { id } = Route.useParams();
  const { token } = useWriter();
  const { writeContractAsync } = useWriteContract();
  const [minting, setMinting] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["my-posts", token],
    enabled: !!token,
    queryFn: () => myPosts({ data: { token: token! } }),
  });

  const post = data?.posts.find((p) => p.id === id);
  const nft = data?.nfts.find((n) => n.post_id === id);

  const mint = async () => {
    if (!token || !post) return;
    setMinting(true);
    try {
      const hash = await writeContractAsync({
        address: SHIBAWRITE_CONTRACT,
        abi: shibaWriteAbi,
        functionName: "mintAchievement",
        args: [
          stringToHex(post.id.replace(/-/g, "").slice(0, 32), { size: 32 }),
          BigInt(Math.round(Number(post.quality_score ?? 0))),
        ],
      });
      await mintAchievement({ data: { token, postId: post.id, txHash: hash } });
      toast.success("Soulbound achievement minted.");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Mint failed.");
    } finally {
      setMinting(false);
    }
  };

  if (!token) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Connect your wallet to view this post.</p>
      </AppShell>
    );
  }

  if (!post) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading post…</p>
      </AppShell>
    );
  }

  const eligible =
    Number(post.quality_score ?? 0) >= REWARD_CONFIG.nftQualityThreshold && !nft;

  return (
    <AppShell>
      <Link to="/dashboard" className="text-xs text-electric underline-offset-4 hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-2xl border border-border bg-surface-glass p-8">
          <span className="rounded-full border border-electric/40 px-3 py-1 text-[10px] uppercase tracking-wider text-electric">
            {post.status.replace("_", " ")}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">{post.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {post.word_count} words · {post.category} · {new Date(post.created_at).toLocaleString()}
          </p>
          <div className="mt-7 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {post.content}
          </div>
        </article>

        <aside className="h-fit space-y-7 rounded-2xl border border-border bg-surface-glass p-7">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reward</p>
            <p className="mt-2 font-display text-3xl font-bold text-electric">
              {Number(post.reward_amount ?? 0).toLocaleString()} $WORD
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {post.category_multiplier}x category · {post.quality_multiplier}x quality
            </p>
          </div>
          <div className="space-y-4">
            <Bar label="Originality" value={Number(post.originality_score ?? 0)} />
            <Bar label="Quality" value={Number(post.quality_score ?? 0)} />
            <Bar label="Authenticity" value={Number(post.authenticity_score ?? 0)} />
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mb-2 h-4 w-4 text-electric" />
            {post.ai_feedback}
          </div>
          {nft ? (
            <p className="flex items-center gap-2 text-sm text-electric">
              <Gem className="h-4 w-4" /> Achievement badge minted
            </p>
          ) : (
            <Button
              disabled={!eligible || minting}
              onClick={mint}
              className="w-full bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
            >
              <Gem className="mr-1.5 h-4 w-4" />
              {minting ? "Minting…" : eligible ? "Mint achievement NFT" : "Needs 90%+ quality to mint"}
            </Button>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
