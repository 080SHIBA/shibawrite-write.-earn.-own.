import { sepolia } from "viem/chains";

/** Deployed ShibaWrite contracts (Ethereum Sepolia testnet, chain 11155111). */
export const SHIBAWRITE_CONTRACT = "0xCBE5a8375ace094B178E203Cc11961403b3cb11E" as const;
export const MARKETPLACE_CONTRACT = "0x6e4d777eFe9f425e56d0F9736F59b609Db66A1F3" as const;

export const ACTIVE_CHAIN = sepolia;
export const EXPLORER_URL = "https://sepolia.etherscan.io";

export const REWARD_CONFIG = {
  /** $WORD per word — 30 $WORD per 150 words. */
  baseRate: 0.2,
  minWords: 200,
  maxWords: 3500,
  dailyCapWord: 2000,
  holdMinutes: 5,
  nftQualityThreshold: 90,
  escrowHours: 1,
} as const;

export const CATEGORIES = [
  { id: "technical", label: "Technical / Web3", multiplier: 1.3 },
  { id: "finance", label: "Finance & Markets", multiplier: 1.25 },
  { id: "research", label: "Research & Analysis", multiplier: 1.2 },
  { id: "education", label: "Education", multiplier: 1.1 },
  { id: "culture", label: "Culture & Opinion", multiplier: 1.0 },
  { id: "lifestyle", label: "Lifestyle", multiplier: 0.9 },
] as const;

export function categoryMultiplier(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.multiplier ?? 1;
}

export function tierFor(approvedPosts: number) {
  if (approvedPosts >= 50) return "elite";
  if (approvedPosts >= 5) return "verified";
  return "new";
}

export const TIER_LABEL: Record<string, string> = {
  new: "New Writer",
  verified: "Verified Writer",
  elite: "Elite Writer",
};
