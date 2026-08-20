import { createServerFn } from "@tanstack/react-start";

export const submitPost = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; title: string; category: string; content: string }) => d)
  .handler(async ({ data }) => {
    const {
      admin,
      writerFromToken,
      countWords,
      scoreContent,
      qualityMultiplier,
      rewardFor,
      refreshTier,
    } = await import("./shiba.server");
    const { REWARD_CONFIG, categoryMultiplier } = await import("@/lib/contracts");

    const writer = await writerFromToken(data.token);
    const words = countWords(data.content);
    if (words < REWARD_CONFIG.minWords)
      throw new Error(`Posts must be at least ${REWARD_CONFIG.minWords} words (you have ${words}).`);
    if (words > REWARD_CONFIG.maxWords)
      throw new Error(`Posts must be under ${REWARD_CONFIG.maxWords} words (you have ${words}).`);

    const scores = await scoreContent(data.title, data.category, data.content);
    const qm = qualityMultiplier(scores);
    const rejected = scores.originality < 70 || scores.authenticity < 40;
    const review = !rejected && (scores.quality < 45 || scores.originality < 85);
    const status = rejected ? "rejected" : review ? "pending_review" : "approved";
    const reward = rejected ? 0 : rewardFor(words, data.category, qm);

    const { data: post, error } = await admin()
      .from("posts")
      .insert({
        writer_id: writer.id,
        title: data.title.trim().slice(0, 180),
        category: data.category,
        content: data.content,
        word_count: words,
        status,
        originality_score: scores.originality,
        quality_score: scores.quality,
        authenticity_score: scores.authenticity,
        ai_feedback: scores.feedback,
        category_multiplier: categoryMultiplier(data.category),
        quality_multiplier: qm,
        reward_amount: reward,
        claim_available_at:
          status === "approved"
            ? new Date(Date.now() + REWARD_CONFIG.holdMinutes * 60_000).toISOString()
            : null,
      })
      .select("*")
      .single();
    if (error) throw error;
    await refreshTier(writer.id);
    return { post };
  });

export const myPosts = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const writer = await writerFromToken(data.token);
    const { data: posts } = await admin()
      .from("posts")
      .select("*")
      .eq("writer_id", writer.id)
      .order("created_at", { ascending: false });
    const { data: nfts } = await admin().from("nfts").select("*").eq("writer_id", writer.id);
    return { writer, posts: posts ?? [], nfts: nfts ?? [] };
  });

export const claimReward = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; postId: string; txHash: string }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const db = admin();
    const writer = await writerFromToken(data.token);
    const { data: post } = await db
      .from("posts")
      .select("*")
      .eq("id", data.postId)
      .eq("writer_id", writer.id)
      .maybeSingle();
    if (!post) throw new Error("Post not found.");
    if (post.status !== "approved") throw new Error("This post is not claimable.");
    if (post.claim_available_at && new Date(post.claim_available_at) > new Date())
      throw new Error("The 5-minute anti-fraud hold has not finished yet.");

    await db
      .from("posts")
      .update({ status: "claimed", claimed_at: new Date().toISOString(), claim_tx: data.txHash })
      .eq("id", post.id);
    await db
      .from("writers")
      .update({ total_earned: Number(writer.total_earned) + Number(post.reward_amount ?? 0) })
      .eq("id", writer.id);
    return { ok: true };
  });

export const mintAchievement = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; postId: string; txHash: string; tokenId?: string }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const { REWARD_CONFIG } = await import("@/lib/contracts");
    const db = admin();
    const writer = await writerFromToken(data.token);
    const { data: post } = await db
      .from("posts")
      .select("*")
      .eq("id", data.postId)
      .eq("writer_id", writer.id)
      .maybeSingle();
    if (!post) throw new Error("Post not found.");
    if (Number(post.quality_score ?? 0) < REWARD_CONFIG.nftQualityThreshold)
      throw new Error("Only posts scoring 90% or above can mint an achievement badge.");
    const { error } = await db.from("nfts").insert({
      post_id: post.id,
      writer_id: writer.id,
      tx_hash: data.txHash,
      token_id: data.tokenId ?? null,
      quality_score: Number(post.quality_score ?? 0),
    });
    if (error) throw error;
    return { ok: true };
  });

export const publicFeed = createServerFn({ method: "GET" }).handler(async () => {
  const { admin } = await import("./shiba.server");
  const db = admin();
  const { data: posts } = await db
    .from("posts")
    .select("id, title, category, word_count, quality_score, reward_amount, created_at, writer_id")
    .in("status", ["approved", "claimed"])
    .order("created_at", { ascending: false })
    .limit(24);
  const { data: writers } = await db
    .from("writers")
    .select("id, name, wallet_address, tier, total_earned, approved_posts")
    .order("total_earned", { ascending: false })
    .limit(10);
  return { posts: posts ?? [], writers: writers ?? [] };
});

export const publicProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { address: string }) => d)
  .handler(async ({ data }) => {
    const { admin } = await import("./shiba.server");
    const db = admin();
    const { data: writer } = await db
      .from("writers")
      .select("*")
      .eq("wallet_address", data.address.toLowerCase())
      .maybeSingle();
    if (!writer) return { writer: null, posts: [], nfts: [] };
    const { data: posts } = await db
      .from("posts")
      .select("id, title, category, word_count, quality_score, created_at")
      .eq("writer_id", writer.id)
      .in("status", ["approved", "claimed"])
      .order("created_at", { ascending: false });
    const { data: nfts } = await db.from("nfts").select("*").eq("writer_id", writer.id);
    return { writer, posts: posts ?? [], nfts: nfts ?? [] };
  });
