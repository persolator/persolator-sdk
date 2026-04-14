import { PersolatorClient, PersolatorError } from "persolator-sdk";

const client = new PersolatorClient({
  baseUrl: "https://api.persolator.xyz",
  timeout: 15_000,
});

const WALLET = "<your-devnet-wallet-address>";

async function run() {
  // 1. Check faucet eligibility
  const status = await client.getFaucetStatus(WALLET);
  if (status.canClaim) {
    console.log("Claiming 1,000 devnet USDC...");
    const claim = await client.claimFaucet(WALLET);
    console.log(`  Claimed! TX: ${claim.txHash}`);
    console.log(`  Explorer: ${claim.explorerUrl}`);
  } else {
    console.log(`  Next claim at: ${status.nextClaimAt}`);
  }

  // 2. Check balance
  const { usdcBalance } = await client.getBalance(WALLET);
  console.log(`\nUSDC Balance: ${usdcBalance}`);

  // 3. Get SOL-PERP market detail
  const { market, markPrice, longRatio } = await client.getMarket("SOL-PERP");
  console.log(`\nSOL-PERP`);
  console.log(`  Mark Price: $${markPrice}`);
  console.log(`  Long/Short: ${(longRatio * 100).toFixed(1)}% / ${((1 - longRatio) * 100).toFixed(1)}%`);
  console.log(`  Max Leverage: ${market.maxLeverage}x`);

  // 4. Open a position
  //    Pre-requisite: send USDC to vault on-chain first, then pass the txHash here.
  try {
    const position = await client.openPosition({
      marketSymbol: "SOL-PERP",
      side: "long",
      collateral: 100,
      leverage: 5,
      wallet: WALLET,
      txHash: "<usdc-transfer-txhash>",
    });
    console.log(`\nPosition opened`);
    console.log(`  ID: ${position.id}`);
    console.log(`  Size: $${position.size}`);
    console.log(`  Entry: $${position.entryPrice}`);
    console.log(`  Liq. Price: $${position.liquidationPrice}`);

    // 5. Close the position
    const closed = await client.closePosition(position.id);
    console.log(`\nPosition closed`);
    console.log(`  P&L: $${closed.unrealizedPnl}`);
    console.log(`  Payout: $${closed.payout}`);
    console.log(`  Payout TX: ${closed.payoutTx}`);
  } catch (err) {
    if (err instanceof PersolatorError) {
      console.error(`API Error [${err.statusCode}]: ${err.message}`);
    }
  }

  // 6. Scan recent on-chain activity
  const txs = await client.getScanTransactions({ limit: 5 });
  console.log(`\nRecent On-Chain Transactions`);
  for (const tx of txs) {
    console.log(`  [${tx.type}] ${tx.hash.slice(0, 16)}...  ${tx.timestamp}`);
  }

  // 7. Wallet scan
  const scan = await client.getScanWallet(WALLET);
  console.log(`\nWallet Summary for ${WALLET.slice(0, 8)}...`);
  console.log(`  Positions: ${scan.summary.totalPositions}`);
  console.log(`  Stakes   : ${scan.summary.totalStakes}`);
  console.log(`  Markets  : ${scan.summary.marketsLaunched}`);
}

run();
