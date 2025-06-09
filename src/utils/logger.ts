// src/utils/logger.ts
import { getChaincallConfig } from '../config';

function log(...args: any[]) {
  const config = getChaincallConfig();
  if (config.logger?.debug) config.logger.debug('[chaincall]', ...args);
}

export const logger = {
  debug: (...args: any[]) => log('[DEBUG]', ...args),
  warn: (...args: any[]) => log('[WARN]', ...args),
  error: (...args: any[]) => log('[ERROR]', ...args),
};
