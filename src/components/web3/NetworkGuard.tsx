import { useAccount, useSwitchChain } from "wagmi";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACTIVE_CHAIN } from "@/lib/contracts";

/**
 * Contract calls only work on the network the contracts are deployed to.
 * Shows a switch prompt whenever the connected wallet sits on another chain.
 */
export function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === ACTIVE_CHAIN.id) return null;

  return (
    <div className="border-b border-amber-500/40 bg-amber-500/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
        <p className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          Wrong network — ShibaWrite contracts live on {ACTIVE_CHAIN.name} (chain {ACTIVE_CHAIN.id}).
        </p>
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => switchChain({ chainId: ACTIVE_CHAIN.id })}
          className="bg-gradient-gold text-electric-foreground shadow-gold hover:opacity-95"
        >
          {isPending ? "Switching…" : `Switch to ${ACTIVE_CHAIN.name}`}
        </Button>
      </div>
    </div>
  );
}
