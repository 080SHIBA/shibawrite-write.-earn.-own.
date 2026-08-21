import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getMe, requestNonce, signOut as signOutFn, verifyWallet } from "@/lib/auth.functions";

export type Writer = {
  id: string;
  wallet_address: string;
  name: string;
  bio: string;
  niches: string[];
  tier: string;
  approved_posts: number;
  total_earned: number;
  avatar_url: string | null;
  created_at: string;
};

type Ctx = {
  token: string | null;
  writer: Writer | null;
  registered: boolean;
  loading: boolean;
  authenticating: boolean;
  error: string | null;
  authenticate: () => Promise<boolean>;
  refresh: () => Promise<void>;
  disconnectSession: () => Promise<void>;
  setWriter: (w: Writer) => void;
};

const STORAGE_KEY = "shibawrite.session";
const WriterContext = createContext<Ctx | null>(null);

export function WriterProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [token, setToken] = useState<string | null>(null);
  const [writer, setWriter] = useState<Writer | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    try {
      const res = await getMe({ data: { token: t } });
      setWriter(res.writer as Writer);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setWriter(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    void load(stored).finally(() => setLoading(false));
  }, [load]);

  const authenticate = useCallback(async () => {
    if (!address) return false;
    setAuthenticating(true);
    setError(null);
    try {
      const { nonce, message } = await requestNonce({ data: { address } });
      const signature = await signMessageAsync({ message });
      const res = await verifyWallet({ data: { address, nonce, signature } });
      localStorage.setItem(STORAGE_KEY, res.token);
      setToken(res.token);
      setWriter(res.writer as Writer);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
      return false;
    } finally {
      setAuthenticating(false);
    }
  }, [address, signMessageAsync]);

  const refresh = useCallback(async () => {
    if (token) await load(token);
  }, [token, load]);

  const disconnectSession = useCallback(async () => {
    if (token) await signOutFn({ data: { token } }).catch(() => undefined);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setWriter(null);
  }, [token]);

  return (
    <WriterContext.Provider
      value={{
        token,
        writer,
        registered: !!writer && writer.name.length > 0,
        loading,
        authenticating,
        error,
        authenticate,
        refresh,
        disconnectSession,
        setWriter,
      }}
    >
      {children}
    </WriterContext.Provider>
  );
}

export function useWriter() {
  const ctx = useContext(WriterContext);
  if (!ctx) throw new Error("useWriter must be used inside WriterProvider");
  return ctx;
}

export function shortAddress(a?: string | null) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}
