import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/contracts";
import { saveProfile } from "@/lib/auth.functions";
import { shortAddress, useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Your Writer Profile — ShibaWrite" },
      {
        name: "description",
        content:
          "Set up your ShibaWrite writer profile: display name, bio and content niches. Takes under a minute, no email required.",
      },
      { property: "og:title", content: "Create Your Writer Profile — ShibaWrite" },
      {
        property: "og:description",
        content: "Register as a ShibaWrite creator and start earning $WORD on Base.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { token, writer, loading, setWriter } = useWriter();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [niches, setNiches] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (writer?.name) setName(writer.name);
  }, [writer]);

  useEffect(() => {
    if (!loading && !token) void navigate({ to: "/" });
  }, [loading, token, navigate]);

  const toggle = (id: string) =>
    setNiches((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id].slice(0, 5)));

  const submit = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await saveProfile({ data: { token, name, bio, niches } });
      setWriter(res.writer as never);
      toast.success("Welcome to ShibaWrite — your profile is live.");
      void navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeading
        eyebrow="Step 2 of 2"
        title="Create your writer profile"
        sub="Your wallet is your login. This profile is what readers and buyers see across the platform."
      />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 rounded-2xl border border-border bg-surface-glass p-7">
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              Display name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Satoshi Writes"
              className="mt-2 bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="bio">
              Short bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="What do you write about, and why should readers trust you?"
              className="mt-2 bg-background"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Content niches (up to 5)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    niches.includes(c.id)
                      ? "border-electric bg-electric/15 text-electric"
                      : "border-border text-muted-foreground hover:border-electric/50"
                  }`}
                >
                  {c.label} · {c.multiplier}x
                </button>
              ))}
            </div>
          </div>
          <Button
            disabled={saving || name.trim().length < 2}
            onClick={submit}
            className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
          >
            {saving ? "Saving…" : "Create profile"}
          </Button>
        </div>

        <aside className="rounded-2xl border border-border bg-surface-glass p-7">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Signed in wallet</p>
          <p className="mt-2 font-display text-lg text-electric">
            {shortAddress(writer?.wallet_address)}
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>No email, no password, no custody — your wallet is the account.</li>
            <li>You start at New Writer tier. Five approved posts unlock selling.</li>
            <li>Your niche choices set the reward multiplier on published work.</li>
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
