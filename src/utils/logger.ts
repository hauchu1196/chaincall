// src/utils/logger.ts
import { getCallkitConfig } from '../config';

function log(...args: any[]) {
  const config = getCallkitConfig();
  if (config.logger?.debug) config.logger.debug('[callkit]', ...args);
}

export const logger = {
  debug: (...args: any[]) => log('[DEBUG]', ...args),
  warn: (...args: any[]) => log('[WARN]', ...args),
  error: (...args: any[]) => log('[ERROR]', ...args),
};
