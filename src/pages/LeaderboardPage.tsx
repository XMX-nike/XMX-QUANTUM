import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { generateLeaderboard } from '../data/mockData';

const LEADERBOARD = generateLeaderboard();

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

const LeaderboardPage: React.FC = () => {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Trophy size={28} color="#FFD700" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>
              <span className="gradient-text">Monthly Leaderboard</span>
            </h1>
            <Trophy size={28} color="#FFD700" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Top performing accounts ranked by monthly return · Resets on the 1st of each month</p>
        </motion.div>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', padding: '0 1rem' }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((entry, i) => {
          const actualRank = i === 0 ? 1 : i === 1 ? 0 : 2;
          const heights = [160, 200, 140];
          return (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: actualRank * 0.12, type: 'spring', stiffness: 100 }}
              className={`podium-card ${i === 1 ? 'first' : i === 0 ? 'second' : 'third'}`}
              style={{
                width: 160,
                height: heights[i],
                background: 'var(--bg-card)',
                border: `2px solid ${MEDAL_COLORS[actualRank]}`,
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                paddingBottom: '1rem',
                boxShadow: `0 0 20px ${MEDAL_COLORS[actualRank]}33`,
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', fontSize: '2rem' }}>{MEDAL_EMOJIS[actualRank]}</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {entry.username[0]}
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: MEDAL_COLORS[actualRank] }}>
                {entry.username}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--green)', marginTop: '0.25rem' }}>
                +{entry.monthlyReturn}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>monthly return</div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Table */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Medal size={16} color="var(--cyan)" />
          <div className="section-title" style={{ marginBottom: 0 }}>Full Rankings</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>May 2026 · {LEADERBOARD.length} participants</span>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="mobile-card-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Trader</th>
                <th>Monthly Return</th>
                <th>Total Trades</th>
                <th>Win Rate</th>
                <th>Equity</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((entry, i) => (
                <motion.tr
                  key={entry.username}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  style={{ background: i < 3 ? `${MEDAL_COLORS[i]}08` : 'transparent' }}
                >
                  <td data-label="Rank">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {i < 3 ? (
                        <span style={{ fontSize: '1.1rem' }}>{MEDAL_EMOJIS[i]}</span>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem', width: 24, textAlign: 'center' }}>#{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Trader">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${i < 3 ? MEDAL_COLORS[i] : 'var(--cyan)'}, #0066cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.7rem', color: '#000', flexShrink: 0,
                      }}>
                        {entry.username[0]}
                      </div>
                      <span style={{ fontWeight: 600, color: i < 3 ? MEDAL_COLORS[i] : 'var(--text-primary)' }}>
                        {entry.username}
                      </span>
                    </div>
                  </td>
                  <td data-label="Monthly Return">
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--green)', fontSize: '0.95rem' }}>
                      +{entry.monthlyReturn}%
                    </span>
                  </td>
                  <td data-label="Total Trades" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {entry.totalTrades}
                  </td>
                  <td data-label="Win Rate">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: entry.winRate >= 70 ? 'var(--green)' : 'var(--cyan)' }}>
                        {entry.winRate}%
                      </span>
                    </div>
                  </td>
                  <td data-label="Equity" style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.85rem' }}>
                    ${entry.equity.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        🔒 All usernames are anonymized · Rankings update every hour · Only Pro & Elite accounts are eligible
      </div>
    </div>
  );
};

export default LeaderboardPage;
