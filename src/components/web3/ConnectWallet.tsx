import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { shortAddress, useWriter } from "@/hooks/useWriter";

const TAGS: Record<string, string> = {
  injected: "Browser",
  metaMask: "Recommended",
  coinbaseWalletSDK: "Base",
  walletConnect: "Mobile",
};

/** Connect + SIWE sign-in. Once authenticated the user lands on register or dashboard. */
export function ConnectWallet({
  label = "Connect Wallet",
  variant = "outline",
  className,
}: {
  label?: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { writer, token, authenticate, authenticating, error, disconnectSession } = useWriter();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !isConnected || token) return;
    void authenticate().then((ok) => {
      if (!ok) return;
      setOpen(false);
    });
  }, [open, isConnected, token, authenticate]);

  useEffect(() => {
    if (token && writer && open) {
      setOpen(false);
      void navigate({ to: writer.name ? "/dashboard" : "/register" });
    }
  }, [token, writer, open, navigate]);

  if (token && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-electric/40 px-3 py-1.5 text-xs font-medium text-electric sm:inline">
          {shortAddress(address)}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-transparent"
          onClick={async () => {
            await disconnectSession();
            disconnect();
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        className={className ?? "border-border bg-transparent hover:border-electric/60 hover:bg-electric/10"}
        onClick={() => setOpen(true)}
      >
        <Wallet className="mr-1.5 h-4 w-4" /> {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect Wallet</DialogTitle>
            <DialogDescription>
              Sign in on Base Sepolia with a gasless signature — never a transaction.
            </DialogDescription>
          </DialogHeader>

          {isConnected ? (
            <div className="flex items-center gap-3 rounded-xl border border-electric/40 bg-surface-glass p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-electric" />
              {authenticating ? "Waiting for your signature…" : "Preparing sign-in message…"}
            </div>
          ) : (
            <div className="space-y-3">
              {connectors.map((c) => (
                <button
                  key={c.uid}
                  disabled={isPending}
                  onClick={() => connect({ connector: c })}
                  className="group flex w-full items-center justify-between rounded-xl border border-border bg-surface-glass px-4 py-3.5 text-left transition hover:border-electric/60 disabled:opacity-60"
                >
                  <span className="block font-display text-sm font-semibold">{c.name}</span>
                  <span className="rounded-full border border-electric/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-electric">
                    {TAGS[c.id] ?? "Wallet"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            No wallet yet? See the{" "}
            <button
              className="text-electric underline-offset-4 hover:underline"
              onClick={() => {
                setOpen(false);
                void navigate({ to: "/wallet-setup" });
              }}
            >
              wallet setup guide
            </button>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
