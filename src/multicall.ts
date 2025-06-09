// src/multicall.ts
import { getChaincallConfig } from './config';
import { getNextClient } from './rpcClient';
import { memoryCache } from './utils/memoryCache';
import { redisGet, redisSet } from './redis';
import crypto from 'crypto';
import { PublicClient, MulticallContracts } from 'viem';

const coalesceMap = new Map<string, Promise<any>>();

function getCacheKey(contracts: MulticallContracts<any, any, any>) {
  return 'multi:' + crypto.createHash('md5').update(JSON.stringify(contracts)).digest('hex');
}

interface MulticallOptions {
  ttl?: number;
}

export async function multicallWithCache(
  contracts: MulticallContracts<any, any, any>,
  client?: PublicClient,
  options?: MulticallOptions
): Promise<any[]> {
  const config = getChaincallConfig();
  const key = getCacheKey(contracts);
  const ttl = options?.ttl ?? config.ttl;

  if (config.logger?.debug) config.logger.debug('[multicall] cacheKey', key);

  if (coalesceMap.has(key)) {
    if (config.logger?.debug) config.logger.debug('[multicall] reuse in-flight promise');
    return coalesceMap.get(key)!;
  }

  const p = (async () => {
    const redisVal = await redisGet(key);
    if (redisVal) {
      if (config.logger?.debug) config.logger.debug('[multicall] hit redis');
      return JSON.parse(redisVal);
    }

    const memVal = memoryCache.get(key);
    if (memVal) {
      if (config.logger?.debug) config.logger.debug('[multicall] hit memory');
      return memVal;
    }

    if (config.logger?.debug) config.logger.debug('[multicall] calling RPC');
    const result = await (client || getNextClient()).multicall({
      contracts,
    });

    if (ttl > 0) {
      memoryCache.set(key, result);
      redisSet(key, JSON.stringify(result), ttl);
    }
    return result;
  })();

  coalesceMap.set(key, p);
  p.finally(() => coalesceMap.delete(key));

  return p;
}

// ✅ Always fetch live data, bypass cache completely
export async function multicallLive(
  contracts: MulticallContracts<any, any, any>,
  client?: PublicClient
): Promise<any[]> {
  return multicallWithCache(contracts, client, { ttl: 0 });
}