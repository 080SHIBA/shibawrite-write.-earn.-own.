import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";

export function Web3Provider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={getWagmiConfig()}>{children}</WagmiProvider>;
}
