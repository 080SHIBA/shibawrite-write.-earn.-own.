import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const wcProjectId = import.meta.env["VITE_WALLETCONNECT_PROJECT_ID"] as string | undefined;

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
