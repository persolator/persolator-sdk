import type {
  PersolatorClientOptions, Market, MarketDetail, OrderBook, Trade,
  Position, ClosedPosition, ProtocolStats, LeaderboardEntry,
  FaucetInfo, FaucetStatus, FaucetClaimResult, VaultInfo, WalletBalance,
  ScanTransaction, WalletScan, OpenPositionParams, LaunchMarketParams,
  ListMarketsOptions, ListPositionsOptions, ListMarketTradesOptions,
  GetScanOptions, LeaderboardOptions,
} from "./types";

const DEFAULT_BASE_URL = "https://api.persolator.xyz";

export class PersolatorClient {
  private baseUrl: string;
  private timeout: number;

  constructor(options: PersolatorClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout ?? 10_000;
  }

  private async request<T>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) qs.set(k, String(v));
      }
      const str = qs.toString();
      if (str) url += `?${str}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const json = await res.json() as { error?: string };
          if (json.error) message = json.error;
        } catch {}
        throw new PersolatorError(message, res.status);
      }

      return res.json() as Promise<T>;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof PersolatorError) throw err;
      throw new PersolatorError(err instanceof Error ? err.message : String(err));
    }
  }

  private get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>("GET", path, undefined, params);
  }
  private post<T>(path: string, body: unknown) {
    return this.request<T>("POST", path, body);
  }
  private del<T>(path: string) {
    return this.request<T>("DELETE", path);
  }

  health() { return this.get<{ status: string }>("/health"); }

  listMarkets(options: ListMarketsOptions = {}) {
    return this.get<Market[]>("/markets", { sort: options.sort, search: options.search });
  }
  getMarket(symbol: string) {
    return this.get<MarketDetail>(`/markets/${symbol.toUpperCase()}`);
  }
  getOrderBook(symbol: string) {
    return this.get<OrderBook>(`/markets/${symbol.toUpperCase()}/orderbook`);
  }
  getMarketTrades(symbol: string, options: ListMarketTradesOptions = {}) {
    return this.get<Trade[]>(`/markets/${symbol.toUpperCase()}/trades`, {
      limit: options.limit, offset: options.offset,
    });
  }
  launchMarket(params: LaunchMarketParams) {
    return this.post<Market>("/markets", params);
  }

  getStats() { return this.get<ProtocolStats>("/stats"); }
  getTrendingMarkets(options: { limit?: number } = {}) {
    return this.get<Market[]>("/stats/trending", { limit: options.limit });
  }

  listPositions(options: ListPositionsOptions = {}) {
    return this.get<Position[]>("/positions", {
      marketSymbol: options.marketSymbol, wallet: options.wallet,
    });
  }
  getBalance(wallet: string) {
    return this.get<WalletBalance>(`/positions/balance/${wallet}`);
  }
  openPosition(params: OpenPositionParams) {
    return this.post<Position>("/positions", params);
  }
  closePosition(id: number) {
    return this.del<ClosedPosition>(`/positions/${id}`);
  }

  getFaucetInfo() { return this.get<FaucetInfo>("/faucet/info"); }
  getFaucetStatus(wallet: string) {
    return this.get<FaucetStatus>(`/faucet/status/${wallet}`);
  }
  claimFaucet(wallet: string) {
    return this.post<FaucetClaimResult>("/faucet/usdc", { wallet });
  }

  getVault() { return this.get<VaultInfo>("/vault/info"); }

  getLeaderboard(options: LeaderboardOptions = {}) {
    return this.get<LeaderboardEntry[]>("/leaderboard", { limit: options.limit });
  }

  getScanTransactions(options: GetScanOptions = {}) {
    return this.get<ScanTransaction[]>("/scan/transactions", { limit: options.limit });
  }
  getScanWallet(wallet: string) {
    return this.get<WalletScan>(`/scan/wallet/${wallet}`);
  }
}

export class PersolatorError extends Error {
  readonly statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "PersolatorError";
    this.statusCode = statusCode;
  }
}
