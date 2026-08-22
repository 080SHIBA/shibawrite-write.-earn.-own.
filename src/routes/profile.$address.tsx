import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gem, Trophy } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { publicProfile } from "@/lib/posts.functions";
import { TIER_LABEL } from "@/lib/contracts";
import { shortAddress } from "@/hooks/useWriter";

export const Route = createFileRoute("/profile/$address")({
  head: () => ({
    meta: [
      { title: "Writer Profile — ShibaWrite" },
      {
        name: "description",
        content:
          "Public ShibaWrite writer profile: published posts, AI quality scores, tier and soulbound achievement badges.",
      },
      { property: "og:title", content: "Writer Profile — ShibaWrite" },
      {
        property: "og:description",
        content: "Published work, quality scores and achievements for a ShibaWrite creator.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { address } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["profile", address],
    queryFn: () => publicProfile({ data: { address } }),
  });

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading profile…</p>
      </AppShell>
    );
  }

  if (!data?.writer) {
    return (
      <AppShell>
        <PageHeading eyebrow="Profile" title="No writer at this address" />
      </AppShell>
    );
  }

  const w = data.writer;

  return (
    <AppShell>
      <PageHeading
        eyebrow={shortAddress(w.wallet_address)}
        title={w.name || "Anonymous writer"}
        sub={w.bio || undefined}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface-glass p-6">
          <Trophy className="h-5 w-5 text-electric" />
          <p className="mt-4 font-display text-2xl font-bold">{TIER_LABEL[w.tier] ?? "New Writer"}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Tier</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-glass p-6">
          <p className="font-display text-2xl font-bold">{w.approved_posts}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Approved posts</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-glass p-6">
          <p className="font-display text-2xl font-bold text-electric">
            {Number(w.total_earned).toLocaleString()} $WORD
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Lifetime earned</p>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold">Published work</h2>
      <div className="mt-5 space-y-3">
        {data.posts.map((p) => (
          <article key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface-glass p-6">
            <div>
              <p className="font-display text-lg">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.category} · {p.word_count} words · {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm text-electric">{Math.round(Number(p.quality_score ?? 0))}%</span>
          </article>
        ))}
        {data.posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No published posts yet.</p>
        )}
      </div>

      {data.nfts.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl font-semibold">Achievements</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {data.nfts.map((n) => (
              <span
                key={n.id}
                className="flex items-center gap-2 rounded-full border border-electric/40 px-4 py-2 text-sm text-electric"
              >
                <Gem className="h-4 w-4" /> {Math.round(Number(n.quality_score))}% quality
              </span>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
