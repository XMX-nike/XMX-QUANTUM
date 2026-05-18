import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Bot, Settings, AlertTriangle } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { SYMBOLS } from '../data/mockData';

const BOT_MODES = [
  { id: 'manual', label: 'Manual', desc: 'You control every trade. Bot provides signals only.', icon: '◎' },
  { id: 'plug', label: 'Plug & Play', desc: 'Fully automated. Bot opens and closes trades 24/7.', icon: '⬡' },
  { id: 'pool', label: 'Pool Trading', desc: 'Capital pooled across multiple instruments.', icon: '◈' },
  { id: 'recovery', label: 'Recovery Mode', desc: 'Aggressive recovery after drawdown periods.', icon: '↺' },
];

const RISK_LEVELS = ['Low', 'Medium', 'High'];

const BotControlPage: React.FC = () => {
  const { botRunning, botMode, botLogs, toggleBot, setBotMode } = useTrading();
  const [instrument, setInstrument] = useState(SYMBOLS[0]);
  const [lotSize, setLotSize] = useState('0.10');
  const [tradesPerSignal, setTradesPerSignal] = useState('1');
  const [riskLevel, setRiskLevel] = useState(1);
  const [customSlTp, setCustomSlTp] = useState(false);
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [confirmAction, setConfirmAction] = useState<'start' | 'stop' | 'restart' | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [botLogs]);

  const handleAction = (action: 'start' | 'stop' | 'restart') => {
    if (action === 'start') toggleBot(true);
    else if (action === 'stop') toggleBot(false);
    else { toggleBot(false); setTimeout(() => toggleBot(true), 500); }
    setConfirmAction(null);
  };

  const logColor = (level: string) => {
    if (level === 'success') return 'var(--green)';
    if (level === 'warn') return 'var(--orange)';
    if (level === 'error') return 'var(--red)';
    return 'var(--cyan)';
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Bot size={22} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Bot Control Panel</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className={`status-dot`} style={{ background: botRunning ? 'var(--green)' : 'var(--red)', boxShadow: `0 0 6px ${botRunning ? 'var(--green)' : 'var(--red)'}` }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: botRunning ? 'var(--green)' : 'var(--red)' }}>
            {botRunning ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
      </div>

      {/* START / STOP / RESTART */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
        <div className="section-title" style={{ marginBottom: '1rem' }}>Bot Control</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-green btn-lg"
            onClick={() => setConfirmAction('start')} disabled={botRunning}
            style={{ opacity: botRunning ? 0.5 : 1 }}>
            <Play size={18} /> START
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-red btn-lg"
            onClick={() => setConfirmAction('stop')} disabled={!botRunning}
            style={{ opacity: !botRunning ? 0.5 : 1 }}>
            <Square size={18} /> STOP
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-outline btn-lg"
            onClick={() => setConfirmAction('restart')}>
            <RotateCcw size={18} /> RESTART
          </motion.button>
        </div>

        {/* Confirmation */}
        {confirmAction && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--orange)', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={16} color="var(--orange)" />
            <span style={{ fontSize: '0.85rem', flex: 1 }}>Confirm <strong style={{ color: 'var(--orange)', textTransform: 'uppercase' }}>{confirmAction}</strong> action?</span>
            <button className="btn btn-sm btn-cyan" onClick={() => handleAction(confirmAction)}>Confirm</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirmAction(null)}>Cancel</button>
          </motion.div>
        )}
      </motion.div>

      {/* Trading Mode */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: '1rem' }}>
        <div className="section-title" style={{ marginBottom: '1rem' }}>Trading Mode</div>
        <div className="stats-grid" style={{ gap: '0.75rem' }}>
          {BOT_MODES.map(m => (
            <button key={m.id} onClick={() => setBotMode(m.label)}
              style={{
                background: botMode === m.label ? 'var(--cyan-dim)' : 'var(--bg-primary)',
                border: `1px solid ${botMode === m.label ? 'var(--cyan)' : 'var(--border)'}`,
                borderRadius: 10, padding: '1rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: botMode === m.label ? 'var(--cyan)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>{m.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{m.desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <div className="charts-grid-2" style={{ marginBottom: '1rem' }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Settings size={16} color="var(--cyan)" />
            <div className="section-title" style={{ marginBottom: 0 }}>Trading Parameters</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Instrument</label>
              <select className="form-input" value={instrument} onChange={e => setInstrument(e.target.value)}>
                {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lot Size</label>
              <input className="form-input" type="number" step="0.01" min="0.01" value={lotSize} onChange={e => setLotSize(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trades Per Signal</label>
              <input className="form-input" type="number" min="1" max="5" value={tradesPerSignal} onChange={e => setTradesPerSignal(e.target.value)} />
            </div>
            {/* Risk Level */}
            <div className="form-group">
              <label className="form-label">Risk Level — <span style={{ color: ['var(--green)', 'var(--orange)', 'var(--red)'][riskLevel], fontWeight: 700 }}>{RISK_LEVELS[riskLevel]}</span></label>
              <input type="range" min="0" max="2" step="1" value={riskLevel} onChange={e => setRiskLevel(Number(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Low</span><span>Medium</span><span>High</span>
              </div>
            </div>
            {/* Custom SL/TP */}
            <div>
              <label className="toggle-wrapper" onClick={() => setCustomSlTp(v => !v)}>
                <div className={`toggle ${customSlTp ? 'active' : ''}`} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Custom SL / TP</span>
              </label>
              {customSlTp && (
                <div className="grid-2" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">Stop Loss (pips)</label><input className="form-input" type="number" value={sl} onChange={e => setSl(e.target.value)} placeholder="e.g. 30" /></div>
                  <div className="form-group"><label className="form-label">Take Profit (pips)</label><input className="form-input" type="number" value={tp} onChange={e => setTp(e.target.value)} placeholder="e.g. 60" /></div>
                </div>
              )}
            </div>
            <button className="btn btn-cyan" style={{ width: '100%', justifyContent: 'center' }}>Save Parameters</button>
          </div>
        </motion.div>

        {/* Bot Log Terminal */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Live Bot Log</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div className="status-dot" />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Auto-scrolling</span>
            </div>
          </div>
          <div className="bot-terminal" ref={logRef}>
            {botLogs.map(log => (
              <div key={log.id} className="log-line">
                <span className="log-time">{log.time}</span>
                <span style={{ color: logColor(log.level) }}>{log.message}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BotControlPage;
