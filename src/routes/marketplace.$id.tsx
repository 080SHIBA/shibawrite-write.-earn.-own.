import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { parseUnits, stringToHex } from "viem";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { buyProduct, listProducts } from "@/lib/market.functions";
import { marketplaceAbi } from "@/lib/abi/marketplace";
import { MARKETPLACE_CONTRACT, REWARD_CONFIG } from "@/lib/contracts";
import { shortAddress, useWriter } from "@/hooks/useWriter";

export const Route = createFileRoute("/marketplace/$id")({
  head: () => ({
    meta: [
      { title: "Product Details — ShibaWrite Marketplace" },
      {
        name: "description",
        content:
          "Buy creator products with $WORD. Funds sit in a one-hour escrow so you can release or dispute before the seller is paid.",
      },
      { property: "og:title", content: "Product Details — ShibaWrite Marketplace" },
      {
        property: "og:description",
        content: "Escrow-protected creator product priced in $WORD on Base.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { token, writer } = useWriter();
  const navigate = useNavigate();
  const { writeContractAsync } = useWriteContract();
  const [buying, setBuying] = useState(false);

  const { data } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const product = data?.products.find((p) => p.id === id);
  const seller = data?.writers.find((w) => w.id === product?.seller_id);

  const buy = async () => {
    if (!token || !product || !seller) return;
    setBuying(true);
    try {
      const hash = await writeContractAsync({
        address: MARKETPLACE_CONTRACT,
        abi: marketplaceAbi,
        functionName: "buyProduct",
        args: [
          stringToHex(product.id.replace(/-/g, "").slice(0, 32), { size: 32 }),
          seller.wallet_address as `0x${string}`,
          parseUnits(String(product.price_word), 18),
        ],
      });
      await buyProduct({ data: { token, productId: product.id, txHash: hash } });
      toast.success("Purchase complete — funds are in escrow for 1 hour.");
      void navigate({ to: "/marketplace" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Purchase failed.");
    } finally {
      setBuying(false);
    }
  };

  if (!product) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading product…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/marketplace" className="text-xs text-electric underline-offset-4 hover:underline">
        ← Back to marketplace
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-2xl border border-border bg-surface-glass p-8">
          <ShoppingBag className="h-6 w-6 text-electric" />
          <h1 className="mt-5 font-display text-3xl font-bold">{product.title}</h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </article>

        <aside className="h-fit space-y-6 rounded-2xl border border-border bg-surface-glass p-7">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="mt-2 font-display text-3xl font-bold text-electric">
              {Number(product.price_word).toLocaleString()} $WORD
            </p>
          </div>
          {seller && (
            <Link
              to="/profile/$address"
              params={{ address: seller.wallet_address }}
              className="block text-sm text-muted-foreground hover:text-electric"
            >
              Sold by {seller.name || shortAddress(seller.wallet_address)}
            </Link>
          )}
          <div className="rounded-xl border border-electric/30 bg-electric/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mb-2 h-4 w-4 text-electric" />
            Funds are held for {REWARD_CONFIG.escrowHours} hour after purchase. Release them to the seller
            or raise a dispute for moderator review.
          </div>
          <Button
            disabled={!token || buying || writer?.id === product.seller_id}
            onClick={buy}
            className="w-full bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
          >
            {!token
              ? "Connect wallet to buy"
              : writer?.id === product.seller_id
                ? "This is your listing"
                : buying
                  ? "Confirming…"
                  : "Buy with $WORD"}
          </Button>
        </aside>
      </div>
    </AppShell>
  );
}
