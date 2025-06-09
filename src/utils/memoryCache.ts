// src/utils/memoryCache.ts
import { LRUCache } from 'lru-cache';
import { getCallkitConfig } from '../config';

export const memoryCache = new LRUCache<string, any>({
  max: 10000,
  ttl: getCallkitConfig().ttl || 30 * 1000,
});
