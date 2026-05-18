import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Upload, Filter } from 'lucide-react';
import { generateTrades, SYMBOLS } from '../data/mockData';

const TRADES = generateTrades();

const TradeJournalPage: React.FC = () => {
  const [filterSym, setFilterSym] = useState('All');
  const [filterDir, setFilterDir] = useState('All');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const filtered = TRADES.filter(t =>
    (filterSym === 'All' || t.symbol === filterSym) &&
    (filterDir === 'All' || t.direction === filterDir)
  );

  const totalPnl = filtered.reduce((s, t) => s + t.pnl, 0);
  const winners = filtered.filter(t => t.pnl > 0).length;
  const winRate = filtered.length ? ((winners / filtered.length) * 100).toFixed(1) : '0';
  const bestTrade = filtered.length ? Math.max(...filtered.map(t => t.pnl)) : 0;
  const worstTrade = filtered.length ? Math.min(...filtered.map(t => t.pnl)) : 0;

  const handleExportCsv = () => {
    const header = 'Date,Symbol,Direction,Entry,Exit,P&L,Strategy,Duration,Notes,Tags\n';
    const rows = filtered.map(t =>
      `${t.date},${t.symbol},${t.direction},${t.entry},${t.exit},${t.pnl},${t.strategy},${t.duration},"${t.notes}","${t.tags.join(';')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'xmx-journal.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <BookOpen size={20} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Trade Journal</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-sm btn-outline" onClick={handleExportCsv} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Trades', value: filtered.length.toString(), color: 'var(--text-primary)' },
          { label: 'Net P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Win Rate', value: `${winRate}%`, color: 'var(--cyan)' },
          { label: 'Best Trade', value: `+$${bestTrade.toFixed(2)}`, color: 'var(--green)' },
          { label: 'Worst Trade', value: `$${worstTrade.toFixed(2)}`, color: 'var(--red)' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="label">{label}</div>
            <div className="value" style={{ color, fontSize: '1.2rem' }}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', padding: '0 0.25rem' }}>
        <Filter size={14} color="var(--text-muted)" />
        <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', minWidth: 120, flex: '1 1 120px' }} value={filterSym} onChange={e => setFilterSym(e.target.value)}>
          <option value="All">All Symbols</option>
          {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', minWidth: 100, flex: '1 1 100px' }} value={filterDir} onChange={e => setFilterDir(e.target.value)}>
          <option value="All">All Directions</option>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <input type="date" className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flex: '1 1 130px', minWidth: 130 }} value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
        <input type="date" className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flex: '1 1 130px', minWidth: 130 }} value={filterTo} onChange={e => setFilterTo(e.target.value)} />
      </div>

      {/* Table */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 12 }}>
          <table className="mobile-card-table">
            <thead>
              <tr>
                <th>Date</th><th>Symbol</th><th>Dir</th><th>Entry</th><th>Exit</th>
                <th>P&L</th><th>Strategy</th><th>Duration</th><th>Notes</th><th>Tags</th><th>Screenshot</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td data-label="Date" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.date}</td>
                  <td data-label="Symbol"><span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{t.symbol}</span></td>
                  <td data-label="Direction"><span className={`badge badge-${t.direction.toLowerCase()}`}>{t.direction}</span></td>
                  <td data-label="Entry" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{t.entry.toLocaleString()}</td>
                  <td data-label="Exit" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{t.exit.toLocaleString()}</td>
                  <td data-label="P&L">
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.88rem' }}>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                    </span>
                  </td>
                  <td data-label="Strategy" style={{ fontSize: '0.78rem', color: 'var(--cyan)' }}>{t.strategy}</td>
                  <td data-label="Duration" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.duration}</td>
                  <td data-label="Notes" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.notes || '—'}</td>
                  <td>
                    {t.tags.map(tag => (
                      <span key={tag} style={{ background: 'var(--cyan-dim)', color: 'var(--cyan)', fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: 4, marginRight: 2 }}>{tag}</span>
                    ))}
                  </td>
                  <td>
                    <label style={{ cursor: 'pointer' }}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} />
                      <span className="btn btn-sm btn-ghost" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Upload size={11} /> Upload
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TradeJournalPage;
