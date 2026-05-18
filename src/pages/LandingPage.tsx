import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Clock, Lock, Activity, Zap, Shield,
  BarChart3, Bot, TrendingUp, Bell, LineChart, Wallet,
  ChevronDown, Check, Diamond, Sun, Moon, Menu, X,
  Globe, Users, Target, Cpu, RefreshCw, Eye,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import LogoIcon from '../components/LogoIcon';
import ParticleBackground from '../components/ParticleBackground';

// Lazy-load 3D hero (heavy Three.js bundle) — only on desktop
const HolographicHero = lazy(() => import('../components/HolographicHero'));

// Detect mobile once at module level
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

// ─── Typewriter Hook ───────────────────────────────────────────────────────────
const PHRASES = [
  'The AI Terminal That Executes While You Sleep.',
  'Institutional Tools. Retail Access.',
  'Markets Move. We Predict.',
  'Quantum Speed. Human Edge.',
  'Where Wall Street Meets Web3.',
  "Engineered for Traders Who Don't Miss.",
];

function useTypewriter(phrases: string[], typingSpeed = 45, deletingSpeed = 25, pauseMs = 2500, pauseBeforeMs = 400) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(prev => !prev);
      }, isDeleting ? pauseBeforeMs : pauseMs);
      return () => clearTimeout(t);
    }
    if (!isDeleting) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), deletingSpeed);
        return () => clearTimeout(t);
      } else {
        setIsDeleting(false);
        setPhraseIdx(i => (i + 1) % phrases.length);
      }
    }
  }, [displayed, phraseIdx, isDeleting, isPaused, phrases, typingSpeed, deletingSpeed, pauseMs, pauseBeforeMs]);

  return displayed;
}

// ─── Features Data ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Cpu, title: 'Quantum AI Engine', desc: 'Multi-layer ML models trained on 10+ years of tick data. Pattern recognition that no human analyst can replicate at scale.', tag: 'CORE' },
  { icon: Activity, title: 'Real-Time Sentiment', desc: 'Live feed of market sentiment from order flow, news, and on-chain data — synthesized into a single actionable signal.', tag: 'SIGNALS' },
  { icon: Bot, title: 'Autonomous Execution', desc: '24/7 bot execution with sub-second latency. Set your parameters, walk away. The terminal never sleeps.', tag: 'AUTOMATION' },
  { icon: BarChart3, title: 'Multi-Asset Coverage', desc: 'Forex, crypto, indices, and commodities — all in one terminal. 50+ instruments with unified risk management.', tag: 'COVERAGE' },
  { icon: Shield, title: 'Institutional Risk Controls', desc: 'Dynamic position sizing, drawdown limits, correlation filters, and circuit breakers — the same controls hedge funds use.', tag: 'RISK' },
  { icon: Bell, title: 'Precision Alerts', desc: 'Multi-channel alerts via Telegram, email, and in-app. Triggered by price action, pattern completion, or bot events.', tag: 'ALERTS' },
  { icon: LineChart, title: 'Deep Analytics', desc: 'Full trade journal with performance attribution, win/loss analysis, and equity curve modeling across all strategies.', tag: 'ANALYTICS' },
  { icon: TrendingUp, title: 'Signal Intelligence', desc: 'ML-scored signals with confidence ratings, backtested edge, and real-time performance tracking.', tag: 'SIGNALS' },
  { icon: Globe, title: 'Telegram Integration', desc: 'Full two-way Telegram bot. Receive signals, approve trades, check positions, and control the bot — all from your phone.', tag: 'INTEGRATION' },
];

// ─── Pricing Data ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', price: 49, annualPrice: 39,
    desc: 'For traders getting started with algorithmic execution.',
    features: ['5 Active Positions', 'Basic AI Signals', 'Telegram Alerts', 'Trade Journal', 'Email Support'],
    cta: 'Start Free Trial', popular: false, color: '#00d4ff',
  },
  {
    name: 'Pro', price: 99, annualPrice: 79,
    desc: 'For serious traders who want institutional-grade tools.',
    features: ['Unlimited Positions', 'Full AI Engine', 'Autonomous Bot', 'Advanced Analytics', 'Multi-Asset Coverage', 'Priority Support', 'Telegram Bot Control'],
    cta: 'Start Free Trial', popular: true, color: '#a855f7',
  },
  {
    name: 'Elite', price: 199, annualPrice: 159,
    desc: 'For professional traders and small funds.',
    features: ['Everything in Pro', 'Custom Strategies', 'API Access', 'White-Label Option', 'Dedicated Manager', 'SLA Guarantee', 'Early Feature Access'],
    cta: 'Contact Sales', popular: false, color: '#f59e0b',
  },
];

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is XMX-QUANTUM connected to my broker?', a: 'XMX-QUANTUM is non-custodial — we never hold your funds. You connect your broker API (MT4/MT5, cTrader, or supported crypto exchanges) and we execute on your behalf.' },
  { q: 'What is the BETA — Early Access status?', a: 'XMX-QUANTUM is currently in active beta. Core features are live and stable. Some advanced features are in development. Early access members get lifetime pricing locked in.' },
  { q: 'How does the AI engine generate signals?', a: 'Our ML models analyze price action, volume, order flow, and market microstructure across multiple timeframes simultaneously. Signals are scored by confidence and filtered for quality before delivery.' },
  { q: 'Can I use XMX-QUANTUM on mobile?', a: 'Yes. The web terminal is fully responsive. For on-the-go control, the Telegram bot integration lets you monitor positions, approve trades, and control the bot from any device.' },
  { q: 'What instruments are supported?', a: 'Forex (major and minor pairs), crypto (BTC, ETH, and top altcoins), indices (S&P 500, NASDAQ, DAX), and commodities (Gold, Silver, Oil). More instruments added regularly.' },
  { q: 'Is there a free trial?', a: 'Yes — 14 days free, no credit card required. Full access to all Pro features during the trial period.' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  // Only run typewriter on mobile (desktop uses 3D hero)
  const typewriterText = useTypewriter(IS_MOBILE ? PHRASES : []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, []);

  // Animated gradient hue shift for mobile typewriter text
  const [hue, setHue] = useState(0);
  useEffect(() => {
    if (!IS_MOBILE) return;
    const interval = setInterval(() => setHue(h => (h + 0.5) % 360), 100);
    return () => clearInterval(interval);
  }, []);

  const bgStyle = darkMode ? {
    background: 'linear-gradient(135deg, #0a1628 0%, #1e1b4b 50%, #0a0a0f 100%)',
  } : {
    background: 'linear-gradient(135deg, #fce7f3 0%, #fed7aa 35%, #ddd6fe 70%, #ffffff 100%)',
  };

  const gridOverlay = darkMode ? {
    backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  } : {};

  return (
    <div style={{ ...bgStyle, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      {/* Particle Background */}
      <ParticleBackground darkMode={darkMode} />

      {/* Radial Glow Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '15%', width: 600, height: 600,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)',
          animation: 'glow-pulse 4s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%', width: 500, height: 500,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
          animation: 'glow-pulse 4s ease-in-out infinite 2s',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Grid Overlay (dark mode only) */}
      {darkMode && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, ...gridOverlay }} />
      )}

      {/* ── NAVBAR ───────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: darkMode ? 'rgba(10,22,40,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: `1px solid ${darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.15)'}`,
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoIcon size={32} showWordmark showSubtitle wordmarkColor={darkMode ? '#e8f4fd' : '#0f1f2e'} subtitleColor={darkMode ? '#7a9ab5' : '#6b8ba4'} />
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['features', 'pricing', 'about', 'faq'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: darkMode ? '#7a9ab5' : '#3a5a78',
              fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize',
              transition: 'color 200ms',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = darkMode ? '#7a9ab5' : '#3a5a78')}
            >{id}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} style={{
            background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 9999, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: darkMode ? '#e8f4fd' : '#0f1f2e',
            transition: 'all 200ms',
          }}>
            <motion.div animate={{ rotate: darkMode ? 0 : 180 }} transition={{ duration: 0.3 }}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </button>

          <Link to="/login" style={{
            padding: '8px 16px', borderRadius: 9999,
            border: `1px solid ${darkMode ? 'rgba(0,212,255,0.3)' : 'rgba(168,85,247,0.3)'}`,
            color: darkMode ? '#00d4ff' : '#7c3aed',
            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
            transition: 'all 200ms',
          }}>Sign In</Link>

          <Link to="/signup" className="nav-cta-btn" style={{
            padding: '8px 18px', borderRadius: 9999,
            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
            color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700,
            boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            transition: 'all 200ms',
            whiteSpace: 'nowrap',
          }}>Get Started Free</Link>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            color: darkMode ? '#e8f4fd' : '#0f1f2e',
          }}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: darkMode ? 'rgba(10,22,40,0.98)' : 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.15)'}`,
              padding: '1.5rem 24px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
            {['features', 'pricing', 'about', 'faq'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                color: darkMode ? '#e8f4fd' : '#0f1f2e',
                fontSize: '1rem', fontWeight: 500, textTransform: 'capitalize',
                padding: '8px 0',
              }}>{id}</button>
            ))}
            <Link to="/login" style={{ color: darkMode ? '#00d4ff' : '#7c3aed', textDecoration: 'none', fontWeight: 600, padding: '8px 0' }}>Sign In</Link>
            <Link to="/signup" style={{
              padding: '12px 24px', borderRadius: 9999, textAlign: 'center',
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
            }}>Get Started Free</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '120px 24px 80px',
          textAlign: 'center',
        }}>
          {/* Beta Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 9999, marginBottom: '2rem',
              background: darkMode ? 'rgba(0,212,255,0.08)' : 'rgba(168,85,247,0.08)',
              border: `1px solid ${darkMode ? 'rgba(0,212,255,0.25)' : 'rgba(168,85,247,0.25)'}`,
              color: darkMode ? '#00d4ff' : '#7c3aed',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
            }}>
            <Diamond size={12} />
            BETA — QUANTUM AI V3.0 — EARLY ACCESS
            <Diamond size={12} />
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ maxWidth: 'min(900px, 95vw)', wordWrap: 'break-word', hyphens: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              marginBottom: '0.5rem',
              color: darkMode ? '#e8f4fd' : '#0f1f2e',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            }}>
              XMX-QUANTUM —
            </h1>

            {/* Desktop: 3D holographic text | Mobile: typewriter fallback */}
            {IS_MOBILE ? (
              <h1 style={{
                fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                minHeight: '1.2em',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                background: `linear-gradient(${90 + hue * 0.1}deg, #00d4ff, #a855f7)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {typewriterText}
                <span style={{
                  display: 'inline-block', width: 3, height: '0.85em',
                  background: '#00d4ff', marginLeft: 2, verticalAlign: 'middle',
                  animation: 'cursor-blink 500ms step-end infinite',
                }} />
              </h1>
            ) : (
              <Suspense fallback={
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                      animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              }>
                <HolographicHero darkMode={darkMode} height={220} />
              </Suspense>
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: darkMode ? 'rgba(232,244,253,0.6)' : 'rgba(15,31,46,0.65)',
              maxWidth: 620, lineHeight: 1.7, marginTop: '1.5rem', marginBottom: '2.5rem',
            }}>
            Built for traders who refuse to miss a move. XMX-QUANTUM runs ML-powered analysis 24/7, executes with surgical precision, and delivers institutional-grade signals — without the institutional gatekeeping.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="hero-cta-row"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 9999,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
              fontSize: '1rem', boxShadow: '0 0 30px rgba(0,212,255,0.4)',
              animation: 'cta-pulse 3s ease-in-out infinite',
              transition: 'transform 200ms, box-shadow 200ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)'; }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 9999,
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              color: darkMode ? '#e8f4fd' : '#0f1f2e',
              fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 200ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'; }}
            >
              Watch It Trade <Play size={18} />
            </button>
          </motion.div>

          {/* Trust Strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="hero-trust-row"
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { icon: Clock, text: '14-Day Money Back' },
              { icon: Lock, text: 'Non-Custodial' },
              { icon: Activity, text: '24/7 Bot Uptime' },
              { icon: Zap, text: 'Sub-Second Execution' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: darkMode ? 'rgba(232,244,253,0.45)' : 'rgba(15,31,46,0.5)', fontSize: '0.8rem' }}>
                <Icon size={14} />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '6rem 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label"><Target size={12} /> CAPABILITIES</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Everything a Serious Trader Needs
            </h2>
            <p className="section-subheading">
              Nine institutional-grade modules. One unified terminal.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Feature List */}
            <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {FEATURES.map((f, i) => (
                <button key={i} onClick={() => setActiveFeature(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: activeFeature === i
                    ? (darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.08)')
                    : 'transparent',
                  borderLeft: activeFeature === i ? '3px solid #00d4ff' : '3px solid transparent',
                  textAlign: 'left', transition: 'all 200ms',
                }}>
                  <f.icon size={18} color={activeFeature === i ? '#00d4ff' : (darkMode ? '#7a9ab5' : '#6b8ba4')} />
                  <span style={{
                    fontSize: '0.875rem', fontWeight: activeFeature === i ? 700 : 500,
                    color: activeFeature === i ? (darkMode ? '#e8f4fd' : '#0f1f2e') : (darkMode ? '#7a9ab5' : '#6b8ba4'),
                  }}>{f.title}</span>
                </button>
              ))}
            </div>

            {/* Feature Detail */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="card electric-card"
                  style={{
                    padding: '2.5rem',
                    background: darkMode ? 'rgba(17,32,58,0.8)' : 'rgba(255,255,255,0.9)',
                    border: `1px solid ${darkMode ? 'rgba(0,212,255,0.15)' : 'rgba(168,85,247,0.15)'}`,
                    borderRadius: 20, backdropFilter: 'blur(20px)',
                  }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}>
                    {(() => { const Icon = FEATURES[activeFeature].icon; return <Icon size={26} color="#00d4ff" />; })()}
                  </div>
                  <div style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 6,
                    background: darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.08)',
                    color: '#00d4ff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                    marginBottom: '1rem',
                  }}>{FEATURES[activeFeature].tag}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
                    {FEATURES[activeFeature].title}
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: darkMode ? 'rgba(232,244,253,0.65)' : 'rgba(15,31,46,0.65)' }}>
                    {FEATURES[activeFeature].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section style={{ padding: '6rem 24px', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label"><RefreshCw size={12} /> PROCESS</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Live in 3 Steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { n: '01', title: 'Connect Your Broker', desc: 'Link your MT4/MT5 or exchange API. Non-custodial — we never touch your funds. Setup takes under 2 minutes.' },
              { n: '02', title: 'Configure Your Strategy', desc: 'Choose from pre-built strategies or customize your own. Set risk parameters, position sizing, and target instruments.' },
              { n: '03', title: 'Let the AI Execute', desc: 'The terminal runs 24/7. Monitor from anywhere via the dashboard or Telegram bot. Intervene anytime.' },
            ].map(step => (
              <div key={step.n} className="card" style={{
                padding: '2rem', borderRadius: 16,
                background: darkMode ? 'rgba(17,32,58,0.7)' : 'rgba(255,255,255,0.8)',
                border: `1px solid ${darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.12)'}`,
                backdropFilter: 'blur(16px)', textAlign: 'center',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 1.5rem',
                  background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                }}>{step.n}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: darkMode ? 'rgba(232,244,253,0.55)' : 'rgba(15,31,46,0.6)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────── */}
        <section id="pricing" style={{ padding: '6rem 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label"><Wallet size={12} /> PRICING</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Transparent, No-Surprise Pricing
            </h2>
            <p className="section-subheading">14-day free trial. No credit card required.</p>

            {/* Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: '1.5rem', padding: '4px', borderRadius: 9999, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              <button onClick={() => setAnnual(false)} style={{
                padding: '8px 20px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                background: !annual ? 'linear-gradient(135deg, #00d4ff, #a855f7)' : 'transparent',
                color: !annual ? '#fff' : (darkMode ? '#7a9ab5' : '#6b8ba4'),
                transition: 'all 200ms',
              }}>Monthly</button>
              <button onClick={() => setAnnual(true)} style={{
                padding: '8px 20px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                background: annual ? 'linear-gradient(135deg, #00d4ff, #a855f7)' : 'transparent',
                color: annual ? '#fff' : (darkMode ? '#7a9ab5' : '#6b8ba4'),
                transition: 'all 200ms',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Annual
                <span style={{ padding: '2px 8px', borderRadius: 9999, background: 'rgba(0,255,136,0.15)', color: '#00ff88', fontSize: '0.7rem', fontWeight: 700 }}>SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="pricing-cards-row" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '2.5rem' }}>
            {PLANS.map((plan, i) => (
              <div key={plan.name} className="pricing-card" style={{
                flex: '1 1 0', minWidth: 260, maxWidth: 360,
                padding: '2rem', borderRadius: 20, position: 'relative',
                background: plan.popular
                  ? (darkMode ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.06)')
                  : (darkMode ? 'rgba(17,32,58,0.8)' : 'rgba(255,255,255,0.9)'),
                border: plan.popular
                  ? '1px solid rgba(168,85,247,0.4)'
                  : `1px solid ${darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.12)'}`,
                backdropFilter: 'blur(20px)',
                marginTop: plan.popular ? 0 : 0,
                overflow: 'visible',
              }}>
                {/* Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 9999,
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    color: '#fff', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em',
                    whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
                    zIndex: 2,
                  }}>MOST POPULAR</div>
                )}
                {i === 2 && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 9999,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em',
                    whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
                    zIndex: 2,
                  }}>ELITE</div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)', lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: plan.color }}>
                    ${annual ? plan.annualPrice : plan.price}
                  </span>
                  <span style={{ color: darkMode ? 'rgba(232,244,253,0.4)' : 'rgba(15,31,46,0.45)', fontSize: '0.85rem' }}>/month</span>
                  {annual && <div style={{ fontSize: '0.75rem', color: '#00ff88', marginTop: 4 }}>Billed annually</div>}
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: darkMode ? 'rgba(232,244,253,0.75)' : 'rgba(15,31,46,0.75)' }}>
                      <Check size={15} color="#00d4ff" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/signup" style={{
                  display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 9999,
                  background: plan.popular ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : (darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.08)'),
                  border: plan.popular ? 'none' : `1px solid rgba(0,212,255,0.3)`,
                  color: plan.popular ? '#fff' : '#00d4ff',
                  textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                  boxShadow: plan.popular ? '0 4px 20px rgba(168,85,247,0.4)' : 'none',
                  transition: 'all 200ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >{plan.cta}</Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────────────── */}
        <section id="about" style={{ padding: '6rem 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label"><Eye size={12} /> ABOUT</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Built By Traders, For Traders
            </h2>
            <p className="section-subheading">
              XMX-QUANTUM was built because the tools serious traders need were locked behind institutional walls. We're changing that.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: Target, title: 'Our Vision', desc: 'Democratize institutional-grade trading tools. Every serious retail trader deserves the same edge as a hedge fund.' },
              { icon: Cpu, title: 'The Technology', desc: 'Multi-layer ML models, real-time order flow analysis, and sub-second execution infrastructure built from the ground up.' },
              { icon: Users, title: 'Who We Serve', desc: 'Independent traders, prop firm traders, and small funds who demand professional tools without the enterprise price tag.' },
              { icon: Shield, title: 'Our Commitment', desc: 'Non-custodial. Transparent. No fake metrics. We show you real performance data and let the product speak for itself.' },
            ].map(item => (
              <div key={item.title} className="card" style={{
                padding: '1.75rem', borderRadius: 16,
                background: darkMode ? 'rgba(17,32,58,0.7)' : 'rgba(255,255,255,0.8)',
                border: `1px solid ${darkMode ? 'rgba(0,212,255,0.1)' : 'rgba(168,85,247,0.12)'}`,
                backdropFilter: 'blur(16px)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon size={22} color="#00d4ff" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: darkMode ? 'rgba(232,244,253,0.55)' : 'rgba(15,31,46,0.6)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCT SHOWCASE (replaces fake testimonials) ────────── */}
        <section style={{ padding: '6rem 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label"><BarChart3 size={12} /> PLATFORM</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              What You Get on Day One
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: Bot, title: 'Autonomous Bot Engine', desc: 'Set your strategy, risk parameters, and instruments. The bot executes 24/7 — opening, managing, and closing positions with no manual intervention required.', color: '#00d4ff' },
              { icon: LineChart, title: 'Live Equity Dashboard', desc: 'Real-time P&L tracking, equity curve visualization, drawdown monitoring, and position management — all in a single Bloomberg-style terminal view.', color: '#a855f7' },
              { icon: Bell, title: 'Intelligent Alert System', desc: 'Multi-channel alerts via Telegram and in-app. Triggered by price action, pattern completion, bot events, or custom conditions you define.', color: '#f59e0b' },
            ].map(item => (
              <div key={item.title} className="card electric-card" style={{
                padding: '2rem', borderRadius: 20,
                background: darkMode ? 'rgba(17,32,58,0.8)' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${darkMode ? `rgba(${item.color === '#00d4ff' ? '0,212,255' : item.color === '#a855f7' ? '168,85,247' : '245,158,11'},0.2)` : 'rgba(168,85,247,0.12)'}`,
                backdropFilter: 'blur(20px)',
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <item.icon size={26} color={item.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: darkMode ? 'rgba(232,244,253,0.6)' : 'rgba(15,31,46,0.6)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section id="faq" style={{ padding: '6rem 24px', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label"><ChevronDown size={12} /> FAQ</div>
            <h2 className="section-heading" style={{ color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Common Questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                borderRadius: 14,
                background: darkMode ? 'rgba(17,32,58,0.7)' : 'rgba(255,255,255,0.85)',
                border: `1px solid ${openFaq === i ? 'rgba(0,212,255,0.3)' : (darkMode ? 'rgba(0,212,255,0.08)' : 'rgba(168,85,247,0.1)')}`,
                overflow: 'hidden', transition: 'border-color 200ms',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '1.25rem 1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: darkMode ? '#e8f4fd' : '#0f1f2e', fontWeight: 600, fontSize: '0.95rem',
                }}>
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} color={openFaq === i ? '#00d4ff' : (darkMode ? '#7a9ab5' : '#6b8ba4')} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <p style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.9rem', lineHeight: 1.7, color: darkMode ? 'rgba(232,244,253,0.6)' : 'rgba(15,31,46,0.65)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ──────────────────────────────────────────── */}
        <section style={{ padding: '6rem 24px', textAlign: 'center' }}>
          <div style={{
            maxWidth: 700, margin: '0 auto', padding: '4rem 2rem', borderRadius: 24,
            background: darkMode ? 'rgba(17,32,58,0.8)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${darkMode ? 'rgba(0,212,255,0.15)' : 'rgba(168,85,247,0.2)'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: darkMode ? '0 0 80px rgba(0,212,255,0.08)' : '0 20px 60px rgba(168,85,247,0.1)',
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', color: darkMode ? '#e8f4fd' : '#0f1f2e' }}>
              Ready to Trade Like an Institution?
            </h2>
            <p style={{ fontSize: '1rem', color: darkMode ? 'rgba(232,244,253,0.55)' : 'rgba(15,31,46,0.6)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Join the early access program. 14 days free. No credit card required.
            </p>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 9999,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 0 30px rgba(0,212,255,0.4)',
              transition: 'all 200ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)'; }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer style={{
          padding: '3rem 24px 2rem',
          borderTop: `1px solid ${darkMode ? 'rgba(0,212,255,0.08)' : 'rgba(168,85,247,0.1)'}`,
          background: darkMode ? 'rgba(10,22,40,0.9)' : 'rgba(255,255,255,0.9)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: '2rem' }}>
              <div>
                <LogoIcon size={28} showWordmark showSubtitle wordmarkColor={darkMode ? '#e8f4fd' : '#0f1f2e'} subtitleColor={darkMode ? '#7a9ab5' : '#6b8ba4'} wordmarkSize={13} />
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', lineHeight: 1.6, color: darkMode ? 'rgba(232,244,253,0.4)' : 'rgba(15,31,46,0.45)', maxWidth: 200 }}>
                  Institutional-grade AI trading terminal. BETA — Early Access.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: darkMode ? '#7a9ab5' : '#6b8ba4', marginBottom: '1rem' }}>Platform</div>
                {['Dashboard', 'Signals', 'Bot Control', 'Analytics', 'Leaderboard'].map(l => (
                  <Link key={l} to="/login" style={{ display: 'block', fontSize: '0.85rem', color: darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)', textDecoration: 'none', marginBottom: 8, transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)')}
                  >{l}</Link>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: darkMode ? '#7a9ab5' : '#6b8ba4', marginBottom: '1rem' }}>Company</div>
                {['About', 'Pricing', 'FAQ', 'Changelog'].map(l => (
                  <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ display: 'block', fontSize: '0.85rem', color: darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)')}
                  >{l}</button>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: darkMode ? '#7a9ab5' : '#6b8ba4', marginBottom: '1rem' }}>Legal</div>
                {['Privacy Policy', 'Terms of Service', 'Risk Disclosure', 'Cookie Policy'].map(l => (
                  <a key={l} href="#" style={{ display: 'block', fontSize: '0.85rem', color: darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)', textDecoration: 'none', marginBottom: 8, transition: 'color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = darkMode ? 'rgba(232,244,253,0.5)' : 'rgba(15,31,46,0.55)')}
                  >{l}</a>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: '0.78rem', color: darkMode ? 'rgba(232,244,253,0.3)' : 'rgba(15,31,46,0.4)' }}>
                © 2025 Quaxix Technologies. XMX-QUANTUM is in BETA. Trading involves risk.
              </p>
              <p style={{ fontSize: '0.78rem', color: darkMode ? 'rgba(232,244,253,0.3)' : 'rgba(15,31,46,0.4)' }}>
                256-bit SSL · Non-Custodial · BETA
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes cta-pulse { 0%, 100% { box-shadow: 0 0 30px rgba(0,212,255,0.4); } 50% { box-shadow: 0 0 50px rgba(0,212,255,0.65), 0 0 80px rgba(168,85,247,0.3); } }
        .nav-links-desktop { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .nav-cta-btn { display: none !important; }
          .hero-cta-row { flex-direction: column; align-items: center; }
          .hero-trust-row { gap: 12px !important; }
          .pricing-cards-row { flex-direction: column; align-items: center; }
          .pricing-cards-row > div { max-width: 100% !important; width: 100%; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
