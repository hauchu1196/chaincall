// src/rpcClient.ts
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { getChaincallConfig } from './config';

let currentIndex = 0;

export function getNextClient() {
  const { rpcEndpoints, debug } = getChaincallConfig();

  if (!rpcEndpoints || rpcEndpoints.length === 0) {
    throw new Error('[chaincall] No RPC endpoints configured. Please call initChaincall({ rpcEndpoints: [...] })');
  }

  const rpcUrl = rpcEndpoints[currentIndex];
  currentIndex = (currentIndex + 1) % rpcEndpoints.length;

  if (debug) {
    console.debug(`[chaincall] Using RPC: ${rpcUrl}`);
  }

  return createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });
}
