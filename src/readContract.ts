// src/readContract.ts
import { getNextClient } from './rpcClient';
import { getCallkitConfig } from './config';
import { memoryCache } from './utils/memoryCache';
import { redisGet, redisSet } from './redis';
import { PublicClient, ReadContractParameters } from 'viem';
import crypto from 'crypto';

const coalesceMap = new Map<string, Promise<any>>();

function getCacheKey(args: ReadContractParameters) {
  return 'read:' + crypto.createHash('md5').update(JSON.stringify(args)).digest('hex');
}

interface ReadContractOptions {
  ttl?: number;
}

export async function readContractWithCache<T>(
  args: ReadContractParameters,
  client?: PublicClient,
  options?: ReadContractOptions
): Promise<T> {
  const config = getCallkitConfig();
  const key = getCacheKey(args);
  const ttl = options?.ttl ?? config.ttl;

  if (config.logger?.debug) config.logger.debug('[readContract] cacheKey', key);

  if (coalesceMap.has(key)) {
    if (config.logger?.debug) config.logger.debug('[readContract] reuse in-flight promise');
    return coalesceMap.get(key)!;
  }

  const p = (async () => {
    const redisVal = await redisGet(key);
    if (redisVal) {
      if (config.logger?.debug) config.logger.debug('[readContract] hit redis');
      return JSON.parse(redisVal);
    }

    const memVal = memoryCache.get(key);
    if (memVal) {
      if (config.logger?.debug) config.logger.debug('[readContract] hit memory');
      return memVal;
    }

    if (config.logger?.debug) config.logger.debug('[readContract] calling RPC', args.address, args.functionName);
    const result = await (client || getNextClient()).readContract({
      ...args,
    });

    if (ttl) {
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
export async function readContractLive<T>(config: ReadContractParameters): Promise<T> {
  return readContractWithCache(config, undefined, { ttl: 0 });
}