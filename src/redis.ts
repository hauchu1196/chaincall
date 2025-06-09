// src/redis.ts
import { createClient, RedisClientType } from 'redis';
import { getChaincallConfig } from './config';

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType | null {
  const { redisUrl, debug } = getChaincallConfig();

  if (!redisUrl) return null;
  if (client) return client;

  client = createClient({ url: redisUrl });
  client.on('error', (err) => {
    if (debug) console.warn('[chaincall] Redis error:', err);
    client = null;
  });
  client.connect();
  if (debug) console.debug('[chaincall] Redis connected:', redisUrl);
  return client;
}

export async function redisGet(key: string): Promise<string | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function redisSet(key: string, value: string, ttl: number) {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.set(key, value, { PX: ttl });
  } catch {}
}
