import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import {
  generateMonthlyPnl, generateWinRateBySymbol, generateWinRateByHour,
  generateWinRateByDay, generateTradeDistribution, SUMMARY_STATS,
} from '../data/mockData';
import { useTrading } from '../context/TradingContext';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', fontSize: '0.78rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color ?? 'var(--cyan)', fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' ? (p.name?.includes('%') || p.dataKey === 'winRate' ? `${p.value}%` : p.value.toLocaleString()) : p.value}
        </div>
      ))}
    </div>
  );
};

const MONTHLY_PNL = generateMonthlyPnl();
const WIN_BY_SYM = generateWinRateBySymbol();
const WIN_BY_HOUR = generateWinRateByHour();
const WIN_BY_DAY = generateWinRateByDay();
const TRADE_DIST = generateTradeDistribution();

const AnalyticsPage: React.FC = () => {
  const { equityCurve } = useTrading();
  const normalizedCurve = (() => {
    const first = equityCurve[0];
    if (!first) return equityCurve;
    return equityCurve.filter((_, i) => i % 3 === 0).map(p => ({
      ...p,
      xmx: +((p.equity / first.equity - 1) * 100).toFixed(2),
      btc: +((p.btc / first.btc - 1) * 100).toFixed(2),
      gold: +((p.gold / first.gold - 1) * 100).toFixed(2),
      sp500: +((p.sp500 / first.sp500 - 1) * 100).toFixed(2),
    }));
  })();

  const SUMMARY = [
    { label: 'Sharpe Ratio', value: SUMMARY_STATS.sharpeRatio.toFixed(2), color: 'var(--cyan)' },
    { label: 'Profit Factor', value: SUMMARY_STATS.profitFactor.toFixed(2), color: 'var(--green)' },
    { label: 'Max Drawdown', value: `-${SUMMARY_STATS.maxDrawdown}%`, color: 'var(--red)' },
    { label: 'Avg Risk:Reward', value: `1:${SUMMARY_STATS.avgRR}`, color: 'var(--cyan)' },
  ];

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Analytics & Performance</h1>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
        {SUMMARY.map(({ label, value, color }) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="label">{label}</div>
            <div className="value" style={{ color, fontSize: '1.5rem' }}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Monthly P&L + Win by Symbol */}
      <div className="charts-grid-2" style={{ marginBottom: '1rem' }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="section-header"><div className="section-title">Monthly P&L</div></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_PNL} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pnl" name="P&L ($)" radius={[4, 4, 0, 0]}>
                {MONTHLY_PNL.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? 'var(--green)' : 'var(--red)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="section-header"><div className="section-title">Win Rate by Symbol</div></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WIN_BY_SYM} layout="vertical" margin={{ top: 5, right: 30, bottom: 0, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="symbol" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="winRate" name="Win Rate" fill="var(--cyan)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2: Win by Hour + Win by Day */}
      <div className="charts-grid-2" style={{ marginBottom: '1rem' }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-header"><div className="section-title">Win Rate by Hour of Day</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WIN_BY_HOUR} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 8 }} interval={3} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="winRate" name="Win Rate" radius={[2, 2, 0, 0]}>
                {WIN_BY_HOUR.map((entry, i) => (
                  <Cell key={i} fill={entry.winRate >= 70 ? '#00ff88' : entry.winRate >= 55 ? '#00d4ff' : entry.winRate >= 45 ? '#ffd700' : '#ff3b6b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="section-header"><div className="section-title">Win Rate by Day of Week</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WIN_BY_DAY} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="winRate" name="Win Rate" fill="var(--cyan)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 3: Trade Distribution + Performance Comparison */}
      <div className="charts-grid-2" style={{ marginBottom: '1rem' }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-header"><div className="section-title">Trade Distribution by Symbol</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <ResponsiveContainer width="60%" height={200} minWidth={180}>
              <PieChart>
                <Pie data={TRADE_DIST} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {TRADE_DIST.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {TRADE_DIST.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: d.fill }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="section-header"><div className="section-title">vs Benchmarks (%)</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={normalizedCurve.slice(-30)} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
              <Line type="monotone" dataKey="xmx" name="XMX-QUANTUM" stroke="var(--cyan)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="btc" name="BTC" stroke="#f7931a" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="gold" name="Gold" stroke="#ffd700" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="sp500" name="S&P500" stroke="#7f00ff" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
