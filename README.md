# persolator-sdk

[![npm version](https://img.shields.io/npm/v/persolator-sdk)](https://www.npmjs.com/package/persolator-sdk)
[![license](https://img.shields.io/npm/l/persolator-sdk)](./LICENSE)
[![node](https://img.shields.io/node/v/persolator-sdk)](https://nodejs.org)

Official TypeScript/JavaScript SDK for the [Persolator](https://persolator.xyz) permissionless perpetual futures protocol on Solana Devnet.

## Overview

`persolator-sdk` provides a lightweight client for interacting with Persolator REST APIs, including market data, positions, faucet operations, vault info, leaderboard data, and transaction scanning.

Built for TypeScript and JavaScript applications, the SDK is designed to make it easy to consume Persolator endpoints from browser-friendly and Node.js environments.

## Install

```bash
npm install persolator-sdk
```

Requires Node.js ≥ 18.

## Quick Start

```ts
import { PersolatorClient, PersolatorError } from "persolator-sdk";

const client = new PersolatorClient();

async function main() {
  const markets = await client.listMarkets({ sort: "volume", search: "SOL" });
  const market = await client.getMarket("SOL-PERP");
  const orderBook = await client.getOrderBook("SOL-PERP");
  const trades = await client.getMarketTrades("SOL-PERP", { limit: 25, offset: 0 });

  console.log(markets.length, market.symbol, orderBook.bids.length, trades.length);
}

main().catch((err) => {
  if (err instanceof PersolatorError) {
    console.error("Persolator API error:", err.message, err.statusCode);
  } else {
    console.error(err);
  }
});
```

## Client Options

Create a client with custom runtime settings:

```ts
const client = new PersolatorClient({
  baseUrl: "http://localhost:3001",
  timeout: 5000,
});
```

- `baseUrl` - override default API host (`https://api.persolator.xyz`)
- `timeout` - request timeout in milliseconds (default: `10000`)

## API Reference

### Markets

- `listMarkets(options)` - List available markets.
  - `options.sort` — `volume` | `gainers` | `losers` | `newest` | `openInterest`
  - `options.search` — optional search term
- `getMarket(symbol)` - Get market detail by market symbol.
- `getOrderBook(symbol)` - Fetch the current order book for a market.
- `getMarketTrades(symbol, options)` - Fetch trade history.
  - `options.limit` — maximum number of trades
  - `options.offset` — pagination offset
- `launchMarket(params)` - Create a new market.

### Protocol Stats

- `getStats()` - Get protocol-wide statistics.
- `getTrendingMarkets({ limit })` - Get trending markets.

### Positions

- `listPositions(options)` - List open positions.
  - `options.wallet` — filter by wallet address
  - `options.marketSymbol` — filter by market
- `getBalance(wallet)` - Get wallet position balance.
- `openPosition(params)` - Open a new position.
- `closePosition(id)` - Close an existing position.

### Faucet

- `getFaucetInfo()` - Retrieve faucet configuration and availability.
- `getFaucetStatus(wallet)` - Get faucet status for a wallet.
- `claimFaucet(wallet)` - Request faucet USDC for a wallet.

### Vault, Leaderboard & Scan

- `getVault()` - Fetch vault information.
- `getLeaderboard({ limit })` - Get leaderboard entries.
- `getScanTransactions({ limit })` - Fetch recent scan transactions.
- `getScanWallet(wallet)` - Fetch scan data for a wallet.

## Open Position Note

`openPosition` requires that USDC has already been transferred to the Persolator vault on-chain. Provide the transaction hash as `txHash`, and the SDK will verify the transfer before creating the position.

## Error Handling

The SDK throws `PersolatorError` for API and request failures.

```ts
try {
  await client.openPosition({ marketSymbol: "SOL-PERP", side: "long", collateral: 100, leverage: 5, wallet, txHash });
} catch (err) {
  if (err instanceof PersolatorError) {
    console.error(err.message);    // human-readable API error
    console.error(err.statusCode); // HTTP status code
  } else {
    console.error(err);
  }
}
```

## Links

- Trading App: https://persolator.xyz
- API: https://api.persolator.xyz
- Explorer: https://scan.persolator.xyz
- Docs: https://persolator.xyz/docs
- CLI: `persolator-cli`
- $PERS: `5ko233fJDq7aQa3jY7ivszY9TJ5cpwQhHEbPtqVtpump`

## License

`persolator-sdk` is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
