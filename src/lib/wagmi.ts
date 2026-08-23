import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

/** Publishable WalletConnect Cloud project id (safe in client code). */
const wcProjectId =
  (import.meta.env["VITE_WALLETCONNECT_PROJECT_ID"] as string | undefined) ??
  "36a0f0b7cb2d2a17f0aa22e2dd0e55e2";

let cached: ReturnType<typeof createConfig> | undefined;

/** Created lazily on first use so nothing touches browser globals during module eval. */
export function getWagmiConfig() {
  if (cached) return cached;
  cached = createConfig({
    chains: [baseSepolia],
    connectors: [
      injected({ shimDisconnect: true }),
      coinbaseWallet({ appName: "ShibaWrite", preference: "all" }),
      ...(wcProjectId ? [walletConnect({ projectId: wcProjectId, showQrModal: true })] : []),
    ],
    transports: { [baseSepolia.id]: http() },
    ssr: true,
  });
  return cached;
}
