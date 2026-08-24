import process from "node:process";
import { createPublicClient, http, keccak256, toHex, type Hex } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { shibaWriteAbi } from "@/lib/abi/shibawrite";
import { SHIBAWRITE_CONTRACT, CATEGORIES } from "@/lib/contracts";

/**
 * Server-side oracle: signs EIP-712 reward vouchers that the writer submits
 * to ShibaWrite.approvePost(...). The private key never leaves the server.
 */

function client() {
  return createPublicClient({ chain: sepolia, transport: http() });
}

function oracleAccount() {
  const raw = process.env["ORACLE_PRIVATE_KEY"];
  if (!raw) throw new Error("Oracle signing key is not configured yet.");
  const key = (raw.startsWith("0x") ? raw : `0x${raw}`) as Hex;
  return privateKeyToAccount(key);
}

/** Deterministic bytes32 post id — must match src/lib/chain.ts. */
export function postIdBytes32(id: string): Hex {
  return toHex(id.replace(/-/g, "").slice(0, 32), { size: 32 });
}

export function categoryIdFor(category: string) {
  const i = CATEGORIES.findIndex((c) => c.id === category);
  return i === -1 ? 0 : i;
}

/** Candidate EIP-712 struct field orders; matched against REWARD_TYPEHASH. */
const CANDIDATES: { name: string; fields: [string, string][] }[] = [
  {
    name: "Reward",
    fields: [
      ["writer", "address"],
      ["postId", "bytes32"],
      ["wordCount", "uint256"],
      ["categoryId", "uint8"],
      ["qualityScore", "uint256"],
      ["nonce", "uint256"],
      ["expiry", "uint256"],
    ],
  },
  {
    name: "Reward",
    fields: [
      ["writer", "address"],
      ["postId", "bytes32"],
      ["wordCount", "uint256"],
      ["categoryId", "uint256"],
      ["qualityScore", "uint256"],
      ["nonce", "uint256"],
      ["expiry", "uint256"],
    ],
  },
  {
    name: "RewardVoucher",
    fields: [
      ["writer", "address"],
      ["postId", "bytes32"],
      ["wordCount", "uint256"],
      ["categoryId", "uint8"],
      ["qualityScore", "uint256"],
      ["nonce", "uint256"],
      ["expiry", "uint256"],
    ],
  },
  {
    name: "Approval",
    fields: [
      ["writer", "address"],
      ["postId", "bytes32"],
      ["wordCount", "uint256"],
      ["categoryId", "uint8"],
      ["qualityScore", "uint256"],
      ["nonce", "uint256"],
      ["expiry", "uint256"],
    ],
  },
];

function encodeType(c: { name: string; fields: [string, string][] }) {
  return `${c.name}(${c.fields.map(([n, t]) => `${t} ${n}`).join(",")})`;
}

export type Voucher = {
  writer: `0x${string}`;
  postId: Hex;
  wordCount: string;
  categoryId: number;
  qualityScore: string;
  nonce: string;
  expiry: string;
  signature: Hex;
};

export async function signRewardVoucher(input: {
  writer: `0x${string}`;
  postDbId: string;
  wordCount: number;
  category: string;
  qualityScore: number;
}): Promise<Voucher> {
  const account = oracleAccount();
  const pc = client();

  const [typehash, domain] = await Promise.all([
    pc.readContract({
      address: SHIBAWRITE_CONTRACT,
      abi: shibaWriteAbi,
      functionName: "REWARD_TYPEHASH",
    }) as Promise<Hex>,
    pc.readContract({
      address: SHIBAWRITE_CONTRACT,
      abi: shibaWriteAbi,
      functionName: "eip712Domain",
    }) as Promise<readonly [Hex, string, string, bigint, `0x${string}`, Hex, readonly bigint[]]>,
  ]);

  const match = CANDIDATES.find(
    (c) => keccak256(toHex(encodeType(c))).toLowerCase() === typehash.toLowerCase(),
  );
  if (!match)
    throw new Error(
      "Could not match the contract's reward typehash — the oracle voucher format needs updating.",
    );

  const postId = postIdBytes32(input.postDbId);
  const nonce = BigInt(`0x${keccak256(toHex(`${input.postDbId}:${input.writer}`)).slice(2, 18)}`);
  const expiry = BigInt(Math.floor(Date.now() / 1000) + 60 * 60);
  const categoryId = categoryIdFor(input.category);
  const qualityScore = BigInt(Math.round(input.qualityScore));
  const wordCount = BigInt(input.wordCount);

  const message: Record<string, unknown> = {
    writer: input.writer,
    postId,
    wordCount,
    categoryId,
    qualityScore,
    nonce,
    expiry,
  };

  const signature = await account.signTypedData({
    domain: {
      name: domain[1],
      version: domain[2],
      chainId: Number(domain[3]),
      verifyingContract: domain[4],
    },
    types: {
      [match.name]: match.fields.map(([name, type]) => ({ name, type })),
    },
    primaryType: match.name,
    message: message as never,
  });

  return {
    writer: input.writer,
    postId,
    wordCount: wordCount.toString(),
    categoryId,
    qualityScore: qualityScore.toString(),
    nonce: nonce.toString(),
    expiry: expiry.toString(),
    signature,
  };
}

/** True when the configured oracle key already holds the on-chain signer role. */
export async function oracleAddress() {
  return oracleAccount().address;
}
