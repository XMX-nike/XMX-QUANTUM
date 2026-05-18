import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Inbox } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import type { Position } from '../data/mockData';

const SparkLine: React.FC<{ data: number[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width={80} height={32}>
    <LineChart data={data.map((v, i) => ({ v, i }))}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const PositionRow: React.FC<{ pos: Position; onClose: (id: string) => void }> = ({ pos, onClose }) => {
  const [flash, setFlash] = useState<'green' | 'red' | null>(null);
  const prevPnl = useRef(pos.pnl);

  useEffect(() => {
    if (pos.pnl !== prevPnl.current) {
      setFlash(pos.pnl > prevPnl.current ? 'green' : 'red');
      prevPnl.current = pos.pnl;
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
  }, [pos.pnl]);

  const pnlColor = pos.pnl >= 0 ? 'var(--green)' : 'var(--red)';

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={flash ? `flash-${flash}` : ''}
      style={{ transition: 'background 0.3s' }}
    >
      <td><span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{pos.symbol}</span></td>
      <td><span className={`badge badge-${pos.direction.toLowerCase()}`}>{pos.direction === 'BUY' ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {pos.direction}</span></td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{pos.entryPrice.toLocaleString()}</td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: pos.currentPrice >= pos.entryPrice ? 'var(--green)' : 'var(--red)' }}>{pos.currentPrice.toLocaleString()}</td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--red)' }}>{pos.sl.toLocaleString()}</td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--green)' }}>{pos.tp.toLocaleString()}</td>
      <td>
        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: pnlColor }}>
          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
        </span>
      </td>
      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{pos.duration}</td>
      <td><SparkLine data={pos.sparkline} color={pos.pnl >= 0 ? '#00ff88' : '#ff3b6b'} /></td>
      <td>
        <button className="btn btn-sm btn-red" onClick={() => onClose(pos.id)}>Close</button>
      </td>
    </motion.tr>
  );
};

const PositionsPage: React.FC = () => {
  const { positions, closePosition } = useTrading();

  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);
  const winners = positions.filter(p => p.pnl >= 0).length;

  return (
    <div className="page-wrapper">
      {/* Summary */}
      <div className="stats-grid" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Open Positions', value: positions.length.toString(), color: 'var(--cyan)' },
          { label: 'Total Float P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Winners / Losers', value: `${winners} / ${positions.length - winners}`, color: 'var(--text-primary)' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="label">{label}</div>
            <div className="value" style={{ color }}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title">Live Open Positions</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="status-dot" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-updating every 10s</span>
          </div>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          {positions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><Inbox size={40} color="var(--text-muted)" /></div>
              <div style={{ fontWeight: 600 }}>No open positions</div>
              <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>The bot will open positions when signals are detected</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Symbol</th><th>Direction</th><th>Entry</th><th>Current</th>
                  <th>SL</th><th>TP</th><th>P&L</th><th>Duration</th><th>Chart</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {positions.map(pos => (
                    <PositionRow key={pos.id} pos={pos} onClose={closePosition} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        ▶ Rows flash green/red on P&L change · Click Close to manually exit a position
      </div>
    </div>
  );
};

export default PositionsPage;
