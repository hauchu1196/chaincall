# evm-callkit

A minimal RPC toolkit for EVM-based chains (Ethereum, Base, etc.) with built-in features:

- ✅ LRU + Redis caching for `readContract`, `multicall`
- 🔁 Auto RPC rotation & retry with fallback
- 🧠 Debounce/coalesce requests to avoid duplication
- 🧰 `readContractLive`, `multicallLive` for real-time calls
- 📦 Simple to integrate in bots, indexers, monitoring tools

---

## Install

```bash
npm install evm-callkit
```

---

## Quick Start

```ts
import { initCallkit, readContractWithCache } from 'evm-callkit';

initCallkit({
  rpcUrls: [
    'https://base.blockpi.network/v1/rpc/xxx',
    'https://base.blockpi.network/v1/rpc/yyy',
  ],
  ttl: 600, // 10 minutes
  redisUrl: 'redis://localhost:6379',
  logger: console, // Optional logger
});

const symbol = await readContractWithCache<string>({
  address: '0x...',
  abi: parseAbi(['function symbol() view returns (string)']),
  functionName: 'symbol',
});
```

---

## API

### Init
```ts
initCallkit({
  rpcUrls: string[],
  ttl?: number, // in seconds
  maxRetry?: number,
  redisUrl?: string,
  logger?: Console | CustomLogger,
})
```

### `readContractWithCache`
Call `eth_call` with memory/redis cache and retry:
```ts
await readContractWithCache<string>({
  address,
  abi,
  functionName,
  args,
});
```

### `readContractLive`
Bypass cache and always call live:
```ts
await readContractLive<string>({
  address,
  abi,
  functionName,
  args,
});
```

### `multicallWithCache`
```ts
await multicallWithCache([...contracts], client?, options?);
```
Supports cache, coalescing, redis.

### `multicallLive`
```ts
await multicallLive([...contracts], rpcUrl?);
```
Bypass all cache, use raw RPC.

---

## Test

```bash
npm run test
```

To customize via `.env`:

```env
REDIS_URL=redis://localhost:6379
CALLKIT_TTL=600
CALLKIT_MAX_RETRY=3
CALLKIT_DEBUG=1
CALLKIT_RPC_ENDPOINTS=https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY,...
```

---

## License
MIT

---

Built by [@hauchu1196](https://github.com/hauchu1196) with ❤️
