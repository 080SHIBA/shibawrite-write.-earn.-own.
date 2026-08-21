import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Cpu, Sparkles } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, REWARD_CONFIG, categoryMultiplier } from "@/lib/contracts";
import { submitPost } from "@/lib/posts.functions";
import { useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/write")({
  head: () => ({
    meta: [
      { title: "Write & Earn — ShibaWrite Editor" },
      {
        name: "description",
        content:
          "Draft your post with a live $WORD reward estimator, then submit it to the AI scoring oracle for an on-chain payout.",
      },
      { property: "og:title", content: "Write & Earn — ShibaWrite Editor" },
      {
        property: "og:description",
        content: "Live reward estimates while you write, AI scoring on submit, payout in $WORD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WritePage,
});

function WritePage() {
  const { token, loading } = useWriter();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !token) void navigate({ to: "/" });
  }, [loading, token, navigate]);

  const words = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);
  const base = words * REWARD_CONFIG.baseRate * categoryMultiplier(category);
  const valid = words >= REWARD_CONFIG.minWords && words <= REWARD_CONFIG.maxWords && title.trim().length > 3;

  const submit = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await submitPost({ data: { token, title, category, content } });
      const status = res.post.status;
      if (status === "approved") toast.success("Approved! Your reward unlocks in 5 minutes.");
      else if (status === "pending_review") toast.warning("Submitted for manual review.");
      else toast.error("Rejected by the originality oracle.");
      void navigate({ to: "/post/$id", params: { id: res.post.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeading
        eyebrow="Write & earn"
        title="Draft, estimate, submit"
        sub="The estimator below updates live. Final payout applies your AI quality multiplier (0.5x – 2.0x)."
      />
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="h-12 bg-surface-glass font-display text-lg"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  category === c.id
                    ? "border-electric bg-electric/15 text-electric"
                    : "border-border text-muted-foreground hover:border-electric/50"
                }`}
              >
                {c.label} · {c.multiplier}x
              </button>
            ))}
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            placeholder="Start writing. Minimum 200 words, maximum 3,500."
            className="bg-surface-glass leading-relaxed"
          />
        </div>

        <aside className="h-fit space-y-6 rounded-2xl border border-border bg-surface-glass p-7 lg:sticky lg:top-24">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Live estimate</p>
            <p className="mt-2 font-display text-4xl font-bold text-electric">
              {Math.round(base).toLocaleString()}
              <span className="ml-1 text-base">$WORD</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              at 1.0x quality — up to {Math.round(base * 2).toLocaleString()} $WORD at 2.0x
            </p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Words</dt>
              <dd className={words > REWARD_CONFIG.maxWords ? "text-destructive" : ""}>{words}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Base rate</dt>
              <dd>{REWARD_CONFIG.baseRate} / word</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Category multiplier</dt>
              <dd>{categoryMultiplier(category)}x</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Daily cap</dt>
              <dd>{REWARD_CONFIG.dailyCapWord.toLocaleString()} $WORD</dd>
            </div>
          </dl>
          <div className="rounded-xl border border-electric/30 bg-electric/5 p-4 text-xs text-muted-foreground">
            <Cpu className="mb-2 h-4 w-4 text-electric" />
            On submit, Winston AI checks originality and authenticity while Gemini grades quality. Scores
            are returned in seconds.
          </div>
          <Button
            disabled={!valid || submitting}
            onClick={submit}
            className="w-full bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {submitting ? "Scoring…" : "Submit for AI scoring"}
          </Button>
          {!valid && (
            <p className="text-xs text-muted-foreground">
              Add a title and between {REWARD_CONFIG.minWords} and {REWARD_CONFIG.maxWords} words to submit.
            </p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
