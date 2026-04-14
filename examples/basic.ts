import { PersolatorClient } from "persolator-sdk";

const client = new PersolatorClient();

// ── Markets ────────────────────────────────────────────
const markets = await client.listMarkets({ sort: "volume" });
console.log(`\n${markets.length} active markets:`);
for (const m of markets) {
  const sign = m.priceChange24h >= 0 ? "+" : "";
  console.log(`  ${m.symbol.padEnd(12)} $${m.price.toFixed(4)}  ${sign}${m.priceChange24h.toFixed(2)}%`);
}

// ── Stats ──────────────────────────────────────────────
const stats = await client.getStats();
console.log(`\nProtocol Stats`);
console.log(`  24h Volume : $${stats.totalVolume24h.toLocaleString()}`);
console.log(`  Open Interest: $${stats.totalOpenInterest.toLocaleString()}`);
console.log(`  Active Traders: ${stats.activeTraders}`);

// ── Vault ──────────────────────────────────────────────
const vault = await client.getVault();
console.log(`\nVault`);
console.log(`  Address : ${vault.vaultAddress}`);
console.log(`  USDC Mint: ${vault.usdcMint}`);
console.log(`  USDC Balance: ${vault.usdcBalance}`);

// ── Leaderboard ────────────────────────────────────────
const board = await client.getLeaderboard({ limit: 5 });
console.log(`\nTop 5 Traders`);
for (const e of board) {
  console.log(`  #${e.rank} ${e.wallet.slice(0, 8)}...  PnL: $${e.totalPnl}  Win: ${e.winRate}%`);
}
