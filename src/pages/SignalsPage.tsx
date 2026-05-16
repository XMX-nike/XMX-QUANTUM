import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { SYMBOLS, TIMEFRAMES } from '../data/mockData';

const SignalsPage: React.FC = () => {
  const { signals } = useTrading();
  const [filterSym, setFilterSym] = useState('All');
  const [filterTf, setFilterTf] = useState('All');

  const filtered = signals.filter(s =>
    (filterSym === 'All' || s.symbol === filterSym) &&
    (filterTf === 'All' || s.timeframe === filterTf)
  );

  const confidenceColor = (c: number) => c >= 80 ? 'var(--green)' : c >= 65 ? 'var(--cyan)' : 'var(--orange)';

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: 'auto' }}>
          <Zap size={20} color="var(--cyan)" />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Signal Feed</h1>
          <div className="status-dot" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LIVE</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }} value={filterSym} onChange={e => setFilterSym(e.target.value)}>
            <option value="All">All Symbols</option>
            {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }} value={filterTf} onChange={e => setFilterTf(e.target.value)}>
            <option value="All">All Timeframes</option>
            {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ gap: \'1rem\', marginBottom: \'1.25rem\' }}>
        {[
          { label: 'Total Signals', value: filtered.length.toString(), color: 'var(--cyan)' },
          { label: 'BUY Signals', value: filtered.filter(s => s.direction === 'BUY').length.toString(), color: 'var(--green)' },
          { label: 'SELL Signals', value: filtered.filter(s => s.direction === 'SELL').length.toString(), color: 'var(--red)' },
          { label: 'Avg Confidence', value: filtered.length ? `${Math.round(filtered.reduce((s, x) => s + x.confidence, 0) / filtered.length)}%` : 'N/A', color: 'var(--cyan)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="label">{label}</div>
            <div className="value" style={{ color, fontSize: '1.4rem' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Signals Grid */}
      <div className="stats-grid" style={{ gap: \'1rem\' }}>
        <AnimatePresence>
          {filtered.map((sig, i) => (
            <motion.div
              key={sig.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04 }}
              className="card"
              style={{
                border: `1px solid ${sig.direction === 'BUY' ? 'rgba(0,255,136,0.25)' : 'rgba(255,59,107,0.25)'}`,
                background: sig.direction === 'BUY' ? 'rgba(0,255,136,0.03)' : 'rgba(255,59,107,0.03)',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{sig.symbol}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{sig.timeframe}</span>
                </div>
                <span className={`badge badge-${sig.direction.toLowerCase()}`}>
                  {sig.direction === 'BUY' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {' '}{sig.direction}
                </span>
              </div>

              {/* Strategy */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{sig.strategy}</span> · {sig.timestamp}
              </div>

              {/* Confidence bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>AI Confidence</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: confidenceColor(sig.confidence), fontFamily: 'var(--font-mono)' }}>{sig.confidence}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${sig.confidence}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ background: confidenceColor(sig.confidence) }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Zap size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <div style={{ fontWeight: 600 }}>No signals match your filters</div>
        </div>
      )}
    </div>
  );
};

export default SignalsPage;
