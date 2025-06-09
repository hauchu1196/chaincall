// src/config.ts

export interface ChaincallLogger {
    debug?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
  }
  

export interface ChaincallConfig {
    rpcEndpoints: string[];
    ttl: number;
    maxRetry: number;
    debug: boolean;
    redisUrl?: string;
    logger?: ChaincallLogger;
}

let config: ChaincallConfig = {
    rpcEndpoints: [],
    ttl: 30_000,
    maxRetry: 3,
    debug: false,
};

export function initChaincall(userConfig: Partial<ChaincallConfig>) {
    config = { ...config, ...userConfig };
}

export function getChaincallConfig(): ChaincallConfig {
    return config;
}

// ---- Logger Factories ----
export function createConsoleLogger(prefix = 'Chaincall'): ChaincallLogger {
    return {
      debug: (...args) => console.debug(`[${prefix}]`, ...args),
      info: (...args) => console.info(`[${prefix}]`, ...args),
      warn: (...args) => console.warn(`[${prefix}]`, ...args),
      error: (...args) => console.error(`[${prefix}]`, ...args),
    };
  }