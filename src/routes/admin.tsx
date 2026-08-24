import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { keccak256, stringToHex, type Abi } from "viem";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { AppShell, PageHeading } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shibaWriteAbi } from "@/lib/abi/shibawrite";
import { marketplaceAbi } from "@/lib/abi/marketplace";
import {
  ACTIVE_CHAIN,
  EXPLORER_URL,
  MARKETPLACE_CONTRACT,
  SHIBAWRITE_CONTRACT,
} from "@/lib/contracts";
import { shortAddress } from "@/hooks/useWriter";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Contract Admin Console — ShibaWrite" },
      {
        name: "description",
        content:
          "Role-gated control panel for the ShibaWrite token and marketplace contracts: reward rates, fees, pausing, roles and dispute resolution.",
      },
      { property: "og:title", content: "Contract Admin Console — ShibaWrite" },
      {
        property: "og:description",
        content: "Manage ShibaWrite's on-chain reward parameters, fees and roles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_ROLE = keccak256(stringToHex("ADMIN_ROLE"));
const DEFAULT_ADMIN_ROLE = `0x${"0".repeat(64)}` as const;

type Field = { name: string; placeholder: string; kind: "text" | "number" | "bool" };
type Action = {
  label: string;
  hint: string;
  target: "token" | "market";
  fn: string;
  fields: Field[];
};

const ACTIONS: Action[] = [
  {
    label: "Set base rate",
    hint: "$WORD (wei) minted per 150-word unit — setBaseRate",
    target: "token",
    fn: "setBaseRate",
    fields: [{ name: "newRate", placeholder: "e.g. 30000000000000000000", kind: "number" }],
  },
  {
    label: "Set daily mint cap",
    hint: "Per-writer daily reward ceiling — setDailyMintCap",
    target: "token",
    fn: "setDailyMintCap",
    fields: [{ name: "newCap", placeholder: "e.g. 2000000000000000000000", kind: "number" }],
  },
  {
    label: "Set category multiplier",
    hint: "Category id (0-5) and multiplier in basis points — setCategoryMultiplier",
    target: "token",
    fn: "setCategoryMultiplier",
    fields: [
      { name: "categoryId", placeholder: "0", kind: "number" },
      { name: "multiplier", placeholder: "13000 = 1.3x", kind: "number" },
    ],
  },
  {
    label: "Set NFT mint fee",
    hint: "$WORD burned to mint an achievement — setNFTMintFee",
    target: "token",
    fn: "setNFTMintFee",
    fields: [{ name: "newFee", placeholder: "amount in wei", kind: "number" }],
  },
  {
    label: "Set badge cost",
    hint: "$WORD burned for a profile badge — setBadgeCost",
    target: "token",
    fn: "setBadgeCost",
    fields: [{ name: "newCost", placeholder: "amount in wei", kind: "number" }],
  },
  {
    label: "Set treasury",
    hint: "Address receiving protocol fees — setTreasury",
    target: "token",
    fn: "setTreasury",
    fields: [{ name: "newTreasury", placeholder: "0x…", kind: "text" }],
  },
  {
    label: "Reject post",
    hint: "Marks a post id as rejected on-chain — rejectPost",
    target: "token",
    fn: "rejectPost",
    fields: [
      { name: "postId", placeholder: "0x… (bytes32)", kind: "text" },
      { name: "writer", placeholder: "0x…", kind: "text" },
    ],
  },
  {
    label: "Clawback reward",
    hint: "Voids a queued reward before it is claimed — clawbackReward",
    target: "token",
    fn: "clawbackReward",
    fields: [{ name: "rewardId", placeholder: "reward id", kind: "number" }],
  },
  {
    label: "Grant role",
    hint: "Give a role (bytes32) to an address — grantRole",
    target: "token",
    fn: "grantRole",
    fields: [
      { name: "role", placeholder: "0x… role hash", kind: "text" },
      { name: "account", placeholder: "0x…", kind: "text" },
    ],
  },
  {
    label: "Revoke role",
    hint: "Remove a role from an address — revokeRole",
    target: "token",
    fn: "revokeRole",
    fields: [
      { name: "role", placeholder: "0x… role hash", kind: "text" },
      { name: "account", placeholder: "0x…", kind: "text" },
    ],
  },
  {
    label: "Set platform fee",
    hint: "Marketplace fee percentage — setPlatformFee",
    target: "market",
    fn: "setPlatformFee",
    fields: [{ name: "newFeePct", placeholder: "e.g. 5", kind: "number" }],
  },
  {
    label: "Toggle product",
    hint: "Enable or disable a listing — setProductActive",
    target: "market",
    fn: "setProductActive",
    fields: [
      { name: "productId", placeholder: "product id", kind: "number" },
      { name: "active", placeholder: "true / false", kind: "bool" },
    ],
  },
  {
    label: "Seller tier gate",
    hint: "Require verified tier to list — setSellerTierGateEnabled",
    target: "market",
    fn: "setSellerTierGateEnabled",
    fields: [{ name: "enabled", placeholder: "true / false", kind: "bool" }],
  },
  {
    label: "Resolve dispute",
    hint: "Settle escrow: refund buyer or pay seller — resolveDispute",
    target: "market",
    fn: "resolveDispute",
    fields: [
      { name: "purchaseId", placeholder: "purchase id", kind: "number" },
      { name: "refundToBuyer", placeholder: "true / false", kind: "bool" },
    ],
  },
  {
    label: "Release funds",
    hint: "Force-release escrow after the window — releaseFunds",
    target: "market",
    fn: "releaseFunds",
    fields: [{ name: "purchaseId", placeholder: "purchase id", kind: "number" }],
  },
];

function parseArg(value: string, kind: Field["kind"]) {
  if (kind === "bool") return value.trim().toLowerCase() === "true";
  if (kind === "number") return BigInt(value.trim());
  return value.trim() as `0x${string}`;
}

function ActionCard({ action, abi, address }: { action: Action; abi: Abi; address: `0x${string}` }) {
  const { writeContractAsync } = useWriteContract();
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const args = action.fields.map((f) => parseArg(values[f.name] ?? "", f.kind));
      const hash = await writeContractAsync({
        address,
        abi,
        functionName: action.fn,
        args,
        chainId: ACTIVE_CHAIN.id,
      });
      toast.success(`${action.label} submitted`, {
        description: hash.slice(0, 18) + "…",
        action: { label: "View tx", onClick: () => window.open(`${EXPLORER_URL}/tx/${hash}`, "_blank") },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-glass p-6">
      <h3 className="font-display text-lg font-semibold">{action.label}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{action.hint}</p>
      <div className="mt-4 space-y-2">
        {action.fields.map((f) => (
          <Input
            key={f.name}
            placeholder={`${f.name} — ${f.placeholder}`}
            value={values[f.name] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            className="bg-background"
          />
        ))}
      </div>
      <Button
        size="sm"
        disabled={busy}
        onClick={run}
        className="mt-4 w-full bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
      >
        {busy ? "Sending…" : "Execute"}
      </Button>
    </div>
  );
}

function PauseControls({ abi, address, name }: { abi: Abi; address: `0x${string}`; name: string }) {
  const { writeContractAsync } = useWriteContract();
  const { data: paused, refetch } = useReadContract({
    address,
    abi,
    functionName: "paused",
    chainId: ACTIVE_CHAIN.id,
  });
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      await writeContractAsync({
        address,
        abi,
        functionName: paused ? "unpause" : "pause",
        chainId: ACTIVE_CHAIN.id,
      });
      toast.success(paused ? `${name} unpaused` : `${name} paused`);
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-glass p-6">
      <div>
        <h3 className="font-display text-lg font-semibold">{name} status</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Currently {paused ? "paused — writes blocked" : "live"}
        </p>
      </div>
      <Button size="sm" variant="outline" disabled={busy} onClick={toggle} className="border-border">
        {busy ? "…" : paused ? "Unpause" : "Pause"}
      </Button>
    </div>
  );
}

function AdminPage() {
  const { address, isConnected, chainId } = useAccount();

  const { data: roleData, isLoading } = useReadContracts({
    allowFailure: true,
    contracts: address
      ? [
          {
            address: SHIBAWRITE_CONTRACT,
            abi: shibaWriteAbi as Abi,
            functionName: "hasRole",
            args: [ADMIN_ROLE, address],
            chainId: ACTIVE_CHAIN.id,
          },
          {
            address: SHIBAWRITE_CONTRACT,
            abi: shibaWriteAbi as Abi,
            functionName: "hasRole",
            args: [DEFAULT_ADMIN_ROLE, address],
            chainId: ACTIVE_CHAIN.id,
          },
          {
            address: MARKETPLACE_CONTRACT,
            abi: marketplaceAbi as Abi,
            functionName: "hasRole",
            args: [ADMIN_ROLE, address],
            chainId: ACTIVE_CHAIN.id,
          },
        ]
      : [],
  });

  const tokenAdmin = roleData?.[0]?.result === true || roleData?.[1]?.result === true;
  const marketAdmin = roleData?.[2]?.result === true;
  const isAdmin = tokenAdmin || marketAdmin;

  return (
    <AppShell>
      <PageHeading
        eyebrow="Contract console"
        title="Admin controls"
        sub={`Direct calls to the ShibaWrite token and marketplace contracts on ${ACTIVE_CHAIN.name}.`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { l: "ShibaWrite token", a: SHIBAWRITE_CONTRACT },
          { l: "Marketplace", a: MARKETPLACE_CONTRACT },
        ].map((c) => (
          <a
            key={c.a}
            href={`${EXPLORER_URL}/address/${c.a}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-border bg-surface-glass p-5 transition hover:border-electric/60"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.l}</p>
            <p className="mt-1 font-display text-sm text-electric">{c.a}</p>
          </a>
        ))}
      </div>

      {!isConnected && (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Connect your admin wallet to load contract controls.
        </p>
      )}

      {isConnected && chainId !== ACTIVE_CHAIN.id && (
        <p className="mt-8 flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-300">
          <ShieldAlert className="h-4 w-4" /> Switch to {ACTIVE_CHAIN.name} to read your roles.
        </p>
      )}

      {isConnected && chainId === ACTIVE_CHAIN.id && isLoading && (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking on-chain roles…
        </p>
      )}

      {isConnected && chainId === ACTIVE_CHAIN.id && !isLoading && !isAdmin && (
        <p className="mt-8 flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          <ShieldAlert className="h-4 w-4" />
          {shortAddress(address)} does not hold ADMIN_ROLE on either contract.
        </p>
      )}

      {isAdmin && (
        <>
          <p className="mt-8 flex items-center gap-2 text-sm text-electric">
            <ShieldCheck className="h-4 w-4" /> Admin verified for {shortAddress(address)}
            {tokenAdmin && " · token"}
            {marketAdmin && " · marketplace"}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {tokenAdmin && (
              <PauseControls abi={shibaWriteAbi as Abi} address={SHIBAWRITE_CONTRACT} name="Token contract" />
            )}
            {marketAdmin && (
              <PauseControls abi={marketplaceAbi as Abi} address={MARKETPLACE_CONTRACT} name="Marketplace" />
            )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {ACTIONS.filter((a) => (a.target === "token" ? tokenAdmin : marketAdmin)).map((a) => (
              <ActionCard
                key={a.label}
                action={a}
                abi={(a.target === "token" ? shibaWriteAbi : marketplaceAbi) as Abi}
                address={a.target === "token" ? SHIBAWRITE_CONTRACT : MARKETPLACE_CONTRACT}
              />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
