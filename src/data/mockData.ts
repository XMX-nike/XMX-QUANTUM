// ===== XMX-QUANTUM Mock Data Layer =====
// Seeded deterministic data — swap out for real MT5 data later

export interface Position {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  lots: number;
  pnl: number;
  duration: string;
  openTime: number;
  sparkline: number[];
  strategy: string;
}

export interface Signal {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  timeframe: string;
  confidence: number;
  strategy: string;
  timestamp: string;
}

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  pnl: number;
  strategy: string;
  duration: string;
  notes: string;
  tags: string[];
}

export interface Alert {
  id: string;
  type: 'sentiment' | 'whale' | 'manipulation' | 'signal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface BotLog {
  id: string;
  time: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  btc: number;
  gold: number;
  sp500: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  monthlyReturn: number;
  totalTrades: number;
  winRate: number;
  equity: number;
}

// ===== Seeded RNG =====
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

const rng = seededRng(42);

function rand(min: number, max: number) {
  return min + rng() * (max - min);
}
void rand; // suppress unused warning

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ===== Symbols & Strategies =====
export const SYMBOLS = ['XAUUSDm', 'BTCUSDm', 'EURUSD', 'GBPUSD', 'NASDAQm', 'US30m'];
export const TIMEFRAMES = ['M5', 'M15', 'H1', 'H4', 'D1'];
export const STRATEGIES = ['Momentum AI', 'RSI Divergence', 'EMA Crossover', 'MACD Quantum', 'Order Block', 'Liquidity Sweep'];
export const TAGS = ['Swing', 'Scalp', 'Trend', 'Reversal', 'Breakout', 'News Play'];

// ===== Price Ranges =====
export const PRICE_BASES: Record<string, number> = {
  'XAUUSDm': 2385,
  'BTCUSDm': 65400,
  'EURUSD': 1.0865,
  'GBPUSD': 1.2745,
  'NASDAQm': 18420,
  'US30m': 39200,
};

// ===== Generate 90-Day Equity Curve =====
export function generate90DayEquity(): EquityPoint[] {
  const rng2 = seededRng(99);
  const points: EquityPoint[] = [];
  let equity = 10000;
  let btc = 62000;
  let gold = 2320;
  let sp500 = 5100;

  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const equityChange = (rng2() - 0.42) * 280;
    equity = Math.max(8000, equity + equityChange);
    btc += (rng2() - 0.5) * 1200;
    btc = Math.max(58000, Math.min(72000, btc));
    gold += (rng2() - 0.5) * 30;
    gold = Math.max(2280, Math.min(2520, gold));
    sp500 += (rng2() - 0.48) * 40;
    sp500 = Math.max(4800, Math.min(5400, sp500));

    points.push({
      date: label,
      equity: Math.round(equity * 100) / 100,
      btc: Math.round(btc),
      gold: Math.round(gold * 10) / 10,
      sp500: Math.round(sp500),
    });
  }
  return points;
}

// ===== Live Prices =====
export function getLivePrices(): Record<string, { price: number; change: number; changePct: number }> {
  const result: Record<string, { price: number; change: number; changePct: number }> = {};
  SYMBOLS.forEach(sym => {
    const base = PRICE_BASES[sym];
    const ch = (rng() - 0.5) * base * 0.002;
    result[sym] = {
      price: +(base + ch).toFixed(sym.includes('USD') && !sym.startsWith('B') && !sym.startsWith('X') && !sym.startsWith('N') && !sym.startsWith('U') ? 4 : 2),
      change: +ch.toFixed(2),
      changePct: +((ch / base) * 100).toFixed(2),
    };
  });
  // Add major indices for ticker
  result['BTCUSD'] = { price: 65400, change: 342, changePct: 0.52 };
  result['ETHUSD'] = { price: 3180, change: -28, changePct: -0.87 };
  result['XAUUSD'] = { price: 2387, change: 12, changePct: 0.51 };
  result['EURUSD'] = { price: 1.0865, change: 0.0012, changePct: 0.11 };
  result['GBPUSD'] = { price: 1.2745, change: -0.0034, changePct: -0.27 };
  return result;
}

// ===== Positions =====
export function generatePositions(): Position[] {
  const rng3 = seededRng(12);
  const r = (min: number, max: number) => min + rng3() * (max - min);
  return SYMBOLS.slice(0, 5).map((sym, i) => {
    const base = PRICE_BASES[sym];
    const dir: 'BUY' | 'SELL' = i % 2 === 0 ? 'BUY' : 'SELL';
    const entry = base * (1 + (r(0, 1) - 0.5) * 0.005);
    const current = entry * (1 + (r(0, 1) - 0.5) * 0.008);
    const rawPnl = (dir === 'BUY' ? current - entry : entry - current) * 1000;
    const sparkline = Array.from({ length: 20 }, (_, j) => entry + (r(0,1)-0.5)*base*0.003*j*0.1);
    return {
      id: `pos-${i}`,
      symbol: sym,
      direction: dir,
      entryPrice: +entry.toFixed(sym === 'BTCUSDm' ? 2 : sym.includes('USD') && entry > 100 ? 2 : 4),
      currentPrice: +current.toFixed(sym === 'BTCUSDm' ? 2 : sym.includes('USD') && current > 100 ? 2 : 4),
      sl: +(entry * (dir === 'BUY' ? 0.997 : 1.003)).toFixed(2),
      tp: +(entry * (dir === 'BUY' ? 1.006 : 0.994)).toFixed(2),
      lots: +r(0.01, 0.5).toFixed(2),
      pnl: +rawPnl.toFixed(2),
      duration: `${Math.floor(r(0, 8))}h ${Math.floor(r(0, 60))}m`,
      openTime: Date.now() - Math.floor(r(1000, 28800000)),
      sparkline,
      strategy: pick(STRATEGIES),
    };
  });
}

// ===== Signals =====
export function generateSignals(): Signal[] {
  const rng4 = seededRng(77);
  const r = (min: number, max: number) => min + rng4() * (max - min);
  return Array.from({ length: 12 }, (_, i) => {
    const sym = SYMBOLS[i % SYMBOLS.length];
    const minutesAgo = Math.floor(r(0, 180));
    const ts = new Date(Date.now() - minutesAgo * 60000);
    return {
      id: `sig-${i}`,
      symbol: sym,
      direction: (i % 3 === 0 ? 'SELL' : 'BUY') as 'BUY' | 'SELL',
      timeframe: TIMEFRAMES[i % TIMEFRAMES.length],
      confidence: Math.round(r(52, 97)),
      strategy: STRATEGIES[i % STRATEGIES.length],
      timestamp: ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  });
}

// ===== Trade Journal =====
export function generateTrades(): Trade[] {
  const rng5 = seededRng(55);
  const r = (min: number, max: number) => min + rng5() * (max - min);
  return Array.from({ length: 30 }, (_, i) => {
    const sym = SYMBOLS[i % SYMBOLS.length];
    const base = PRICE_BASES[sym];
    const dir: 'BUY' | 'SELL' = r(0,1) > 0.45 ? 'BUY' : 'SELL';
    const entry = base * (1 + (r(0,1)-0.5)*0.004);
    const exit = entry * (1 + (r(0,1)-0.46)*0.012);
    const pnl = (dir === 'BUY' ? exit - entry : entry - exit) * r(500, 2000);
    const d = new Date(Date.now() - i * 86400000 * r(1, 3));
    return {
      id: `trade-${i}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      symbol: sym,
      direction: dir,
      entry: +entry.toFixed(entry > 100 ? 2 : 4),
      exit: +exit.toFixed(exit > 100 ? 2 : 4),
      pnl: +pnl.toFixed(2),
      strategy: STRATEGIES[i % STRATEGIES.length],
      duration: `${Math.floor(r(0,12))}h ${Math.floor(r(0,60))}m`,
      notes: r(0,1) > 0.6 ? 'Strong momentum, clean entry' : r(0,1) > 0.4 ? 'News catalyst' : '',
      tags: [pick(TAGS)],
    };
  });
}

// ===== Alerts =====
export function generateAlerts(): Alert[] {
  const rng6 = seededRng(33);
  void rng6; // suppress unused warning
  const alerts: Alert[] = [
    { id: 'a1', type: 'whale', severity: 'critical', title: '◆ Whale Alert: BTC', description: '42,000 BTC moved to cold storage — potential sell pressure incoming', timestamp: '2m ago', read: false },
    { id: 'a2', type: 'sentiment', severity: 'high', title: '■ Sentiment Flip: XAUUSDm', description: 'Gold sentiment shifted from Bearish to Strongly Bullish across 18 major indicators', timestamp: '7m ago', read: false },
    { id: 'a3', type: 'manipulation', severity: 'high', title: '⚠ Manipulation Detected: NASDAQm', description: 'Unusual coordinated order pattern detected — likely algo wash trading', timestamp: '15m ago', read: false },
    { id: 'a4', type: 'signal', severity: 'medium', title: '◎ AI Signal Confidence: EURUSD', description: 'ML model confidence dropped below 60% threshold — reducing position size recommended', timestamp: '23m ago', read: true },
    { id: 'a5', type: 'whale', severity: 'medium', title: '◆ Large Options Activity: GBPUSD', description: '$200M in GBPUSD puts purchased ahead of BOE announcement', timestamp: '41m ago', read: true },
    { id: 'a6', type: 'sentiment', severity: 'low', title: '■ News Sentiment: ETH', description: 'ETH news sentiment trending positive — 73% bullish across 140 sources', timestamp: '1h ago', read: true },
    { id: 'a7', type: 'manipulation', severity: 'critical', title: '⚠ Coordinated Pump Detected: US30m', description: 'Multiple broker feeds showing 2-pip discrepancies suggesting coordinated manipulation', timestamp: '1.5h ago', read: true },
    { id: 'a8', type: 'signal', severity: 'low', title: '◎ Bot Milestone Reached', description: 'XMX-QUANTUM bot completed 250 trades — ML model retraining triggered', timestamp: '2h ago', read: true },
  ];
  return alerts;
}

// ===== Bot Logs =====
export function generateBotLogs(): BotLog[] {
  const messages = [
    { level: 'success' as const, message: 'TRADE OPENED: XAUUSDm BUY 0.10 @ 2387.45' },
    { level: 'info' as const, message: 'Scanning XAUUSDm M15 — EMA crossover detected' },
    { level: 'info' as const, message: 'ML Model confidence: 84.2% — Signal validated' },
    { level: 'success' as const, message: 'TRADE CLOSED: BTCUSDm BUY +$142.30 profit' },
    { level: 'info' as const, message: 'Risk check passed — Max daily trades: 4/10' },
    { level: 'warn' as const, message: 'Spread widening on GBPUSD — holding signal' },
    { level: 'info' as const, message: 'Sentiment score: EURUSD 72/100 bullish' },
    { level: 'success' as const, message: 'TRADE OPENED: BTCUSDm SELL 0.05 @ 65420.00' },
    { level: 'info' as const, message: 'Heartbeat OK — MT5 connection stable' },
    { level: 'error' as const, message: 'Retrying connection to MT5 feed...' },
    { level: 'info' as const, message: 'Reconnected to MT5 feed successfully' },
    { level: 'success' as const, message: 'TRADE CLOSED: EURUSD SELL +$88.50 profit' },
    { level: 'info' as const, message: 'Order Block detected: NASDAQm H1 — waiting for pullback' },
    { level: 'warn' as const, message: 'High-impact news in 15min — reducing lot sizes' },
    { level: 'info' as const, message: 'Recalculating equity curve — drawdown within bounds' },
    { level: 'success' as const, message: 'TRADE OPENED: XAUUSDm SELL 0.15 @ 2391.00' },
    { level: 'info' as const, message: 'Fear & Greed Index: 68 — Greed zone' },
    { level: 'success' as const, message: 'Daily P&L target reached: +$432.80' },
    { level: 'info' as const, message: 'Scanning all pairs — no new setups found' },
    { level: 'info' as const, message: 'Bot session timer: 6h 42m running' },
  ];
  const now = Date.now();
  return messages.map((m, i) => ({
    id: `log-${i}`,
    time: new Date(now - i * 45000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    level: m.level,
    message: m.message,
  }));
}

// ===== News =====
export function generateNews(): NewsItem[] {
  return [
    { id: 'n1', headline: 'Federal Reserve signals potential rate cut in Q3 — markets rally on dovish pivot', source: 'Reuters', timestamp: '4m ago', sentiment: 'bullish' },
    { id: 'n2', headline: 'Bitcoin ETF inflows hit $800M in single day — institutional demand surges', source: 'CoinDesk', timestamp: '12m ago', sentiment: 'bullish' },
    { id: 'n3', headline: 'Gold hits 3-month high as dollar weakens on soft CPI data', source: 'Bloomberg', timestamp: '28m ago', sentiment: 'bullish' },
    { id: 'n4', headline: 'EU economic data disappoints — EUR/USD falls below key support', source: 'FX Street', timestamp: '45m ago', sentiment: 'bearish' },
    { id: 'n5', headline: 'OPEC+ considers production cut extension — oil prices stabilize', source: 'Reuters', timestamp: '1h ago', sentiment: 'neutral' },
    { id: 'n6', headline: 'Tech selloff accelerates as Nvidia misses earnings estimates', source: 'WSJ', timestamp: '1.2h ago', sentiment: 'bearish' },
    { id: 'n7', headline: 'China PMI beats expectations — risk-on sentiment returns to Asian markets', source: 'Nikkei', timestamp: '2h ago', sentiment: 'bullish' },
    { id: 'n8', headline: 'UK inflation data in line with estimates — GBP steady ahead of BOE', source: 'FT', timestamp: '3h ago', sentiment: 'neutral' },
  ];
}

// ===== Monthly P&L =====
export function generateMonthlyPnl() {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const rng7 = seededRng(88);
  return months.map(m => ({
    month: m,
    pnl: Math.round((rng7() - 0.38) * 3200),
  }));
}

// ===== Win Rate By Symbol =====
export function generateWinRateBySymbol() {
  const rng8 = seededRng(21);
  return SYMBOLS.map(sym => ({
    symbol: sym,
    winRate: Math.round(50 + rng8() * 35),
  }));
}

// ===== Win Rate By Hour =====
export function generateWinRateByHour() {
  const rng9 = seededRng(56);
  return Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    winRate: Math.round(40 + rng9() * 45),
  }));
}

// ===== Win Rate By Day =====
export function generateWinRateByDay() {
  const rng10 = seededRng(67);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map(d => ({
    day: d,
    winRate: Math.round(50 + rng10() * 35),
  }));
}

// ===== Trade Distribution =====
export function generateTradeDistribution() {
  return [
    { name: 'XAUUSDm', value: 35, fill: '#00d4ff' },
    { name: 'BTCUSDm', value: 28, fill: '#00ff88' },
    { name: 'EURUSD', value: 15, fill: '#7f00ff' },
    { name: 'GBPUSD', value: 12, fill: '#ff8c00' },
    { name: 'NASDAQm', value: 6, fill: '#ff3b6b' },
    { name: 'US30m', value: 4, fill: '#ffd700' },
  ];
}

// ===== Leaderboard =====
export function generateLeaderboard(): LeaderboardEntry[] {
  const rng11 = seededRng(41);
  const names = ['Q_Alpha', 'NeonTrader', 'GoldBot_X', 'AI_Hawk', 'QuantumFX', 'SilverEdge', 'BladeRunner', 'CryptoNova', 'XAU_King', 'PipMaster'];
  return names.map((name, i) => ({
    rank: i + 1,
    username: name,
    monthlyReturn: +((rng11() * 40 + 5) * (i < 3 ? 1 : 0.7)).toFixed(1),
    totalTrades: Math.floor(rng11() * 200 + 50),
    winRate: Math.round(55 + rng11() * 30),
    equity: Math.round(10000 + rng11() * 90000),
  })).sort((a, b) => b.monthlyReturn - a.monthlyReturn).map((e, i) => ({ ...e, rank: i + 1 }));
}

// ===== Feature Importance =====
export function generateFeatureImportance() {
  return [
    { feature: 'RSI Divergence', importance: 87 },
    { feature: 'EMA Crossover', importance: 82 },
    { feature: 'Volume Profile', importance: 74 },
    { feature: 'Order Flow', importance: 68 },
    { feature: 'Sentiment Score', importance: 61 },
    { feature: 'News NLP', importance: 54 },
    { feature: 'Time of Day', importance: 49 },
    { feature: 'Spread Delta', importance: 38 },
  ];
}

// ===== Summary Stats =====
export const SUMMARY_STATS = {
  balance: 23847.50,
  todayPnl: 342.80,
  totalPnl: 13847.50,
  winRate: 78.4,
  totalTrades: 347,
  activePositions: 5,
  botSessionStart: Date.now() - 6 * 3600000 - 42 * 60000,
  fearGreedIndex: 68,
  sharpeRatio: 2.14,
  profitFactor: 3.27,
  maxDrawdown: 8.4,
  avgRR: 1.82,
  mlAccuracy: 84.2,
  mlTrainingCount: 187,
  mlLastRetrain: '2026-05-14 03:22 UTC',
  telegramSubscribers: 1247,
};
