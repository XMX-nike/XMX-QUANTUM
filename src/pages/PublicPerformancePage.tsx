import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Share2, TrendingUp, Award } from 'lucide-react';
import { generate90DayEquity, SUMMARY_STATS } from '../data/mockData';

const EQUITY = generate90DayEquity().filter((_, i) => i % 3 === 0);

const PublicPerformancePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const displayName = username === 'demo' ? 'Q_Alpha' : username ?? 'Trader';

  const totalReturn = (((EQUITY[EQUITY.length - 1]?.equity ?? 10000) / (EQUITY[0]?.equity ?? 10000)) - 1) * 100;
  const bestTrade = 842.30;
  const worstTrade = -312.50;
  const currentStreak = 7;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    alert('Link copied to clipboard!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.07) 0%, transparent 55%), var(--bg-primary)',
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--cyan), #7f00ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{displayName}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <Globe size={10} style={{ display: 'inline', marginRight: 3 }} />
                Public Performance Profile · XMX-QUANTUM
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Share2 size={14} /> Share Profile
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ gap: \'1rem\', marginBottom: \'1.5rem\' }}>
          {[
            { label: 'Total Return', value: `+${totalReturn.toFixed(1)}%`, color: 'var(--green)', icon: TrendingUp },
            { label: 'Win Rate', value: `${SUMMARY_STATS.winRate}%`, color: 'var(--cyan)', icon: Award },
            { label: 'Best Trade', value: `+$${bestTrade}`, color: 'var(--green)', icon: TrendingUp },
            { label: 'Worst Trade', value: `$${worstTrade}`, color: 'var(--red)', icon: TrendingUp },
            { label: 'Current Streak', value: `${currentStreak}W 🔥`, color: 'var(--orange)', icon: Award },
            { label: 'Total Trades', value: SUMMARY_STATS.totalTrades.toString(), color: 'var(--text-primary)', icon: Award },
          ].map(({ label, value, color, icon: Icon }, i) => (
            <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="label">{label}</div>
                  <div className="value" style={{ color, fontSize: '1.3rem' }}>{value}</div>
                </div>
                <Icon size={16} color={color} style={{ opacity: 0.6 }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Equity Curve */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '1.5rem' }}>
          <div className="section-header">
            <div className="section-title">90-Day Equity Curve</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starting equity: $10,000</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={EQUITY} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem' }}
                formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Equity']}
              />
              <Area type="monotone" dataKey="equity" stroke="var(--cyan)" strokeWidth={2.5} fill="url(#perfGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Social share footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            📊 Powered by <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>XMX-QUANTUM</span> — AI Trading Terminal by Quaxix Technologies
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['Twitter/X', 'Telegram', 'Discord', 'WhatsApp'].map(platform => (
              <button key={platform} className="btn btn-sm btn-outline">Share on {platform}</button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicPerformancePage;
