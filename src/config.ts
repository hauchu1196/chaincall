// src/config.ts

export interface CallkitLogger {
    debug?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
  }
  

export interface CallkitConfig {
    rpcEndpoints: string[];
    ttl: number;
    maxRetry: number;
    debug: boolean;
    redisUrl?: string;
    logger?: CallkitLogger;
}

let config: CallkitConfig = {
    rpcEndpoints: [],
    ttl: 30_000,
    maxRetry: 3,
    debug: false,
};

export function initCallkit(userConfig: Partial<CallkitConfig>) {
    config = { ...config, ...userConfig };
}

export function getCallkitConfig(): CallkitConfig {
    return config;
}

// ---- Logger Factories ----
export function createConsoleLogger(prefix = 'Callkit'): CallkitLogger {
    return {
      debug: (...args) => console.debug(`[${prefix}]`, ...args),
      info: (...args) => console.info(`[${prefix}]`, ...args),
      warn: (...args) => console.warn(`[${prefix}]`, ...args),
      error: (...args) => console.error(`[${prefix}]`, ...args),
    };
  }