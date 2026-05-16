import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  type Position, type Signal, type Alert, type BotLog, type NewsItem, type EquityPoint,
  generatePositions, generateSignals, generateAlerts, generateBotLogs, generateNews,
  generate90DayEquity, getLivePrices, PRICE_BASES, STRATEGIES, SYMBOLS,
  SUMMARY_STATS,
} from '../data/mockData';

interface Prices {
  [key: string]: { price: number; change: number; changePct: number };
}

interface TradingState {
  prices: Prices;
  positions: Position[];
  signals: Signal[];
  alerts: Alert[];
  botLogs: BotLog[];
  news: NewsItem[];
  equityCurve: EquityPoint[];
  balance: number;
  todayPnl: number;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  fearGreed: number;
  botRunning: boolean;
  botMode: string;
  unreadAlerts: number;
  darkMode: boolean;
  sessionStart: number;
  markAlertRead: (id: string) => void;
  clearAllAlerts: () => void;
  toggleBot: (running: boolean) => void;
  setBotMode: (mode: string) => void;
  toggleDarkMode: () => void;
  executeQuickTrade: (symbol: string, dir: 'BUY' | 'SELL', lots: number, sl: number, tp: number) => void;
  closePosition: (id: string) => void;
}

const TradingContext = createContext<TradingState | null>(null);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Prices>(getLivePrices());
  const [positions, setPositions] = useState<Position[]>(generatePositions());
  const [signals, setSignals] = useState<Signal[]>(generateSignals());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [botLogs, setBotLogs] = useState<BotLog[]>(generateBotLogs());
  const [news] = useState<NewsItem[]>(generateNews());
  const [equityCurve, setEquityCurve] = useState<EquityPoint[]>(generate90DayEquity());
  const [balance, setBalance] = useState(SUMMARY_STATS.balance);
  const [todayPnl, setTodayPnl] = useState(SUMMARY_STATS.todayPnl);
  const [totalPnl, setTotalPnl] = useState(SUMMARY_STATS.totalPnl);
  const [winRate] = useState(SUMMARY_STATS.winRate);
  const [totalTrades, setTotalTrades] = useState(SUMMARY_STATS.totalTrades);
  const [fearGreed, setFearGreed] = useState(SUMMARY_STATS.fearGreedIndex);
  const [botRunning, setBotRunning] = useState(true);
  const [botMode, setBotModeState] = useState('Plug and Play');
  const [darkMode, setDarkMode] = useState(true);
  const [sessionStart] = useState(SUMMARY_STATS.botSessionStart);

  // Use refs so interval closure always has latest values without re-registering
  const tickRef = useRef(0);
  const botRunningRef = useRef(botRunning);
  const positionsRef = useRef(positions);
  const pricesRef = useRef(prices);

  useEffect(() => { botRunningRef.current = botRunning; }, [botRunning]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);
  useEffect(() => { pricesRef.current = prices; }, [prices]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      // 1. Update prices with bounded drift
      setPrices(prev => {
        const next = { ...prev };
        Object.keys(PRICE_BASES).forEach(sym => {
          const base = PRICE_BASES[sym];
          const drift = (Math.sin(tick * 0.3 + sym.length) * 0.001 + (Math.random() - 0.5) * 0.002) * base;
          const prevPrice = prev[sym]?.price ?? base;
          const newPrice = Math.max(base * 0.97, Math.min(base * 1.03, prevPrice + drift));
          next[sym] = {
            price: +newPrice.toFixed(newPrice > 100 ? 2 : 4),
            change: +(newPrice - base).toFixed(2),
            changePct: +((newPrice - base) / base * 100).toFixed(2),
          };
        });
        const btcBase = 65400;
        const btcDrift = (Math.sin(tick * 0.25) * 0.002 + (Math.random() - 0.5) * 0.003) * btcBase;
        next['BTCUSD'] = { price: +(btcBase + btcDrift).toFixed(0), change: +btcDrift.toFixed(2), changePct: +((btcDrift / btcBase) * 100).toFixed(2) };
        next['ETHUSD'] = { price: +(3180 + (Math.random() - 0.5) * 40).toFixed(0), change: +(Math.random() - 0.5) * 20, changePct: +(Math.random() - 0.5) * 0.6 };
        next['XAUUSD'] = { price: +(2387 + (Math.random() - 0.5) * 8).toFixed(1), change: +(Math.random() - 0.5) * 5, changePct: +(Math.random() - 0.5) * 0.2 };
        return next;
      });

      // 2. Update position P&L using pricesRef (avoids stale closure)
      setPositions(prev => prev.map(pos => {
        const priceData = pricesRef.current[pos.symbol];
        if (!priceData) return pos;
        const curr = priceData.price;
        const rawPnl = (pos.direction === 'BUY' ? curr - pos.entryPrice : pos.entryPrice - curr) * 10000 * pos.lots;
        const newSparkline = [...pos.sparkline.slice(-19), curr];
        return { ...pos, currentPrice: curr, pnl: +rawPnl.toFixed(2), sparkline: newSparkline };
      }));

      // 3. Occasionally open/close a position (every 3rd tick)
      if (tick % 3 === 0 && botRunningRef.current) {
        const currentPositions = positionsRef.current;
        const shouldClose = Math.random() < 0.35 && currentPositions.length > 1;

        if (shouldClose) {
          const idx = Math.floor(Math.random() * currentPositions.length);
          const closed = currentPositions[idx];
          const profit = closed.pnl;
          // Small realistic profit/loss — capped to avoid runaway
          const realisticProfit = Math.max(-150, Math.min(200, profit));
          setBalance(b => +(b + realisticProfit).toFixed(2));
          setTodayPnl(p => +(p + realisticProfit).toFixed(2));
          setTotalPnl(p => +(p + realisticProfit).toFixed(2));
          setTotalTrades(t => t + 1);
          const newLog: BotLog = {
            id: `log-live-${tick}`,
            time: new Date().toLocaleTimeString(),
            level: realisticProfit > 0 ? 'success' : 'warn',
            message: `TRADE CLOSED: ${closed.symbol} ${closed.direction} ${realisticProfit > 0 ? '+' : ''}$${realisticProfit.toFixed(2)}`,
          };
          setBotLogs(prev => [newLog, ...prev].slice(0, 20));
          setPositions(prev => prev.filter(p => p.id !== closed.id));
        } else if (currentPositions.length < 7) {
          const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          const dir: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';
          const base = PRICE_BASES[sym];
          const entry = base * (1 + (Math.random() - 0.5) * 0.002);
          const newPos: Position = {
            id: `pos-live-${tick}`,
            symbol: sym, direction: dir,
            entryPrice: +entry.toFixed(2),
            currentPrice: +entry.toFixed(2),
            sl: +(entry * (dir === 'BUY' ? 0.997 : 1.003)).toFixed(2),
            tp: +(entry * (dir === 'BUY' ? 1.006 : 0.994)).toFixed(2),
            lots: +(Math.random() * 0.15 + 0.01).toFixed(2),
            pnl: 0, duration: '0h 0m',
            openTime: Date.now(),
            sparkline: Array(20).fill(entry),
            strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
          };
          setPositions(prev => [...prev, newPos]);
          const newLog: BotLog = {
            id: `log-open-${tick}`,
            time: new Date().toLocaleTimeString(),
            level: 'success',
            message: `TRADE OPENED: ${sym} ${dir} ${newPos.lots} @ ${entry.toFixed(2)}`,
          };
          setBotLogs(prev => [newLog, ...prev].slice(0, 20));
        }
      }

      // 4. Fear & Greed slow drift
      setFearGreed(prev => {
        const next = prev + (Math.random() - 0.5) * 1.5;
        return Math.max(10, Math.min(95, Math.round(next)));
      });

      // 5. Append equity point every 3 ticks
      if (tick % 3 === 0) {
        setEquityCurve(prev => {
          const last = prev[prev.length - 1];
          const delta = (Math.random() - 0.45) * 80;
          const newEquity = Math.max(8000, last.equity + delta);
          const now = new Date();
          return [...prev.slice(-89), {
            date: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            equity: Math.round(newEquity * 100) / 100,
            btc: Math.round(last.btc + (Math.random() - 0.5) * 300),
            gold: Math.round((last.gold + (Math.random() - 0.5) * 8) * 10) / 10,
            sp500: Math.round(last.sp500 + (Math.random() - 0.5) * 15),
          }];
        });
      }

      // 6. New signal every 5 ticks
      if (tick % 5 === 0) {
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setSignals(prev => [{
          id: `sig-live-${tick}`,
          symbol: sym,
          direction: Math.random() > 0.5 ? 'BUY' : 'SELL',
          timeframe: ['M15', 'H1', 'H4'][Math.floor(Math.random() * 3)],
          confidence: Math.round(55 + Math.random() * 40),
          strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }, ...prev].slice(0, 20));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []); // ← empty deps: interval registered ONCE only, uses refs for live data

  const markAlertRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  const toggleBot = useCallback((running: boolean) => {
    setBotRunning(running);
    botRunningRef.current = running;
  }, []);

  const setBotMode = useCallback((mode: string) => setBotModeState(mode), []);
  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const executeQuickTrade = useCallback((symbol: string, dir: 'BUY' | 'SELL', lots: number, sl: number, tp: number) => {
    const base = PRICE_BASES[symbol] ?? 1;
    const newPos: Position = {
      id: `pos-qt-${Date.now()}`, symbol, direction: dir,
      entryPrice: base, currentPrice: base,
      sl, tp, lots, pnl: 0, duration: '0h 0m',
      openTime: Date.now(), sparkline: Array(20).fill(base), strategy: 'Manual',
    };
    setPositions(prev => [...prev, newPos]);
    setBotLogs(prev => [{
      id: `log-qt-${Date.now()}`, time: new Date().toLocaleTimeString(),
      level: 'success', message: `MANUAL TRADE: ${symbol} ${dir} ${lots} lots opened`,
    }, ...prev].slice(0, 20));
  }, []);

  const closePosition = useCallback((id: string) => {
    setPositions(prev => {
      const pos = prev.find(p => p.id === id);
      if (pos) {
        const capped = Math.max(-150, Math.min(200, pos.pnl));
        setBalance(b => +(b + capped).toFixed(2));
        setTodayPnl(p => +(p + capped).toFixed(2));
        setBotLogs(prev2 => [{
          id: `log-close-${Date.now()}`, time: new Date().toLocaleTimeString(),
          level: capped >= 0 ? 'success' : 'warn',
          message: `POSITION CLOSED: ${pos.symbol} ${pos.direction} ${capped >= 0 ? '+' : ''}$${capped.toFixed(2)}`,
        }, ...prev2].slice(0, 20));
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <TradingContext.Provider value={{
      prices, positions, signals, alerts, botLogs, news, equityCurve,
      balance, todayPnl, totalPnl, winRate, totalTrades, fearGreed,
      botRunning, botMode, unreadAlerts, darkMode, sessionStart,
      markAlertRead, clearAllAlerts, toggleBot, setBotMode, toggleDarkMode,
      executeQuickTrade, closePosition,
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be inside TradingProvider');
  return ctx;
};
