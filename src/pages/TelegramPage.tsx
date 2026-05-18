import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Copy, Users } from 'lucide-react';
import { SUMMARY_STATS } from '../data/mockData';

const SIGNAL_PREVIEW = `[XQ] *XMX-QUANTUM Signal*
━━━━━━━━━━━━━━━━
■ Symbol: *XAUUSDm*
▲ Direction: *BUY*
◆ Timeframe: *H1*
◎ Confidence: *84%*
□ Strategy: *EMA Crossover*
━━━━━━━━━━━━━━━━
$ Entry: 2387.45
↓ SL: 2373.00
↑ TP: 2415.00
━━━━━━━━━━━━━━━━
▶ Powered by XMX-QUANTUM`;

const TelegramPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [botToken, setBotToken] = useState('7412839641:AAF...');
  const [channelId, setChannelId] = useState('@xmxquantum_signals');
  const [testSent, setTestSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SIGNAL_PREVIEW).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Send size={22} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Telegram Integration</h1>
      </div>

      <div className="charts-grid-2">
        {/* Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Enable/Disable */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Telegram Signals</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Send live AI signals to your Telegram channel</div>
              </div>
              <label className="toggle-wrapper" onClick={() => setEnabled(v => !v)}>
                <div className={`toggle ${enabled ? 'active' : ''}`} />
              </label>
            </div>
            {enabled && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 8 }}>
                <CheckCircle size={14} color="var(--green)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600 }}>Integration Active — Signals are being forwarded</span>
              </div>
            )}
          </motion.div>

          {/* Bot Token */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <div className="section-title" style={{ marginBottom: '1rem' }}>Bot Configuration</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Bot Token</label>
                <input
                  className="form-input"
                  type="password"
                  value={botToken}
                  onChange={e => setBotToken(e.target.value)}
                  placeholder="Enter your @BotFather token"
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Get from <span style={{ color: 'var(--cyan)' }}>@BotFather</span> on Telegram
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Channel ID / Username</label>
                <input
                  className="form-input"
                  type="text"
                  value={channelId}
                  onChange={e => setChannelId(e.target.value)}
                  placeholder="@yourchannel or -1001234567890"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <motion.button
                  className="btn btn-cyan"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleTest}
                  whileTap={{ scale: 0.97 }}
                  disabled={testSent}
                >
                  {testSent ? <><CheckCircle size={14} /> Sent!</> : <><Send size={14} /> Send Test Signal</>}
                </motion.button>
                <button className="btn btn-outline">Save Config</button>
              </div>
            </div>
          </motion.div>

          {/* Subscriber Count */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, background: 'var(--cyan-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} color="var(--cyan)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Channel Subscribers</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                  {SUMMARY_STATS.telegramSubscribers.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Signal Preview */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Signal Format Preview</div>
            <button className="btn btn-sm btn-outline" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Telegram bubble mockup */}
          <div style={{ background: '#17212b', borderRadius: 12, padding: '1rem', border: '1px solid #2b3847' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #2b3847' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), #0066cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#000' }}>XQ</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>XMX-QUANTUM Bot</div>
                <div style={{ fontSize: '0.65rem', color: '#7a9ab5' }}>bot</div>
              </div>
            </div>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#e8f4fd',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              margin: 0,
            }}>{SIGNAL_PREVIEW}</pre>
            <div style={{ fontSize: '0.65rem', color: '#4a6a85', textAlign: 'right', marginTop: '0.5rem' }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ✓✓
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--cyan-dim)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: 600, marginBottom: '0.25rem' }}>What gets forwarded:</div>
            <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1rem', lineHeight: 1.8 }}>
              <li>New AI signals with confidence ≥ {65}%</li>
              <li>Trade open / close notifications</li>
              <li>Daily P&L summary at 23:00 UTC</li>
              <li>Critical alerts (severity: high/critical)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TelegramPage;
