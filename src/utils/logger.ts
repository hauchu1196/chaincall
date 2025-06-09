// src/utils/logger.ts
import { DEBUG_LOG } from '../config';

function log(...args: any[]) {
  if (DEBUG_LOG) console.log('[chaincall]', ...args);
}

export const logger = {
  debug: (...args: any[]) => log('[DEBUG]', ...args),
  warn: (...args: any[]) => log('[WARN]', ...args),
  error: (...args: any[]) => log('[ERROR]', ...args),
};
