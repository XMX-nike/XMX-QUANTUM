import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, Zap, BarChart3, Bot, Bell,
  BookOpen, Brain, Send, Settings, Trophy, Globe,
  ChevronLeft, ChevronRight, Plus, X, TrendingUp
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import TopBar from './TopBar';
import QuickTrade from './QuickTrade';
import LogoIcon from '../components/LogoIcon';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/positions', icon: Activity, label: 'Positions' },
  { path: '/signals', icon: Zap, label: 'Signals' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/bot', icon: Bot, label: 'Bot Control' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/journal', icon: BookOpen, label: 'Trade Journal' },
  { path: '/ml', icon: Brain, label: 'ML Model' },
  { path: '/telegram', icon: Send, label: 'Telegram' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/performance/demo', icon: Globe, label: 'Performance' },
];

const MOBILE_NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/positions', icon: Activity, label: 'Positions' },
  { path: '/signals', icon: Zap, label: 'Signals' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showQuickTrade, setShowQuickTrade] = useState(false);
  const { unreadAlerts } = useTrading();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 100,
          overflow: 'hidden',
        }}
        className="desktop-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: 60 }}>
          <LogoIcon size={36} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cyan)', letterSpacing: '0.05em' }}>XMX-QUANTUM</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 1 }}>by Quaxix Technologies</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: collapsed ? '0.75rem' : '0.65rem 1rem',
                  margin: '0.1rem 0.5rem',
                  borderRadius: 8,
                  background: isActive ? 'var(--cyan-dim)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                  color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={18} />
                  {!collapsed && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
                  )}
                  {label === 'Alerts' && unreadAlerts > 0 && (
                    <span style={{
                      background: 'var(--red)', color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                      borderRadius: 999, padding: '1px 5px', marginLeft: 'auto',
                      ...(collapsed ? { position: 'absolute', top: 4, right: 4 } : {})
                    }}>{unreadAlerts}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            margin: '0.75rem 0.5rem', padding: '0.5rem', border: '1px solid var(--border)',
            borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>Collapse</span>}
        </button>
      </motion.aside>

      {/* Main area */}
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 64 : 220,
        display: 'flex', flexDirection: 'column',
        transition: 'margin-left 0.3s',
        minHeight: '100vh',
        minWidth: 0,
        maxWidth: 'calc(100vw - ' + (collapsed ? '64px' : '220px') + ')',
        overflowX: 'hidden',
      }} className="main-area">
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '1rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        display: 'none', zIndex: 100, padding: '0.5rem 0',
      }} className="mobile-nav">
        {MOBILE_NAV.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '0.25rem' }}>
            {({ isActive }) => (
              <>
                <div style={{ color: isActive ? 'var(--cyan)' : 'var(--text-muted)', position: 'relative' }}>
                  <Icon size={20} />
                  {label === 'Alerts' && unreadAlerts > 0 && (
                    <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--red)', color: '#fff', fontSize: '0.55rem', borderRadius: 999, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadAlerts}</span>
                  )}
                </div>
                <span style={{ fontSize: '0.6rem', color: isActive ? 'var(--cyan)' : 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Trade FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQuickTrade(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--cyan), #0099cc)',
          border: 'none', color: '#000', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px var(--cyan-glow)',
          zIndex: 150,
        }}
        className="fab-btn"
      >
        <Plus size={24} />
      </motion.button>

      {/* Quick Trade Drawer */}
      <AnimatePresence>
        {showQuickTrade && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="drawer-overlay"
              onClick={() => setShowQuickTrade(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="drawer"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--cyan)" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Quick Trade</span>
                </div>
                <button onClick={() => setShowQuickTrade(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <QuickTrade onClose={() => setShowQuickTrade(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-nav { display: flex !important; }
          .main-area { margin-left: 0 !important; }
          .fab-btn { bottom: 5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
