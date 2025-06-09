// src/rpcClient.ts
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { getCallkitConfig } from './config';

let currentIndex = 0;

export function getNextClient() {
  const { rpcEndpoints, debug } = getCallkitConfig();

  if (!rpcEndpoints || rpcEndpoints.length === 0) {
    throw new Error('[callkit] No RPC endpoints configured. Please call initCallkit({ rpcEndpoints: [...] })');
  }

  const rpcUrl = rpcEndpoints[currentIndex];
  currentIndex = (currentIndex + 1) % rpcEndpoints.length;

  if (debug) {
    console.debug(`[callkit] Using RPC: ${rpcUrl}`);
  }

  return createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });
}
