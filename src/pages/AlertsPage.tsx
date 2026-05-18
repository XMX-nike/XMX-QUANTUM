import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Filter, Trash2, CheckCheck } from 'lucide-react';
import { useTrading } from '../context/TradingContext';

const TYPE_ICONS: Record<string, string> = {
  sentiment: '■', whale: '◆', manipulation: '⚠', signal: '◎',
};

const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, clearAllAlerts, unreadAlerts } = useTrading();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filtered = alerts.filter(a =>
    (filterType === 'All' || a.type === filterType) &&
    (filterSeverity === 'All' || a.severity === filterSeverity)
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Bell size={20} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Alerts Center</h1>
        {unreadAlerts > 0 && (
          <span style={{ background: 'var(--red)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, borderRadius: 999, padding: '0.15rem 0.6rem' }}>
            {unreadAlerts} unread
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-sm btn-outline" onClick={clearAllAlerts} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCheck size={14} /> Mark All Read
          </button>
          <button className="btn btn-sm btn-ghost" onClick={clearAllAlerts} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--red)' }}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Filter size={14} color="var(--text-muted)" />
        <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flex: '1 1 130px', minWidth: 130 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="sentiment">Sentiment</option>
          <option value="whale">Whale Activity</option>
          <option value="manipulation">Manipulation</option>
          <option value="signal">Signal</option>
        </select>
        <select className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flex: '1 1 130px', minWidth: 130 }} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option value="All">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', value: filtered.length, color: 'var(--text-primary)' },
          { label: 'Critical', value: filtered.filter(a => a.severity === 'critical').length, color: 'var(--red)' },
          { label: 'High', value: filtered.filter(a => a.severity === 'high').length, color: 'var(--orange)' },
          { label: 'Unread', value: filtered.filter(a => !a.read).length, color: 'var(--cyan)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="label">{label}</div>
            <div className="value" style={{ color, fontSize: '1.5rem' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {filtered.map((alert, i) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.04 }}
              className="card"
              style={{
                opacity: alert.read ? 0.65 : 1,
                borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--red)' : alert.severity === 'high' ? 'var(--orange)' : alert.severity === 'medium' ? 'var(--yellow)' : 'var(--green)'}`,
                cursor: 'pointer',
              }}
              onClick={() => markAlertRead(alert.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{TYPE_ICONS[alert.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{alert.title}</span>
                    {!alert.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>{alert.description}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`badge badge-${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                    {!alert.read && <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', marginLeft: 'auto' }}>Click to mark read</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Bell size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <div style={{ fontWeight: 600 }}>No alerts match your filters</div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
