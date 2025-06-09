// test/evm-callkit.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { initCallkit } from '../src/config';
import { readContractLive, readContractWithCache } from '../src/readContract';
import { multicallWithCache, multicallLive } from '../src/multicall';
import { parseAbi } from 'viem';
import { config } from 'dotenv';

config();

const poolAddress = '0xd0b53d9277642d899df5c87a3966a349a798f224'; // Uniswap v3 USDC/WETH

beforeAll(() => {
  initCallkit({
    rpcEndpoints: process.env.CALLKIT_RPC_ENDPOINTS!.split(','),
    ttl: parseInt(process.env.CALLKIT_TTL || '600', 10),
    maxRetry: parseInt(process.env.CALLKIT_MAX_RETRY || '3', 10),
    redisUrl: process.env.REDIS_URL,
    logger: !!parseInt(process.env.CALLKIT_DEBUG || '0', 10) ? console : undefined,
  });
});


describe('evm-callkit readContract', () => {
  it('returns live token0 address without using cache', async () => {
    const token0 = await readContractLive<string>({
      address: poolAddress,
      abi: parseAbi(['function token0() view returns (address)']),
      functionName: 'token0',
    });

    expect(token0).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it('returns token1 address for known pool', async () => {
    const token1 = await readContractWithCache<string>({
      address: poolAddress,
      abi: parseAbi(['function token1() view returns (address)']),
      functionName: 'token1',
    });

    expect(token1).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
});

describe('evm-callkit multicall', () => {
  it('returns symbol live with multicallLive', async () => {
    const results = await multicallLive([
      {
        address: '0x4200000000000000000000000000000000000006',
        abi: parseAbi(['function symbol() view returns (string)']),
        functionName: 'symbol',
      },
    ]);

    expect(results[0].result).toBe('WETH');
  });
  it('returns symbol and decimals via multicallWithCache', async () => {
    const results = await multicallWithCache([
      {
        address: '0x4200000000000000000000000000000000000006',
        abi: parseAbi(['function symbol() view returns (string)']),
        functionName: 'symbol',
      },
      {
        address: '0x4200000000000000000000000000000000000006',
        abi: parseAbi(['function decimals() view returns (uint8)']),
        functionName: 'decimals',
      },
    ]);

    expect(results[0].result).toBe('WETH');
    expect(typeof results[1].result).toBe('number');
  });
});
