// src/utils/memoryCache.ts
import { LRUCache } from 'lru-cache';
import { getChaincallConfig } from '../config';

export const memoryCache = new LRUCache<string, any>({
  max: 10000,
  ttl: getChaincallConfig().ttl || 30 * 1000,
});
