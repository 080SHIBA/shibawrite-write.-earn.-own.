import { createServerFn } from "@tanstack/react-start";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { admin } = await import("./shiba.server");
  const db = admin();
  const { data: products } = await db
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  const { data: writers } = await db.from("writers").select("id, name, wallet_address, tier");
  return { products: products ?? [], writers: writers ?? [] };
});

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      token: string;
      title: string;
      description: string;
      category: string;
      priceWord: number;
      chainProductId?: number | null;
    }) => d,
  )
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const writer = await writerFromToken(data.token);
    if (writer.tier === "new")
      throw new Error("Reach Verified Writer (5 approved posts) to sell in the marketplace.");
    const { data: product, error } = await admin()
      .from("products")
      .insert({
        seller_id: writer.id,
        title: data.title.trim().slice(0, 140),
        description: data.description.trim().slice(0, 2000),
        category: data.category,
        price_word: Math.max(1, Math.round(data.priceWord)),
        chain_product_id: data.chainProductId ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return { product };
  });

export const buyProduct = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { token: string; productId: string; txHash: string; chainPurchaseId?: number | null }) => d,
  )
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const { REWARD_CONFIG } = await import("@/lib/contracts");
    const db = admin();
    const buyer = await writerFromToken(data.token);
    const { data: product } = await db
      .from("products")
      .select("*")
      .eq("id", data.productId)
      .maybeSingle();
    if (!product) throw new Error("Product not found.");
    if (product.seller_id === buyer.id) throw new Error("You cannot buy your own product.");
    const { data: order, error } = await db
      .from("orders")
      .insert({
        product_id: product.id,
        buyer_id: buyer.id,
        seller_id: product.seller_id,
        price_word: product.price_word,
        tx_hash: data.txHash,
        chain_purchase_id: data.chainPurchaseId ?? null,
        escrow_release_at: new Date(
          Date.now() + REWARD_CONFIG.escrowHours * 3_600_000,
        ).toISOString(),
      })
      .select("*")
      .single();
    if (error) throw error;
    return { order };
  });

export const myOrders = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const db = admin();
    const writer = await writerFromToken(data.token);
    const { data: bought } = await db
      .from("orders")
      .select("*, products(title, category)")
      .eq("buyer_id", writer.id)
      .order("created_at", { ascending: false });
    const { data: sold } = await db
      .from("orders")
      .select("*, products(title, category)")
      .eq("seller_id", writer.id)
      .order("created_at", { ascending: false });
    return { bought: bought ?? [], sold: sold ?? [] };
  });

export const settleOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; orderId: string; action: "release" | "dispute"; reason?: string }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const db = admin();
    const writer = await writerFromToken(data.token);
    const { data: order } = await db
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .eq("buyer_id", writer.id)
      .maybeSingle();
    if (!order) throw new Error("Order not found.");
    if (order.status !== "escrow") throw new Error("This order is already settled.");

    if (data.action === "release") {
      await db.from("orders").update({ status: "released" }).eq("id", order.id);
      return { status: "released" as const };
    }
    await db.from("orders").update({ status: "disputed" }).eq("id", order.id);
    await db.from("disputes").insert({
      order_id: order.id,
      raiser_id: writer.id,
      reason: (data.reason ?? "").slice(0, 1000) || "No reason provided.",
    });
    return { status: "disputed" as const };
  });
