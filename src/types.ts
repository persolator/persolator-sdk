export type MarketStatus = "active" | "paused" | "settling";
export type OracleType = "dex" | "pyth" | "authority";
export type PositionSide = "long" | "short";
export type PositionStatus = "open" | "closed" | "liquidated";
export type SortOrder = "volume" | "openInterest" | "newest" | "gainers" | "losers";
export type TxType =
  | "open_position"
  | "close_position"
  | "stake"
  | "unstake"
  | "launch_market"
  | "faucet";

export interface Market {
  id: number;
  symbol: string;
  baseToken: string;
  quoteToken: string;
  tokenAddress: string;
  logoUrl?: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  maxLeverage: number;
  tradingFee: number;
  status: MarketStatus;
  oracleType: OracleType;
  creator: string;
  txHash: string | null;
  insuranceFund: number;
  totalTrades: number;
  launchedAt: string;
  createdAt: string;
}

export interface MarketDetail {
  market: Market;
  longRatio: number;
  shortRatio: number;
  liquidations24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  vammPrice: number;
  markPrice: number;
  indexPrice: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  marketSymbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  midPrice: number;
}

export interface Trade {
  id: number;
  marketSymbol: string;
  side: PositionSide;
  size: number;
  price: number;
  fee: number;
  wallet: string;
  txHash: string | null;
  executedAt: string;
}

export interface Position {
  id: number;
  marketSymbol: string;
  side: PositionSide;
  size: number;
  collateral: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  status: PositionStatus;
  wallet: string;
  txHash: string | null;
  closeTxHash: string | null;
  openedAt: string;
  closedAt: string | null;
}

export interface ClosedPosition extends Position {
  payout: number;
  payoutTx: string | null;
}

export interface ProtocolStats {
  totalVolume24h: number;
  totalOpenInterest: number;
  totalMarkets: number;
  activeTraders: number;
  totalTrades: number;
  totalFeesGenerated: number;
  insuranceFundTotal: number;
  topMarkets: Market[];
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  totalPnl: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalTrades: number;
  closedPositions: number;
  liquidations: number;
  winRate: number;
  totalVolume: number;
}

export interface FaucetInfo {
  usdcPerClaim: number;
}

export interface FaucetStatus {
  claimed: boolean;
  canClaim: boolean;
  nextClaimAt?: string;
}

export interface FaucetClaimResult {
  success: boolean;
  txHash: string;
  wallet: string;
  amount: number;
  explorerUrl: string;
}

export interface VaultInfo {
  vaultAddress: string;
  usdcMint: string;
  vaultAta: string;
  solBalance: number;
  usdcBalance: number;
  network: string;
}

export interface WalletBalance {
  wallet: string;
  usdcBalance: number;
}

export interface ScanTransaction {
  hash: string;
  type: TxType;
  wallet: string;
  timestamp: string;
  id: string;
  meta: Record<string, unknown>;
}

export interface WalletScan {
  wallet: string;
  transactions: ScanTransaction[];
  summary: {
    totalPositions: number;
    totalStakes: number;
    marketsLaunched: number;
  };
}

export interface OpenPositionParams {
  marketSymbol: string;
  side: PositionSide;
  collateral: number;
  leverage: number;
  wallet: string;
  txHash: string;
}

export interface LaunchMarketParams {
  symbol: string;
  baseToken: string;
  tokenAddress: string;
  maxLeverage: number;
  tradingFee: number;
  oracleType: OracleType;
  seedLiquidity?: number;
  creator: string;
  txHash?: string;
}

export interface ListMarketsOptions {
  sort?: SortOrder;
  search?: string;
}

export interface ListPositionsOptions {
  marketSymbol?: string;
  wallet?: string;
}

export interface ListMarketTradesOptions {
  limit?: number;
  offset?: number;
}

export interface GetScanOptions {
  limit?: number;
}

export interface LeaderboardOptions {
  limit?: number;
}

export interface PersolatorClientOptions {
  baseUrl?: string;
  timeout?: number;
}
