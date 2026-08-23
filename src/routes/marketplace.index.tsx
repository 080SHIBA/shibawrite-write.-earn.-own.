import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Plus, ShoppingBag } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { createProduct, listProducts, myOrders, settleOrder } from "@/lib/market.functions";
import { marketplaceAbi } from "@/lib/abi/marketplace";
import { productIdFromTx } from "@/lib/chain";
import { MARKETPLACE_CONTRACT } from "@/lib/contracts";
import { CATEGORIES, REWARD_CONFIG } from "@/lib/contracts";
import { shortAddress, useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/marketplace/")({
  head: () => ({
    meta: [
      { title: "Creator Marketplace — Buy & Sell with $WORD" },
      {
        name: "description",
        content:
          "Courses, templates, research packs and premium writing, priced in $WORD and protected by a one-hour escrow with human dispute review.",
      },
      { property: "og:title", content: "Creator Marketplace — Buy & Sell with $WORD" },
      {
        property: "og:description",
        content: "Escrow-protected digital products from verified ShibaWrite creators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketplacePage,
});

function SellDialog({ onDone }: { onDone: () => void }) {
  const { token, writer } = useWriter();
  const { writeContractAsync } = useWriteContract();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [price, setPrice] = useState(500);
  const [saving, setSaving] = useState(false);
  const locked = !writer || writer.tier === "new";

  const submit = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const hash = await writeContractAsync({
        address: MARKETPLACE_CONTRACT,
        abi: marketplaceAbi,
        functionName: "listProduct",
        args: [parseUnits(String(Math.max(1, Math.round(price))), 18), title.trim()],
      });
      const chainProductId = await productIdFromTx(hash);
      await createProduct({
        data: {
          token,
          title,
          description,
          category,
          priceWord: price,
          chainProductId: chainProductId === undefined ? null : Number(chainProductId),
        },
      });
      toast.success("Listing published.");
      setOpen(false);
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create listing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95">
          <Plus className="mr-1.5 h-4 w-4" /> List a product
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">List a digital product</DialogTitle>
          <DialogDescription>
            Verified Writers and above can sell. Buyers pay in $WORD, held in escrow for one hour.
          </DialogDescription>
        </DialogHeader>
        {locked ? (
          <p className="flex items-center gap-2 rounded-xl border border-border bg-surface-glass p-4 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-electric" /> Reach 5 approved posts to unlock selling.
          </p>
        ) : (
          <div className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="bg-background" />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What does the buyer get?"
              className="bg-background"
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    category === c.id ? "border-electric text-electric" : "border-border text-muted-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm text-muted-foreground" htmlFor="price">
                Price in $WORD
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 bg-background"
              />
            </div>
            <Button
              disabled={saving || title.trim().length < 3}
              onClick={submit}
              className="w-full bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
            >
              {saving ? "Publishing…" : "Publish listing"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MarketplacePage() {
  const { token } = useWriter();
  const { writeContractAsync } = useWriteContract();
  const { data, refetch } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const orders = useQuery({
    queryKey: ["orders", token],
    enabled: !!token,
    queryFn: () => myOrders({ data: { token: token! } }),
  });

  const sellerName = (id: string) =>
    data?.writers.find((w) => w.id === id)?.name ||
    shortAddress(data?.writers.find((w) => w.id === id)?.wallet_address);

  const settle = async (
    orderId: string,
    action: "release" | "dispute",
    chainPurchaseId: number | null,
  ) => {
    if (!token) return;
    try {
      if (chainPurchaseId !== null) {
        await writeContractAsync({
          address: MARKETPLACE_CONTRACT,
          abi: marketplaceAbi,
          functionName: action === "release" ? "confirmReceipt" : "raiseDispute",
          args: [BigInt(chainPurchaseId)],
        });
      }
      await settleOrder({
        data: {
          token,
          orderId,
          action,
          reason: action === "dispute" ? "Buyer raised a dispute." : undefined,
        },
      });
      toast.success(
        action === "release" ? "Escrow released to the seller." : "Dispute opened for moderator review.",
      );
      void orders.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Could not update order.");
    }
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          eyebrow="Creator marketplace"
          title="Spend $WORD on work that compounds"
          sub={`Every purchase is held in escrow for ${REWARD_CONFIG.escrowHours} hour. Raise a dispute and a human moderator reviews it.`}
        />
        {token && <SellDialog onDone={() => void refetch()} />}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.products ?? []).map((p) => (
          <Link
            key={p.id}
            to="/marketplace/$id"
            params={{ id: p.id }}
            className="rounded-2xl border border-border bg-surface-glass p-7 transition hover:border-electric/50 hover:shadow-gold"
          >
            <ShoppingBag className="h-5 w-5 text-electric" />
            <h2 className="mt-4 font-display text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{sellerName(p.seller_id)}</span>
              <span className="font-display text-electric">{Number(p.price_word).toLocaleString()} $WORD</span>
            </div>
          </Link>
        ))}
        {(data?.products ?? []).length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No listings yet. Verified Writers can be the first to sell here.
          </div>
        )}
      </div>

      {token && (orders.data?.bought.length ?? 0) > 0 && (
        <>
          <h2 className="mt-14 font-display text-2xl font-semibold">Your purchases</h2>
          <div className="mt-5 space-y-3">
            {orders.data!.bought.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface-glass p-6"
              >
                <div>
                  <p className="font-display text-lg">
                    {(o as { products?: { title?: string } }).products?.title ?? "Product"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Number(o.price_word).toLocaleString()} $WORD · escrow until{" "}
                    {new Date(o.escrow_release_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-electric/40 px-3 py-1 text-[10px] uppercase tracking-wider text-electric">
                    {o.status}
                  </span>
                  {o.status === "escrow" && (
                    <>
                      <Button size="sm" variant="outline" className="border-border bg-transparent" onClick={() => settle(o.id, "dispute", (o as { chain_purchase_id?: number | null }).chain_purchase_id ?? null)}>
                        Dispute
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
                        onClick={() => settle(o.id, "release", (o as { chain_purchase_id?: number | null }).chain_purchase_id ?? null)}
                      >
                        Release funds
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
