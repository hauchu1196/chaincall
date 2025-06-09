# Chaincall SDK

Lightweight TypeScript SDK for RPC calls with built-in caching (memory + Redis), RPC rotation, retry, and optional logging.

## ✅ Features

- ⚡ Smart RPC client with auto-retry, failover, round-robin
- 🧠 Memory + Redis caching with TTL
- 🔁 Debounce & dedup in-flight requests
- 🛠️ Modular logger injection (Winston, Pino, etc.)
- 🧪 Testable & production-ready

---

## 📦 Installation
```bash
npm install chaincall
```

## 🛠️ Setup
```ts
import { initChaincall } from 'chaincall';

initChaincall({
  rpcUrls: ['https://mainnet.base.org', 'https://...', ...],
  redisUrl: process.env.REDIS_URL,
  ttl: 30, // default TTL in seconds
  logger: console, // optional custom logger
});
```

---

## 🔍 Usage

### `readContractWithCache`
```ts
import { readContractWithCache } from 'chaincall';

const result = await readContractWithCache({
  address: '0x...',
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: ['0xabc...']
});
```

### `readContractLive` (No cache)
```ts
import { readContractLive } from 'chaincall';

const liveResult = await readContractLive({
  address: '0x...',
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: ['0xabc...']
});
```

---

### `multicallWithCache`
```ts
import { multicallWithCache } from 'chaincall';

const data = await multicallWithCache([
  {
    address: '0x...',
    abi: erc20Abi,
    functionName: 'symbol',
  },
  {
    address: '0x...',
    abi: erc20Abi,
    functionName: 'decimals',
  },
]);
```

### `multicallLive` (Bypass cache)
```ts
import { multicallLive } from 'chaincall';

const data = await multicallLive([
  {
    address: '0x...',
    abi: erc20Abi,
    functionName: 'symbol',
  }
]);
```

---

## ⚙️ Advanced Usage

### Override TTL per-call
```ts
const result = await readContractWithCache({
  address: '0x...',
  abi: erc20Abi,
  functionName: 'totalSupply'
}, undefined, { ttl: 120 }); // custom TTL = 120s
```

### Custom logger (e.g., Winston)
```ts
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

initChaincall({
  rpcUrls: [...],
  redisUrl: 'redis://localhost:6379',
  logger,
});
```

### Manual RPC override (per-call)
```ts
const result = await readContractWithCache({
  address: '0x...',
  abi: erc20Abi,
  functionName: 'symbol'
}, 'https://my-rpc.com');
```

---

## 🧪 Testing
```bash
npm run test
```

---

## 🔓 License
MIT
