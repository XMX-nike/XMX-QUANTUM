import React, { useEffect, useState } from 'react';
import { Bell, Sun, Moon, Wifi } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const { balance, unreadAlerts, darkMode, toggleDarkMode, prices } = useTrading();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tickerItems = [
    { sym: 'BTCUSD', label: 'BTC' },
    { sym: 'ETHUSD', label: 'ETH' },
    { sym: 'XAUUSD', label: 'GOLD' },
    { sym: 'EURUSD', label: 'EUR/USD' },
    { sym: 'GBPUSD', label: 'GBP/USD' },
  ];

  return (
    <>
      {/* Main Top Bar */}
      <div style={{
        height: 60, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: '1rem',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Account & Balance */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance</span>
          <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div style={{ width: 1, height: 30, background: 'var(--border)' }} />

        {/* Server Status */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="status-dot" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LIVE</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Live Clock */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Wifi size={14} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/alerts')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative', padding: '0.25rem' }}
        >
          <Bell size={20} />
          {unreadAlerts > 0 && (
            <span className="notif-badge">{unreadAlerts}</span>
          )}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.4rem', display: 'flex', alignItems: 'center' }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Account Name */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), #7f00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#fff' }}>Q</div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Quaxix Pro</span>
        </div>
      </div>

      {/* Live Ticker */}
      <div style={{
        background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border)',
        overflow: 'hidden', padding: '0.35rem 0',
      }}>
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const data = prices[item.sym];
            if (!data) return null;
            const up = data.changePct >= 0;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {typeof data.price === 'number' ? data.price.toLocaleString('en-US', { minimumFractionDigits: data.price < 10 ? 4 : 2 }) : data.price}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: up ? 'var(--green)' : 'var(--red)' }}>
                  {up ? '▲' : '▼'} {Math.abs(data.changePct).toFixed(2)}%
                </span>
                <span style={{ color: 'var(--border)', marginLeft: '1rem' }}>|</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TopBar;
