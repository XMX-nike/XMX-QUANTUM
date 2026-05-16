import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Percent, Activity, Layers, Clock, Newspaper } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { SUMMARY_STATS } from '../data/mockData';

// ===== Fear & Greed SVG Arc Gauge =====
const FearGreedGauge: React.FC<{ value: number }> = ({ value }) => {
  const size = 200;
  const cx = size / 2, cy = size / 2 + 20;
  const r = 70;
  const startAngle = -210;
  const totalAngle = 240;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)), y: cy + r * Math.sin(toRad(end)) };
    const large = Math.abs(end - start) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const zones = [
    { from: 0, to: 25, color: '#ff3b6b', label: 'Fear' },
    { from: 25, to: 45, color: '#ff8c00', label: 'Caution' },
    { from: 45, to: 55, color: '#ffd700', label: 'Neutral' },
    { from: 55, to: 75, color: '#00d4ff', label: 'Greed' },
    { from: 75, to: 100, color: '#00ff88', label: 'Extreme Greed' },
  ];

  const valToAngle = (v: number) => startAngle + (v / 100) * totalAngle;
  const needleAngle = valToAngle(value);

  const getColor = (v: number) => {
    if (v < 25) return '#ff3b6b';
    if (v < 45) return '#ff8c00';
    if (v < 55) return '#ffd700';
    if (v < 75) return '#00d4ff';
    return '#00ff88';
  };

  const getLabel = (v: number) => {
    if (v < 25) return 'Extreme Fear';
    if (v < 45) return 'Fear';
    if (v < 55) return 'Neutral';
    if (v < 75) return 'Greed';
    return 'Extreme Greed';
  };

  const color = getColor(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size - 10} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arcs */}
        {zones.map(z => {
          const sa = valToAngle(z.from);
          const ea = valToAngle(z.to);
          return (
            <path key={z.label} d={arcPath(sa, ea)} fill="none" stroke={z.color}
              strokeWidth={10} strokeLinecap="round" opacity={0.25} />
          );
        })}
        {/* Filled arc */}
        <path d={arcPath(startAngle, valToAngle(value))} fill="none" stroke={color}
          strokeWidth={10} strokeLinecap="round" opacity={0.9} />

        {/* Needle */}
        <motion.line
          animate={{ rotate: needleAngle + 90 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          x1={cx} y1={cy}
          x2={cx + (r - 16) * Math.cos(toRad(needleAngle))}
          y2={cy + (r - 16) * Math.sin(toRad(needleAngle))}
          stroke={color} strokeWidth={2.5} strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill={color} />

        {/* Center value */}
        <text x={cx} y={cy + 28} textAnchor="middle" fill={color} fontSize="22" fontWeight="900" fontFamily="JetBrains Mono, monospace">{value}</text>
        <text x={cx} y={cy + 44} textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">{getLabel(value)}</text>
      </svg>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-0.5rem' }}>
        {zones.map(z => (
          <span key={z.label} style={{ fontSize: '0.62rem', color: z.color, opacity: 0.7 }}>{z.label}</span>
        ))}
      </div>
    </div>
  );
};

// ===== Session Timer =====
const SessionTimer: React.FC<{ start: number }> = ({ start }) => {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const elapsed = Math.floor((Date.now() - start) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return <span style={{ fontFamily: 'var(--font-mono)' }}>{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>;
};

// ===== Custom Tooltip =====
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', fontSize: '0.78rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</div>
      ))}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { balance, todayPnl, totalPnl, winRate, totalTrades, positions, fearGreed, equityCurve, news, sessionStart } = useTrading();

  const normalizedCurve = useMemo(() => {
    const first = equityCurve[0];
    if (!first) return equityCurve;
    const btcBase = first.btc;
    const goldBase = first.gold;
    const sp500Base = first.sp500;
    const equityBase = first.equity;
    return equityCurve.map(p => ({
      ...p,
      equityNorm: +((p.equity / equityBase - 1) * 100).toFixed(2),
      btcNorm: +((p.btc / btcBase - 1) * 100).toFixed(2),
      goldNorm: +((p.gold / goldBase - 1) * 100).toFixed(2),
      sp500Norm: +((p.sp500 / sp500Base - 1) * 100).toFixed(2),
    }));
  }, [equityCurve]);

  const STAT_CARDS = [
    { label: 'Balance', value: `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'var(--cyan)', change: null },
    { label: "Today's P&L", value: `${todayPnl >= 0 ? '+' : ''}$${todayPnl.toFixed(2)}`, icon: TrendingUp, color: todayPnl >= 0 ? 'var(--green)' : 'var(--red)', change: `${todayPnl >= 0 ? '+' : ''}${((todayPnl / balance) * 100).toFixed(2)}%` },
    { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: TrendingDown, color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)', change: null },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, icon: Percent, color: 'var(--cyan)', change: null },
    { label: 'Total Trades', value: totalTrades.toString(), icon: Activity, color: 'var(--text-secondary)', change: null },
    { label: 'Active Positions', value: positions.length.toString(), icon: Layers, color: 'var(--cyan)', change: null },
    { label: 'Bot Session', value: <SessionTimer start={sessionStart} />, icon: Clock, color: 'var(--green)', change: null },
  ];

  const sentimentColor = (s: string) => s === 'bullish' ? 'var(--green)' : s === 'bearish' ? 'var(--red)' : 'var(--text-muted)';
  const sentimentLabel = (s: string) => s === 'bullish' ? '🟢 Bullish' : s === 'bearish' ? '🔴 Bearish' : '⚪ Neutral';

  const displayCurve = equityCurve.filter((_, i) => i % 3 === 0 || i === equityCurve.length - 1);

  return (
    <div className="page-wrapper">
      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, change }, i) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="label">{label}</div>
                <div className="value" style={{ color, fontSize: label === 'Bot Session' ? '1.2rem' : undefined }}>{value}</div>
                {change && <div className="change" style={{ color }}>{change}</div>}
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid-3" style={{ gap: \'1rem\', marginBottom: \'1rem\' }}>
        {/* Equity Curve */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="section-header">
            <div className="section-title">90-Day Equity Curve</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live updates every 10s</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={displayCurve} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="equity" stroke="var(--cyan)" strokeWidth={2} fill="url(#equityGrad)" dot={false} name="Equity ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fear & Greed */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="section-title" style={{ marginBottom: '1rem' }}>Fear & Greed Index</div>
          <FearGreedGauge value={fearGreed} />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Index: <span style={{ color: fearGreed > 55 ? 'var(--green)' : fearGreed < 45 ? 'var(--red)' : 'var(--yellow)', fontWeight: 700 }}>{fearGreed}</span> / 100
          </div>
        </motion.div>
      </div>

      {/* Performance Comparison */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '1rem' }}>
        <div className="section-header">
          <div className="section-title">Performance vs Benchmarks (%)</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Normalized from start of period</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={normalizedCurve.filter((_, i) => i % 3 === 0 || i === normalizedCurve.length - 1)} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} />
            <Line type="monotone" dataKey="equityNorm" name="XMX-QUANTUM" stroke="var(--cyan)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="btcNorm" name="Bitcoin" stroke="#f7931a" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="goldNorm" name="Gold" stroke="#ffd700" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="sp500Norm" name="S&P500" stroke="#7f00ff" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* News Feed */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <div className="section-header">
          <div className="section-title"><Newspaper size={16} />Live News Feed</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {news.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: i < news.length - 1 ? '1px solid rgba(30,52,84,0.4)' : 'none' }}>
              <span className="badge" style={{ background: `${sentimentColor(item.sentiment)}18`, color: sentimentColor(item.sentiment), border: `1px solid ${sentimentColor(item.sentiment)}`, flexShrink: 0, fontSize: '0.6rem' }}>
                {sentimentLabel(item.sentiment)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--text-primary)' }}>{item.headline}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.source} · {item.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
