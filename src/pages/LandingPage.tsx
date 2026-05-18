import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Shield, Lock, Clock, Zap, BarChart2, Bot,
  TrendingUp, Globe, Brain, Target, ChevronDown, ChevronUp,
  Check, Gift, Menu, X, Sun, Moon, Sparkles, Diamond,
  Activity, Award, Layers, BookOpen,
  ExternalLink, Share2, Code2, AtSign, DollarSign,
} from 'lucide-react';
import LogoIcon from '../components/LogoIcon';

// ─── Theme Context ────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';

// ─── Typewriter Hook ─────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 55) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    setShowCursor(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        // Blink cursor 3 times then hide
        let blinks = 0;
        const blink = setInterval(() => {
          setShowCursor(v => !v);
          blinks++;
          if (blinks >= 6) { clearInterval(blink); setShowCursor(false); }
        }, 400);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done, showCursor };
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
const ParticleCanvas: React.FC<{ theme: Theme }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const N = 80;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = theme === 'dark' ? '255,255,255' : '100,80,180';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

// ─── Pricing Card ─────────────────────────────────────────────────────────────
interface PricingPlan {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  badge?: string;
  badgeColor?: string;
  borderColor: string;
  nameColor: string;
  btnLabel: string;
  btnStyle: 'outline-dark' | 'solid-purple' | 'solid-orange';
  checkColor: string;
  features: string[];
}

const PLANS: PricingPlan[] = [
  {
    name: 'Basic',
    tagline: 'Perfect for getting started with AI trading.',
    monthly: 29,
    annual: 23,
    borderColor: '#e2e8f0',
    nameColor: '#1a1a2e',
    btnLabel: 'Get Started',
    btnStyle: 'outline-dark',
    checkColor: '#94a3b8',
    features: [
      '3 Instruments',
      '50 Trades/Month',
      'Basic AI Signals',
      'Email Alerts',
      'Community Access',
      'Mobile App',
      'Basic Analytics',
      'Trade Journal',
      'Email Support',
      '14-Day Free Trial',
    ],
  },
  {
    name: 'Pro',
    tagline: 'The complete toolkit for serious traders.',
    monthly: 79,
    annual: 63,
    badge: 'Most Popular',
    badgeColor: '#7c3aed',
    borderColor: '#7c3aed',
    nameColor: '#7c3aed',
    btnLabel: 'Get Started',
    btnStyle: 'solid-purple',
    checkColor: '#7c3aed',
    features: [
      '6 Instruments',
      'Unlimited Trades',
      'Quantum AI Signals',
      'Telegram Alerts',
      'Analytics Dashboard',
      'Bot Control',
      'Trade Journal',
      'Priority Support',
      'ML Model Access',
      'Backtesting Studio',
      'Market Heatmap',
      'Position Calculator',
      'API Access',
    ],
  },
  {
    name: 'Elite',
    tagline: 'Institutional-grade power for professionals.',
    monthly: 199,
    annual: 159,
    badge: 'Elite',
    badgeColor: '#d97706',
    borderColor: '#d97706',
    nameColor: '#d97706',
    btnLabel: 'Go Elite',
    btnStyle: 'solid-orange',
    checkColor: '#d97706',
    features: [
      'Everything in Pro',
      'Custom Strategies',
      'Dedicated Manager',
      'White-label Option',
      'Custom Instruments',
      'SLA Guarantee',
      'Direct AI Analysis',
      'MT5 Cloud Bots',
      'Free VPS Included',
      'Voice AI Interaction',
      'Unlimited MT5 Accounts',
      '24/7 Bot Monitoring',
      'White-glove Support',
    ],
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Does XMX-QUANTUM work with my broker?', a: 'Yes — XMX-QUANTUM integrates with any MT5-compatible broker. We support 200+ regulated brokers worldwide including IC Markets, Pepperstone, XM, and more. Setup takes under 2 minutes.' },
  { q: 'What instruments can I trade?', a: 'XAUUSDm (Gold), BTCUSDm (Bitcoin), EURUSD, GBPUSD, NASDAQm, and US30m. Elite plan includes custom instrument support for any MT5-listed asset.' },
  { q: 'Is my capital safe?', a: 'Absolutely. XMX-QUANTUM is 100% non-custodial — your funds never leave your broker account. We only send trade signals via the MT5 API. You retain full control at all times.' },
  { q: 'What kind of performance can I expect?', a: 'XMX-QUANTUM is in active Beta. Performance varies by market conditions, instrument, and risk settings. We do not publish guaranteed win rates — all trading involves risk and past signal performance is not indicative of future results. Use the built-in analytics dashboard to track your own live performance.' },
  { q: 'Can I run the bot 24/7?', a: 'Yes — Pro and Elite plans include cloud-hosted bot execution. Your bot runs 24/7 on our infrastructure even when your PC is off. Zero downtime, zero maintenance.' },
  { q: 'What is the refund policy?', a: 'All plans include a 14-day money-back guarantee. If you are not satisfied for any reason within 14 days of purchase, contact support for a full refund — no questions asked.' },
  { q: 'How does the ML model work?', a: 'Our Quantum AI model is trained on 10M+ historical trades using a proprietary ensemble of LSTM, XGBoost, and transformer architectures. It continuously retrains on live market data every 24 hours.' },
];

// ─── Features Data ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Brain, tag: 'CORE ENGINE', title: 'Quantum AI Signals', desc: 'Proprietary ML models trained on extensive historical market data generate sub-second, high-probability signals with adaptive accuracy across multiple instruments.' },
  { icon: Zap, tag: 'EXECUTION', title: 'Sub-Second Execution', desc: 'Direct MT5 integration with smart order routing ensures your trades execute at the best available price, every time.' },
  { icon: Shield, tag: 'RISK', title: 'Adaptive Risk Shield', desc: 'Automated stop-loss, take-profit, and drawdown protection dynamically adjusts to volatility to keep capital safe 24/7.' },
  { icon: BarChart2, tag: 'ANALYTICS', title: 'Institutional Analytics', desc: 'Deep-dive metrics: Sharpe ratio, profit factor, win-rate heatmaps, benchmark comparison, and custom dashboards.' },
  { icon: Bot, tag: 'AUTOMATION', title: 'Autonomous Bot Engine', desc: 'Set it and forget it. Cloud-hosted bot runs 24/7, scanning 6 instruments and executing trades while you sleep.' },
  { icon: Globe, tag: 'MARKETS', title: 'Multi-Instrument Coverage', desc: 'Trade XAUUSDm, BTCUSDm, EURUSD, GBPUSD, NASDAQm, and US30m from one unified, institutional-grade terminal.' },
  { icon: Activity, tag: 'ML MODEL', title: 'ML Model Dashboard', desc: 'Monitor live model performance, feature importance, and retrain triggers. Full transparency into every AI decision.' },
  { icon: Lock, tag: 'SECURITY', title: 'Non-Custodial Security', desc: 'Your capital never leaves your broker account. XMX-QUANTUM only sends signals via MT5 API — zero custody risk.' },
  { icon: BookOpen, tag: 'JOURNAL', title: 'Trade Journal & Replay', desc: 'Automatically log every trade with entry/exit screenshots, P&L attribution, and strategy tagging for continuous improvement.' },
];

// ─── Product Showcase (replaces fake testimonials) ────────────────────────────
const PRODUCT_SHOWCASE = [
  { icon: Brain, title: 'Quantum AI Signal Engine', desc: 'Multi-layer ML models analyze price action, volume, and sentiment across 6 instruments simultaneously — delivering high-probability signals directly to your terminal.', tag: 'AI CORE' },
  { icon: Shield, title: 'Adaptive Risk Management', desc: 'Dynamic stop-loss and take-profit levels adjust automatically to real-time volatility. Drawdown protection kicks in before losses compound — keeping your capital safe.', tag: 'RISK SHIELD' },
  { icon: BarChart2, title: 'Institutional Analytics Suite', desc: 'Sharpe ratio, profit factor, win-rate heatmaps, benchmark comparisons, and equity curve analysis — the same tools used by professional trading desks, now in your hands.', tag: 'ANALYTICS' },
];

// ─── About Cards ──────────────────────────────────────────────────────────────
const ABOUT_CARDS = [
  { icon: Target, title: 'Our Vision', desc: 'XMX-QUANTUM empowers retail traders with institutional-grade AI tools — democratizing access to the same technology used by hedge funds and prop trading desks.' },
  { icon: Brain, title: 'Our Technology', desc: 'Advanced quantum-inspired ML models analyze 6 instruments across 12 timeframes simultaneously, providing multi-dimensional market insights in real time.' },
  { icon: TrendingUp, title: 'User Benefits', desc: 'Access smart AI signals, adaptive risk management, institutional analytics, and a 24/7 autonomous bot — all from a single, professional-grade terminal.' },
  { icon: Shield, title: 'Our Commitment', desc: 'We are committed to full transparency, non-custodial security, and continuous model improvement. Your capital stays in your account — always.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const headline = 'The AI Trading Terminal That Thinks Faster Than Markets';
  const { displayed, showCursor } = useTypewriter(headline, 45);

  // Scroll listener for navbar glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-landing-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  // ─── Theme-aware styles ───────────────────────────────────────────────────
  const T = {
    bg: theme === 'light' ? '#ffffff' : '#0d0d1a',
    bgSoft: theme === 'light' ? '#f8f7ff' : '#111128',
    bgCard: theme === 'light' ? '#ffffff' : '#1a1a2e',
    text: theme === 'light' ? '#1a1a2e' : '#f0f0ff',
    textMuted: theme === 'light' ? '#64748b' : '#8892b0',
    textSecondary: theme === 'light' ? '#475569' : '#a8b2d8',
    border: theme === 'light' ? '#e2e8f0' : '#1e3454',
    borderBright: theme === 'light' ? '#cbd5e1' : '#2d4a7a',
    purple: '#7c3aed',
    purpleLight: theme === 'light' ? '#f5f3ff' : '#1e1040',
    purpleMid: theme === 'light' ? '#ede9fe' : '#2d1b69',
    navBg: scrolled
      ? theme === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(13,13,26,0.85)'
      : 'transparent',
    navBorder: scrolled ? (theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)') : 'transparent',
    heroGradient: theme === 'light'
      ? 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(196,181,253,0.5) 0%, rgba(251,207,232,0.35) 35%, rgba(254,240,220,0.2) 60%, rgba(255,255,255,0) 80%)'
      : 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(124,58,237,0.25) 0%, rgba(139,92,246,0.15) 35%, rgba(167,139,250,0.08) 60%, transparent 80%)',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: "'Inter', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: T.navBg, borderBottom: `1px solid ${T.navBorder}`,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 max(1.5rem, calc((100vw - 1200px) / 2))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <LogoIcon
              size={32}
              showWordmark
              wordmarkSize={15}
              wordmarkColor={T.text}
              showSubtitle
              subtitleColor={T.textMuted}
            />
          </Link>

          {/* Desktop nav links */}
          <div className="landing-nav-links" style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                textDecoration: 'none', color: T.textMuted, fontSize: '0.875rem', fontWeight: 500,
                padding: '0.4rem 0.75rem', borderRadius: 8, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = T.purple; e.currentTarget.style.background = T.purpleLight; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = 'transparent'; }}
              >{item}</a>
            ))}
          </div>

          {/* Right side */}
          <div className="landing-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Theme toggle */}
            <button onClick={toggleTheme} title="Toggle theme" style={{
              background: T.purpleLight, border: `1px solid ${T.border}`, borderRadius: 8,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: T.purple, transition: 'all 0.2s',
            }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/login" style={{
              textDecoration: 'none', color: T.text, fontSize: '0.875rem', fontWeight: 500,
              padding: '0.4rem 0.9rem', borderRadius: 8, border: `1px solid ${T.border}`,
              background: 'transparent', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.purple; e.currentTarget.style.color = T.purple; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
            >Sign In</Link>
            <Link to="/dashboard" style={{
              textDecoration: 'none', background: T.purple, color: '#fff',
              fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 1.1rem',
              borderRadius: 100, transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(124,58,237,0.3)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >Start Free Trial</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="landing-hamburger" onClick={() => setMobileMenuOpen(v => !v)} style={{
            display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
            color: T.text, padding: '0.25rem',
          }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 999,
              background: T.bg, padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}
          >
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none', color: T.text, fontSize: '1.1rem', fontWeight: 600,
                  padding: '0.75rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`,
                }}
              >{item}</a>
            ))}
            <div style={{ height: 1, background: T.border, margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: T.textMuted, fontSize: '0.875rem' }}>Theme</span>
              <button onClick={toggleTheme} style={{
                background: T.purpleLight, border: `1px solid ${T.border}`, borderRadius: 8,
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: T.purple,
              }}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
              textDecoration: 'none', color: T.text, fontSize: '1rem', fontWeight: 600,
              padding: '0.75rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`,
              textAlign: 'center',
            }}>Sign In</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{
              textDecoration: 'none', background: T.purple, color: '#fff',
              fontSize: '1rem', fontWeight: 700, padding: '0.85rem 1rem',
              borderRadius: 100, textAlign: 'center',
            }}>Start Free Trial</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '6rem 1.5rem 4rem', overflow: 'hidden',
      }}>
        {/* Gradient background */}
        <div style={{ position: 'absolute', inset: 0, background: T.heroGradient, pointerEvents: 'none' }} />
        {/* Particle canvas */}
        <ParticleCanvas theme={theme} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: theme === 'light' ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.2)',
            border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 100,
            padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 600,
            color: T.purple, marginBottom: '2rem', position: 'relative', zIndex: 1,
          }}
        >
          <Sparkles size={14} />
          NOW POWERED BY QUANTUM AI V3.0
        </motion.div>

        {/* Headline with typewriter */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.15,
            maxWidth: 820, margin: '0 auto 1.5rem', position: 'relative', zIndex: 1,
            color: T.text,
          }}
        >
          {displayed.includes('Thinks') ? (
            <>
              {displayed.split('Thinks')[0]}
              <span style={{ color: T.purple }}>Thinks</span>
              {displayed.split('Thinks')[1] || ''}
            </>
          ) : displayed}
          {showCursor && <span style={{ borderRight: `3px solid ${T.purple}`, marginLeft: 2, animation: 'none' }}>|</span>}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: T.textSecondary,
            maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.75,
            position: 'relative', zIndex: 1,
          }}
        >
          XMX-QUANTUM combines institutional-grade Quantum AI with autonomous bot execution to give retail traders an unfair edge. Professional terminal. Zero compromise.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}
        >
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2rem', borderRadius: 100, fontSize: '0.95rem', fontWeight: 700,
            background: T.purple, color: '#fff', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(124,58,237,0.35)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 30px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
          >
            Start Trading Now <ArrowRight size={16} />
          </Link>
          <a href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2rem', borderRadius: 100, fontSize: '0.95rem', fontWeight: 600,
            background: 'transparent', color: T.text, textDecoration: 'none',
            border: `1.5px solid ${T.border}`, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.purple; e.currentTarget.style.color = T.purple; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
          >
            <Play size={15} fill="currentColor" /> See How It Works
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}
        >
          {[
            { icon: Clock, text: '14-Day Money Back' },
            { icon: Lock, text: 'Non-Custodial' },
            { icon: Activity, text: '24/7 Bot Uptime' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: T.textMuted }}>
              <Icon size={14} color={T.purple} /> {text}
            </div>
          ))}
        </motion.div>

        {/* Value props bar */}
        {/* BETA badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', zIndex: 1, position: 'relative' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))',
            border: '1px solid rgba(124,58,237,0.4)', borderRadius: 100,
            padding: '0.35rem 1.1rem', fontSize: '0.78rem', fontWeight: 700,
            color: T.purple, letterSpacing: '0.05em',
          }}>
            <Sparkles size={13} /> BETA — Early Access
          </div>
        </motion.div>

        {/* Value props grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="stats-bar-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
            marginTop: '1.5rem', position: 'relative', zIndex: 1, width: '100%', maxWidth: 800,
          }}
        >
          {[
            { icon: Brain, label: 'Institutional-Grade AI Engine' },
            { icon: Activity, label: 'Real-Time Market Sentiment' },
            { icon: Zap, label: 'ML-Powered Signals' },
            { icon: Bot, label: '24/7 Autonomous Execution' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: '1.1rem 1.5rem', textAlign: 'center',
              boxShadow: theme === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : '0 2px 12px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            }}>
              <Icon size={22} color={T.purple} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '6rem 1.5rem', background: T.bgSoft }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1rem' }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, margin: '0 0 1rem', color: T.text }}>
              Everything You Need to <span style={{ color: T.purple }}>Dominate the Markets</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
              Built for serious traders who demand professional-grade tools without institutional fees.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Sidebar tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 220, flex: '0 0 220px' }} className="features-sidebar">
              {FEATURES.map((f, i) => (
                <button key={i} onClick={() => setActiveFeature(i)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 10, border: 'none',
                  background: activeFeature === i ? T.purpleLight : 'transparent',
                  color: activeFeature === i ? T.purple : T.textMuted,
                  cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500,
                  transition: 'all 0.2s',
                  borderLeft: activeFeature === i ? `3px solid ${T.purple}` : '3px solid transparent',
                }}>
                  <f.icon size={16} />
                  {f.title}
                </button>
              ))}
            </div>

            {/* Feature detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{
                  flex: 1, background: T.bgCard, borderRadius: 20,
                  border: `1px solid ${T.border}`, padding: '2.5rem',
                  boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)',
                  minHeight: 280,
                }}
              >
                <div style={{ display: 'inline-block', background: T.purpleLight, borderRadius: 8, padding: '0.3rem 0.7rem', fontSize: '0.7rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                  {FEATURES[activeFeature].tag}
                </div>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: T.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {React.createElement(FEATURES[activeFeature].icon, { size: 26, color: T.purple })}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>
                  {FEATURES[activeFeature].title}
                </h3>
                <p style={{ color: T.textSecondary, lineHeight: 1.75, fontSize: '1rem' }}>
                  {FEATURES[activeFeature].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature grid for mobile */}
          <div className="features-grid-mobile" style={{ display: 'none', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: T.bgCard, borderRadius: 16, border: `1px solid ${T.border}`,
                padding: '1.5rem', boxShadow: theme === 'light' ? '0 2px 12px rgba(0,0,0,0.05)' : 'none',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: T.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {React.createElement(f.icon, { size: 20, color: T.purple })}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{f.tag}</div>
                <h4 style={{ fontWeight: 700, color: T.text, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{f.title}</h4>
                <p style={{ color: T.textMuted, fontSize: '0.82rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: T.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1rem' }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, margin: '0 0 1rem', color: T.text }}>
            Live in <span style={{ color: T.purple }}>3 Simple Steps</span>
          </h2>
          <p style={{ color: T.textMuted, marginBottom: '4rem' }}>From sign-up to your first AI trade in under 5 minutes.</p>

          <div style={{ display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            {[
              { num: '01', icon: Layers, title: 'Connect Your Broker', desc: 'Link your MT5 account in under 2 minutes. We support 200+ regulated brokers worldwide with zero configuration required.' },
              { num: '02', icon: Brain, title: 'AI Scans the Markets', desc: 'Our Quantum AI engine continuously monitors 6 instruments across multiple timeframes, identifying high-probability setups in real time.' },
              { num: '03', icon: TrendingUp, title: 'Execute & Profit', desc: 'Signals are executed automatically by the bot, or manually reviewed via the terminal. Full control, zero compromise.' },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    flex: '1 1 240px', maxWidth: 280, padding: '2rem 1.5rem',
                    background: T.bgCard, borderRadius: 20, border: `1px solid ${T.border}`,
                    boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', background: T.purple,
                    color: '#fff', fontWeight: 800, fontSize: '1.1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>{step.num}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <step.icon size={22} color={T.purple} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>{step.title}</h3>
                  <p style={{ color: T.textMuted, fontSize: '0.875rem', lineHeight: 1.7 }}>{step.desc}</p>
                </motion.div>
                {i < 2 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: T.purple, opacity: 0.4 }} className="step-connector">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '6rem 1.5rem', background: T.bgSoft, overflow: 'visible', paddingTop: '7rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', overflow: 'visible' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1rem' }}>PRICING</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', color: T.text }}>
              Simple, <span style={{ color: T.purple }}>Transparent Pricing</span>
            </h2>
            <p style={{ color: T.textMuted, marginBottom: '1.5rem' }}>Choose the plan that fits your trading needs. Upgrade or downgrade anytime.</p>

            {/* Money back badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #16a34a', borderRadius: 100, padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#16a34a', marginBottom: '2rem' }}>
              <Shield size={14} color="#16a34a" /> 7-Day Money-Back Guarantee
            </div>

            {/* Billing toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: billing === 'monthly' ? T.text : T.textMuted }}>Monthly</span>
              <button onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')} style={{
                width: 52, height: 28, borderRadius: 100, border: 'none', cursor: 'pointer',
                background: billing === 'annual' ? T.purple : T.border,
                position: 'relative', transition: 'background 0.3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, transition: 'left 0.3s',
                  left: billing === 'annual' ? 27 : 3,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: billing === 'annual' ? T.text : T.textMuted }}>Annual</span>
              <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100 }}>Save 20%</span>
            </div>
          </div>

          {/* Pricing cards — always 3 in a row on desktop */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'stretch', flexWrap: 'nowrap', paddingBottom: '0.5rem', paddingTop: '2.5rem', overflow: 'visible' }} className="pricing-cards-row">
            {PLANS.map((plan) => {
              const price = billing === 'monthly' ? plan.monthly : plan.annual;
              const isPopular = plan.badge === 'Most Popular';
              const isElite = plan.badge === 'Elite';
              return (
                <div key={plan.name} style={{
                  flex: '1 1 0', minWidth: 0, background: T.bgCard,
                  borderRadius: 20, border: `2px solid ${plan.borderColor}`,
                  padding: '2rem 1.75rem', position: 'relative',
                  marginTop: (isPopular || isElite) ? '35px' : '0',
                  overflow: 'visible',
                  boxShadow: isPopular
                    ? `0 8px 40px rgba(124,58,237,0.15)`
                    : isElite
                      ? `0 8px 40px rgba(217,119,6,0.12)`
                      : theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Floating badge */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                      background: plan.badgeColor, color: '#fff',
                      fontSize: '0.72rem', fontWeight: 700, padding: '0.3rem 0.9rem',
                      borderRadius: 100, whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      zIndex: 10, boxShadow: `0 2px 12px ${plan.badgeColor}66`,
                    }}>
                      {isElite && <Diamond size={11} />}
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan name */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: plan.nameColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{plan.name}</div>
                  <p style={{ fontSize: '0.85rem', color: T.textMuted, marginBottom: '1.25rem', lineHeight: 1.5 }}>{plan.tagline}</p>

                  {/* Price */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: plan.nameColor }}>${price}</span>
                    <span style={{ color: T.textMuted, fontSize: '0.875rem' }}>/mo</span>
                    {billing === 'annual' && <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.2rem' }}>Billed annually</div>}
                  </div>

                  {/* CTA Button — BEFORE feature list */}
                  <Link to="/login" style={{
                    display: 'block', textAlign: 'center', textDecoration: 'none',
                    padding: '0.75rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700,
                    marginBottom: '1.5rem', transition: 'all 0.2s',
                    ...(plan.btnStyle === 'outline-dark' ? {
                      border: `1.5px solid ${T.border}`, color: T.text, background: 'transparent',
                    } : plan.btnStyle === 'solid-purple' ? {
                      background: T.purple, color: '#fff', border: 'none',
                      boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                    } : {
                      background: '#d97706', color: '#fff', border: 'none',
                      boxShadow: '0 4px 16px rgba(217,119,6,0.25)',
                    }),
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                  >{plan.btnLabel}</Link>

                  {/* Divider */}
                  <div style={{ height: 1, background: T.border, marginBottom: '1.5rem' }} />

                  {/* Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: T.textSecondary }}>
                        <Check size={15} color={plan.checkColor} style={{ flexShrink: 0, marginTop: 2 }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Money back */}
                  <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: T.textMuted, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <Shield size={12} color={T.textMuted} /> 14-Day Money Back Guarantee
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REFERRAL ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: theme === 'light' ? '#f5f3ff' : '#120d2e' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: T.purple,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Gift size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: T.purple, margin: '0 0 1rem' }}>
            Refer Friends, Earn Real Money
          </h2>
          <p style={{ color: T.textSecondary, fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 520, margin: '0 auto 2rem' }}>
            Share XMX-QUANTUM with your friends and earn cash rewards when they subscribe. Your earnings are withdrawable directly to your preferred payment method.
          </p>

          {/* Info pills */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 100, padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, color: T.text }}>
              <DollarSign size={15} color="#16a34a" /> Earn Cash Per Referral
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 100, padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, color: T.text }}>
              <Award size={15} color="#2563eb" /> Easy Withdrawals
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              textDecoration: 'none', padding: '0.8rem 1.75rem', borderRadius: 100,
              border: `1.5px solid ${T.purple}`, color: T.purple, fontWeight: 600,
              fontSize: '0.9rem', background: 'transparent', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.purpleLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >Learn More</Link>
            <Link to="/login" style={{
              textDecoration: 'none', padding: '0.8rem 1.75rem', borderRadius: 100,
              background: T.purple, color: '#fff', fontWeight: 700,
              fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              <Gift size={16} /> Start Earning Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: '6rem 1.5rem', background: T.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: T.text, margin: 0 }}>
              About <span style={{ color: T.purple }}>XMX-QUANTUM</span>
            </h2>
            <p style={{ color: T.textMuted, marginTop: '0.75rem' }}>
              We are revolutionizing trading by combining artificial intelligence with proven market strategies.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ABOUT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                  background: T.bgCard, borderRadius: 16, border: `1px solid ${T.border}`,
                  padding: '1.5rem', boxShadow: theme === 'light' ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.icon size={22} color={T.purple} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '0.4rem', fontSize: '1rem' }}>{card.title}</h3>
                  <p style={{ color: T.textMuted, fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI ANALYSIS ENGINE ──────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: T.bgSoft }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            background: theme === 'light' ? '#f5f3ff' : '#1a1040',
            border: `1px solid rgba(124,58,237,0.2)`,
            borderRadius: 24, padding: '2.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={26} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: '1rem' }}>AI Analysis Engine</div>
                  <div style={{ color: T.textMuted, fontSize: '0.8rem' }}>Processing market data</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 8px #16a34a', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>LIVE</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { value: '6', label: 'Instruments Covered' },
                { value: '24/7', label: 'Market Monitoring' },
                { value: '12', label: 'Timeframes Analyzed' },
                { value: 'BETA', label: 'Early Access' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: T.bgCard, borderRadius: 12, padding: '1.25rem',
                  border: `1px solid ${T.border}`, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: T.purple }}>{stat.value}</div>
                  <div style={{ fontSize: '0.78rem', color: T.textMuted, marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '6rem 1.5rem', background: T.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1rem' }}>TESTIMONIALS</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: T.text, margin: 0 }}>
              Built By Traders, <span style={{ color: T.purple }}>For Traders</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {PRODUCT_SHOWCASE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: T.bgCard, borderRadius: 20, border: `1px solid ${T.border}`,
                  padding: '2rem', boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                }}
              >
                <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.25rem 0.75rem', fontSize: '0.68rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
                  {item.tag}
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.createElement(item.icon, { size: 24, color: T.purple })}
                </div>
                <h3 style={{ fontWeight: 700, color: T.text, fontSize: '1.05rem', margin: 0 }}>{item.title}</h3>
                <p style={{ color: T.textSecondary, fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '6rem 1.5rem', background: T.bgSoft }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: T.purpleLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '1rem' }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: T.text, margin: 0 }}>
              Frequently Asked <span style={{ color: T.purple }}>Questions</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: T.bgCard, borderRadius: 14, border: `1px solid ${openFaq === i ? T.purple : T.border}`,
                overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1.1rem 1.5rem', background: 'transparent', border: 'none',
                    cursor: 'pointer', color: T.text, fontWeight: 600, fontSize: '0.9rem', textAlign: 'left',
                    gap: '1rem',
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} color={T.purple} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={T.textMuted} style={{ flexShrink: 0 }} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 1.5rem 1.25rem', color: T.textMuted, fontSize: '0.875rem', lineHeight: 1.75 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '6rem 1.5rem', textAlign: 'center',
        background: theme === 'light'
          ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)'
          : 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #9333ea 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem' }}>
            Ready to Trade Like an Institution?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            XMX-QUANTUM is in Beta. Be among the first to experience institutional-grade AI trading. Start your 14-day free trial today — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{
              textDecoration: 'none', background: '#fff', color: T.purple,
              padding: '0.9rem 2.25rem', borderRadius: 100, fontWeight: 700, fontSize: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <a href="#pricing" style={{
              textDecoration: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff',
              padding: '0.9rem 2.25rem', borderRadius: 100, fontWeight: 600, fontSize: '1rem',
              border: '1.5px solid rgba(255,255,255,0.4)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            >View Pricing</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: theme === 'light' ? '#0f0a1e' : '#080612', color: '#94a3b8', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '3rem' }} className="footer-grid">

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <LogoIcon
                  size={24}
                  showWordmark
                  wordmarkSize={14}
                  wordmarkColor="#f0f0ff"
                />
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 220 }}>
                Institutional-grade AI trading terminal for serious traders worldwide.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                  { icon: Share2, label: 'Twitter', href: '#' },
                  { icon: ExternalLink, label: 'LinkedIn', href: '#' },
                  { icon: Code2, label: 'GitHub', href: '#' },
                  { icon: AtSign, label: 'Instagram', href: '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} title={label} style={{
                    width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#a78bfa'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontWeight: 700, color: '#f0f0ff', fontSize: '0.875rem', marginBottom: '1rem' }}>Platform</div>
              {['Dashboard', 'Bot Control', 'Analytics', 'Signals', 'Trade Journal', 'ML Model'].map(link => (
                <Link key={link} to="/dashboard" style={{ display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                >{link}</Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontWeight: 700, color: '#f0f0ff', fontSize: '0.875rem', marginBottom: '1rem' }}>Company</div>
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map(link => (
                <a key={link} href="#" style={{ display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                >{link}</a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontWeight: 700, color: '#f0f0ff', fontSize: '0.875rem', marginBottom: '1rem' }}>Legal</div>
              {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'].map(link => (
                <a key={link} href="#" style={{ display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                >{link}</a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
            <span>© 2025 Quaxix Technologies Ltd. All rights reserved.</span>
            <span style={{ color: '#64748b' }}>Trading involves risk. Past performance is not indicative of future results.</span>
          </div>
        </div>
      </footer>

      {/* ── INLINE STYLES ───────────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #16a34a; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #16a34a; }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
          .landing-nav-right { display: none !important; }
          .landing-hamburger { display: flex !important; margin-left: auto; }
          .features-sidebar { display: none !important; }
          .features-grid-mobile { display: grid !important; }
          .step-connector { display: none !important; }
          .pricing-cards-row { flex-wrap: wrap !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
