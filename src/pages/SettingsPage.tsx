import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, Calculator, Key, AlertTriangle, Trash2 } from 'lucide-react';
import { useTrading } from '../context/TradingContext';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTrading();
  const [broker, setBroker] = useState('IC Markets');
  const [accountNum, setAccountNum] = useState('4872910');
  const [server, setServer] = useState('ICMarketsSC-Demo01');
  const [defaultSl, setDefaultSl] = useState('30');
  const [defaultTp, setDefaultTp] = useState('60');
  const [defaultLot, setDefaultLot] = useState('0.10');
  const [maxDailyTrades, setMaxDailyTrades] = useState('10');
  const [lunarApiKey, setLunarApiKey] = useState('lc_••••••••••••••••');
  const [telegramToken, setTelegramToken] = useState('74128••••:AAF••••••••••');

  // Risk calculator
  const [riskLot, setRiskLot] = useState('0.10');
  const [riskSl, setRiskSl] = useState('30');
  const [riskTp, setRiskTp] = useState('60');
  const [riskBalance] = useState(23847.5);
  const potentialLoss = parseFloat(riskLot) * parseFloat(riskSl) * 10;
  const potentialProfit = parseFloat(riskLot) * parseFloat(riskTp) * 10;
  const riskPct = ((potentialLoss / riskBalance) * 100).toFixed(2);

  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }> = ({ icon, title, children, delay = 0 }) => (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ color: 'var(--cyan)' }}>{icon}</div>
        <div className="section-title" style={{ marginBottom: 0 }}>{title}</div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Settings size={22} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Settings</h1>
      </div>

      {/* Account Settings */}
      <Section icon={<User size={18} />} title="Account Settings" delay={0}>
        <div className="grid-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Broker</label>
            <input className="form-input" value={broker} onChange={e => setBroker(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input className="form-input" value={accountNum} onChange={e => setAccountNum(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">MT5 Server</label>
            <input className="form-input" value={server} onChange={e => setServer(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-cyan" style={{ marginTop: '1rem' }}>Save Account Settings</button>
      </Section>

      {/* Trading Preferences */}
      <Section icon={<Shield size={18} />} title="Trading Preferences" delay={0.06}>
        <div className="grid-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Default SL (pips)</label>
            <input className="form-input" type="number" value={defaultSl} onChange={e => setDefaultSl(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Default TP (pips)</label>
            <input className="form-input" type="number" value={defaultTp} onChange={e => setDefaultTp(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Default Lot Size</label>
            <input className="form-input" type="number" step="0.01" value={defaultLot} onChange={e => setDefaultLot(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Daily Trades</label>
            <input className="form-input" type="number" value={maxDailyTrades} onChange={e => setMaxDailyTrades(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-cyan" style={{ marginTop: '1rem' }}>Save Preferences</button>
      </Section>

      {/* Risk Calculator */}
      <Section icon={<Calculator size={18} />} title="Risk Calculator" delay={0.1}>
        <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Lot Size</label>
            <input className="form-input" type="number" step="0.01" value={riskLot} onChange={e => setRiskLot(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">SL (pips)</label>
            <input className="form-input" type="number" value={riskSl} onChange={e => setRiskSl(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">TP (pips)</label>
            <input className="form-input" type="number" value={riskTp} onChange={e => setRiskTp(e.target.value)} />
          </div>
        </div>
        <div className="grid-3" style={{ gap: '1rem' }}>
          {[
            { label: 'Potential Profit', value: `+$${potentialProfit.toFixed(2)}`, color: 'var(--green)' },
            { label: 'Potential Loss', value: `-$${potentialLoss.toFixed(2)}`, color: 'var(--red)' },
            { label: 'Risk %', value: `${riskPct}%`, color: parseFloat(riskPct) > 2 ? 'var(--red)' : 'var(--cyan)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color }}>{value}</div>
            </div>
          ))}
        </div>
        {parseFloat(riskPct) > 2 && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,59,107,0.1)', border: '1px solid rgba(255,59,107,0.3)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={14} /> Risk exceeds 2% — consider reducing lot size
          </div>
        )}
      </Section>

      {/* API Keys */}
      <Section icon={<Key size={18} />} title="API Keys" delay={0.14}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">LunarCrush API Key</label>
            <input className="form-input" type="password" value={lunarApiKey} onChange={e => setLunarApiKey(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Telegram Bot Token</label>
            <input className="form-input" type="password" value={telegramToken} onChange={e => setTelegramToken(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-cyan" style={{ marginTop: '1rem' }}>Update API Keys</button>
      </Section>

      {/* Theme Toggle */}
      <Section icon={<Settings size={18} />} title="Appearance" delay={0.18}>
        <label className="toggle-wrapper" onClick={toggleDarkMode}>
          <div className={`toggle ${darkMode ? 'active' : ''}`} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Dark Mode</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{darkMode ? 'Dark mode active — Bloomberg terminal aesthetic' : 'Light mode active'}</div>
          </div>
        </label>
      </Section>

      {/* Danger Zone */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
        style={{ border: '1px solid rgba(255,59,107,0.4)', background: 'rgba(255,59,107,0.03)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <AlertTriangle size={18} color="var(--red)" />
          <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: '0.9rem' }}>Danger Zone</div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          These actions are irreversible. All trade history, settings, and bot configurations will be permanently deleted.
        </p>
        <button className="btn btn-red" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => confirm('Are you sure? This will reset ALL data.') && console.log('Reset requested')}>
          <Trash2 size={16} /> Reset All Data
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
