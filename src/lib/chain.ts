import { decodeEventLog, stringToHex, type Hex, type Log } from "viem";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import { getWagmiConfig } from "@/lib/wagmi";
import { marketplaceAbi } from "@/lib/abi/marketplace";
import { shibaWriteAbi } from "@/lib/abi/shibawrite";
import { MARKETPLACE_CONTRACT, SHIBAWRITE_CONTRACT } from "@/lib/contracts";

/** Deterministic bytes32 id derived from a database UUID. */
export function postIdBytes32(id: string): Hex {
  return stringToHex(id.replace(/-/g, "").slice(0, 32), { size: 32 });
}

export async function waitForReceipt(hash: Hex) {
  return waitForTransactionReceipt(getWagmiConfig(), { hash });
}

function findEventArg<T>(logs: readonly Log[], abi: readonly unknown[], eventName: string, key: string) {
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        abi: abi as never,
        data: log.data,
        topics: log.topics,
      }) as { eventName: string; args: Record<string, unknown> };
      if (decoded.eventName === eventName) return decoded.args[key] as T;
    } catch {
      /* log from another contract */
    }
  }
  return undefined;
}

/** On-chain product id emitted by Marketplace.listProduct. */
export async function productIdFromTx(hash: Hex) {
  const receipt = await waitForReceipt(hash);
  return findEventArg<bigint>(receipt.logs, marketplaceAbi, "ProductListed", "productId");
}

/** On-chain purchase id emitted by Marketplace.purchaseProduct. */
export async function purchaseIdFromTx(hash: Hex) {
  const receipt = await waitForReceipt(hash);
  return findEventArg<bigint>(receipt.logs, marketplaceAbi, "ProductPurchased", "purchaseId");
}

export async function wordAllowance(owner: `0x${string}`) {
  return readContract(getWagmiConfig(), {
    address: SHIBAWRITE_CONTRACT,
    abi: shibaWriteAbi,
    functionName: "allowance",
    args: [owner, MARKETPLACE_CONTRACT],
  }) as Promise<bigint>;
}

/**
 * Resolves the on-chain pending reward id for a post so claimReward(rewardId)
 * can be called. Returns null when the oracle has not approved the post yet.
 */
export async function pendingRewardIdForPost(writer: `0x${string}`, postId: string) {
  const config = getWagmiConfig();
  const ids = (await readContract(config, {
    address: SHIBAWRITE_CONTRACT,
    abi: shibaWriteAbi,
    functionName: "getWriterRewardIds",
    args: [writer],
  })) as readonly bigint[];
  if (!ids.length) return null;
  const rewards = (await readContract(config, {
    address: SHIBAWRITE_CONTRACT,
    abi: shibaWriteAbi,
    functionName: "getRewardsBatch",
    args: [ids],
  })) as readonly {
    writer: `0x${string}`;
    amount: bigint;
    claimableAt: bigint;
    postId: Hex;
    voided: boolean;
    claimed: boolean;
  }[];
  const target = postIdBytes32(postId).toLowerCase();
  const index = rewards.findIndex(
    (r) => r.postId.toLowerCase() === target && !r.claimed && !r.voided,
  );
  return index === -1 ? null : ids[index]!;
}
