import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gem } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { myPosts } from "@/lib/posts.functions";
import { EXPLORER_URL, REWARD_CONFIG } from "@/lib/contracts";
import { useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/nfts")({
  head: () => ({
    meta: [
      { title: "Achievement Badges — ShibaWrite" },
      {
        name: "description",
        content:
          "Soulbound achievement NFTs minted from ShibaWrite posts scoring 90% or higher on AI quality.",
      },
      { property: "og:title", content: "Achievement Badges — ShibaWrite" },
      {
        property: "og:description",
        content: "Non-transferable proof of high-quality writing, minted on Base.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NftsPage,
});

function NftsPage() {
  const { token } = useWriter();
  const { data } = useQuery({
    queryKey: ["my-posts", token],
    enabled: !!token,
    queryFn: () => myPosts({ data: { token: token! } }),
  });

  const nfts = data?.nfts ?? [];
  const eligible = (data?.posts ?? []).filter(
    (p) =>
      Number(p.quality_score ?? 0) >= REWARD_CONFIG.nftQualityThreshold &&
      !nfts.some((n) => n.post_id === p.id),
  );

  return (
    <AppShell>
      <PageHeading
        eyebrow="Achievements"
        title="Soulbound proof of quality"
        sub="Any post scoring 90% or above can mint a non-transferable badge tied to your wallet forever."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {nfts.map((n) => (
          <article key={n.id} className="rounded-2xl border border-electric/40 bg-surface-glass p-7 shadow-glow">
            <Gem className="h-6 w-6 text-electric" />
            <p className="mt-5 font-display text-xl font-semibold">Quality {Math.round(Number(n.quality_score))}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Minted {new Date(n.minted_at).toLocaleDateString()}
            </p>
            {n.tx_hash && (
              <a
                href={`${EXPLORER_URL}/tx/${n.tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-xs text-electric underline-offset-4 hover:underline"
              >
                View on Basescan
              </a>
            )}
          </article>
        ))}
        {nfts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No badges yet. Score 90%+ on a post to unlock your first mint.
          </div>
        )}
      </div>

      {eligible.length > 0 && (
        <>
          <h2 className="mt-14 font-display text-2xl font-semibold">Ready to mint</h2>
          <div className="mt-5 space-y-3">
            {eligible.map((p) => (
              <Link
                key={p.id}
                to="/post/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface-glass p-6 transition hover:border-electric/50"
              >
                <span className="font-display text-lg">{p.title}</span>
                <span className="text-sm text-electric">
                  {Math.round(Number(p.quality_score ?? 0))}% quality →
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
