import { createServerFn } from "@tanstack/react-start";

export const requestNonce = createServerFn({ method: "POST" })
  .inputValidator((d: { address: string }) => d)
  .handler(async ({ data }) => {
    const { admin, siweMessage } = await import("./shiba.server");
    const address = data.address.toLowerCase();
    const nonce = crypto.randomUUID();
    await admin().from("wallet_nonces").insert({ nonce, wallet_address: address });
    return { nonce, message: siweMessage(data.address, nonce) };
  });

export const verifyWallet = createServerFn({ method: "POST" })
  .inputValidator((d: { address: string; nonce: string; signature: string }) => d)
  .handler(async ({ data }) => {
    const { verifyMessage } = await import("viem");
    const { admin, siweMessage, randomToken } = await import("./shiba.server");
    const db = admin();
    const address = data.address.toLowerCase();

    const { data: nonceRow } = await db
      .from("wallet_nonces")
      .select("*")
      .eq("nonce", data.nonce)
      .eq("wallet_address", address)
      .maybeSingle();
    if (!nonceRow || nonceRow.used) throw new Error("Invalid or expired sign-in request.");

    const valid = await verifyMessage({
      address: data.address as `0x${string}`,
      message: siweMessage(data.address, data.nonce),
      signature: data.signature as `0x${string}`,
    });
    if (!valid) throw new Error("Signature verification failed.");

    await db.from("wallet_nonces").update({ used: true }).eq("nonce", data.nonce);

    let { data: writer } = await db
      .from("writers")
      .select("*")
      .eq("wallet_address", address)
      .maybeSingle();
    if (!writer) {
      const created = await db
        .from("writers")
        .insert({ wallet_address: address, name: "" })
        .select("*")
        .single();
      if (created.error) throw created.error;
      writer = created.data;
    }

    const token = randomToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
    await db
      .from("wallet_sessions")
      .insert({ token, writer_id: writer.id, wallet_address: address, expires_at: expires });

    return { token, writer, registered: writer.name.length > 0 };
  });

export const getMe = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const { writerFromToken } = await import("./shiba.server");
    const writer = await writerFromToken(data.token);
    return { writer, registered: writer.name.length > 0 };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; name: string; bio: string; niches: string[] }) => d)
  .handler(async ({ data }) => {
    const { admin, writerFromToken } = await import("./shiba.server");
    const writer = await writerFromToken(data.token);
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Please enter a display name.");
    const { data: updated, error } = await admin()
      .from("writers")
      .update({ name, bio: data.bio.trim().slice(0, 600), niches: data.niches.slice(0, 5) })
      .eq("id", writer.id)
      .select("*")
      .single();
    if (error) throw error;
    return { writer: updated };
  });

export const signOut = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const { admin } = await import("./shiba.server");
    await admin().from("wallet_sessions").delete().eq("token", data.token);
    return { ok: true };
  });
