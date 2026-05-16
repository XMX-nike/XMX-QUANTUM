import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { SYMBOLS, PRICE_BASES } from '../data/mockData';

interface Props { onClose: () => void; }

const QuickTrade: React.FC<Props> = ({ onClose }) => {
  const { executeQuickTrade } = useTrading();
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [dir, setDir] = useState<'BUY' | 'SELL'>('BUY');
  const [lots, setLots] = useState('0.10');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [done, setDone] = useState(false);

  const base = PRICE_BASES[symbol] ?? 1;

  const handleExecute = () => {
    executeQuickTrade(symbol, dir, parseFloat(lots) || 0.1, parseFloat(sl) || base * 0.997, parseFloat(tp) || base * 1.006);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '1.1rem' }}>Trade Executed!</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{symbol} {dir} {lots} lots</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Symbol */}
      <div className="form-group">
        <label className="form-label">Symbol</label>
        <select className="form-input" value={symbol} onChange={e => setSymbol(e.target.value)}>
          {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Direction */}
      <div className="form-group">
        <label className="form-label">Direction</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${dir === 'BUY' ? 'btn-green' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setDir('BUY')}
          >▲ BUY</button>
          <button
            className={`btn ${dir === 'SELL' ? 'btn-red' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setDir('SELL')}
          >▼ SELL</button>
        </div>
      </div>

      {/* Lot Size */}
      <div className="form-group">
        <label className="form-label">Lot Size</label>
        <input className="form-input" type="number" step="0.01" min="0.01" value={lots} onChange={e => setLots(e.target.value)} />
      </div>

      {/* SL & TP */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label">Stop Loss</label>
          <input className="form-input" type="number" placeholder={`${(base * 0.997).toFixed(2)}`} value={sl} onChange={e => setSl(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Take Profit</label>
          <input className="form-input" type="number" placeholder={`${(base * 1.006).toFixed(2)}`} value={tp} onChange={e => setTp(e.target.value)} />
        </div>
      </div>

      {/* Market Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Market Price</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan)', fontSize: '0.9rem' }}>{base.toFixed(2)}</span>
      </div>

      {/* Execute */}
      <button
        className={`btn ${dir === 'BUY' ? 'btn-green' : 'btn-red'} btn-lg`}
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleExecute}
      >
        Execute {dir} Order
      </button>
    </div>
  );
};

export default QuickTrade;
