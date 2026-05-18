import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Lock, Clock, Zap, BarChart2, Bot,
  TrendingUp, Brain, Target, ChevronDown, ChevronUp,
  Check, Gift, Menu, X, Sun, Moon, Sparkles,
  Activity, BookOpen, DollarSign,
} from 'lucide-react';
import LogoIcon from '../components/LogoIcon';

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';

// ─── Typewriter Hook ─────────────────────────────────────────────────────────
function useTypewriter(texts: string[], speed = 50, pause = 2000) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), speed / 2);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, textIndex, texts, speed, pause]);

  return displayed;
}

// ─── Pricing Data ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Basic',
    tagline: 'Perfect for getting started with AI trading.',
    monthly: 29,
    annual: 23,
    badge: null,
    accent: '#64748b',
    btnStyle: 'outline' as const,
    features: [
      '3 Instruments', '50 Trades/Month', 'Basic AI Signals',
      'Email Alerts', 'Community Access', 'Mobile App',
      'Basic Analytics', 'Trade Journal', 'Email Support', '14-Day Free Trial',
    ],
  },
  {
    name: 'Pro',
    tagline: 'The complete toolkit for serious traders.',
    monthly: 79,
    annual: 63,
    badge: 'Most Popular',
    accent: '#a855f7',
    btnStyle: 'solid' as const,
    features: [
      '6 Instruments', 'Unlimited Trades', 'Quantum AI Signals',
      'Telegram Alerts', 'Analytics Dashboard', 'Bot Control',
      'Trade Journal', 'Priority Support', 'ML Model Access',
      'Backtesting Studio', 'Market Heatmap', 'Position Calculator', 'API Access',
    ],
  },
  {
    name: 'Elite',
    tagline: 'Institutional-grade power for professionals.',
    monthly: 199,
    annual: 159,
    badge: 'Elite',
    accent: '#f59e0b',
    btnStyle: 'gold' as const,
    features: [
      'Everything in Pro', 'Custom Strategies', 'Dedicated Manager',
      'White-label Option', 'Custom Instruments', 'SLA Guarantee',
      'Direct AI Analysis', 'MT5 Cloud Bots', 'Free VPS Included',
      'Voice AI Interaction', 'Unlimited MT5 Accounts', '24/7 Bot Monitoring', 'White-glove Support',
    ],
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Does XMX-QUANTUM work with my broker?', a: 'Yes — XMX-QUANTUM integrates with any MT5-compatible broker. We support 200+ regulated brokers worldwide including IC Markets, Pepperstone, XM, and more. Setup takes under 2 minutes.' },
  { q: 'What instruments can I trade?', a: 'XAUUSDm (Gold), BTCUSDm (Bitcoin), EURUSD, GBPUSD, NASDAQm, and US30m. Elite plan includes custom instrument support for any MT5-listed asset.' },
  { q: 'Is my capital safe?', a: 'Absolutely. XMX-QUANTUM is 100% non-custodial — your funds never leave your broker account. We only send trade signals via the MT5 API. You retain full control at all times.' },
  { q: 'What kind of performance can I expect?', a: 'XMX-QUANTUM is in active Beta. Performance varies by market conditions, instrument, and risk settings. We do not publish guaranteed win rates — all trading involves risk and past signal performance is not indicative of future results.' },
  { q: 'Can I run the bot 24/7?', a: 'Yes — Pro and Elite plans include cloud-hosted bot execution. Your bot runs 24/7 on our infrastructure even when your PC is off. Zero downtime, zero maintenance.' },
  { q: 'What is the refund policy?', a: 'All plans include a 14-day money-back guarantee. If you are not satisfied for any reason within 14 days of purchase, contact support for a full refund — no questions asked.' },
  { q: 'How does the ML model work?', a: 'Our Quantum AI model is trained on millions of historical trades using a proprietary ensemble of LSTM, XGBoost, and transformer architectures. It continuously retrains on live market data every 24 hours.' },
];

// ─── Features Data ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Brain, title: 'Quantum AI Signals', desc: 'Proprietary ML models trained on extensive historical market data generate sub-second, high-probability signals with adaptive accuracy across multiple instruments.', tag: 'AI CORE' },
  { icon: Zap, title: 'Sub-Second Execution', desc: 'Direct MT5 integration with smart order routing ensures your trades execute at the best available price, every time, with zero slippage.', tag: 'EXECUTION' },
  { icon: Shield, title: 'Adaptive Risk Shield', desc: 'Automated stop-loss, take-profit, and drawdown protection dynamically adjusts to volatility to keep your capital safe 24/7.', tag: 'RISK' },
  { icon: BarChart2, title: 'Institutional Analytics', desc: 'Deep-dive metrics: Sharpe ratio, profit factor, win-rate heatmaps, benchmark comparison, and custom dashboards for professional analysis.', tag: 'ANALYTICS' },
  { icon: Bot, title: 'Autonomous Bot Engine', desc: 'Set it and forget it. Cloud-hosted bot runs 24/7, scanning 6 instruments and executing trades while you sleep.', tag: 'AUTOMATION' },
  { icon: Activity, title: 'ML Model Dashboard', desc: 'Monitor live model performance, feature importance, and retrain triggers. Full transparency into every AI decision made on your behalf.', tag: 'ML MODEL' },
  { icon: Lock, title: 'Non-Custodial Security', desc: 'Your capital never leaves your broker account. XMX-QUANTUM only sends signals via MT5 API — zero custody risk, zero counterparty exposure.', tag: 'SECURITY' },
  { icon: BookOpen, title: 'Trade Journal & Replay', desc: 'Automatically log every trade with entry/exit screenshots, P&L attribution, and strategy tagging for continuous improvement.', tag: 'JOURNAL' },
  { icon: Gift, title: 'Referral Rewards', desc: 'Earn real cash for every trader you refer. Instant payouts, no minimum threshold, and a dedicated referral dashboard to track your earnings.', tag: 'REWARDS' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const typewriterTexts = [
    'Thinks Faster Than Markets',
    'Executes While You Sleep',
    'Adapts to Every Market Condition',
    'Gives You the Institutional Edge',
  ];
  const typedText = useTypewriter(typewriterTexts, 50, 2200);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-landing-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  // ─── Design tokens ────────────────────────────────────────────────────────
  const isDark = theme === 'dark';
  const T = {
    bg:           isDark ? '#080b14' : '#ffffff',
    bgSoft:       isDark ? '#0d1117' : '#f8f9fc',
    bgCard:       isDark ? '#0f1623' : '#ffffff',
    bgCardHover:  isDark ? '#141d2e' : '#f8f9fc',
    text:         isDark ? '#f1f5f9' : '#0f172a',
    textMuted:    isDark ? '#64748b' : '#64748b',
    textSub:      isDark ? '#94a3b8' : '#475569',
    border:       isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    borderBright: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
    cyan:         '#00d4ff',
    purple:       '#a855f7',
    purpleDark:   '#7c3aed',
    gold:         '#f59e0b',
    navBg:        scrolled
      ? (isDark ? 'rgba(8,11,20,0.92)' : 'rgba(255,255,255,0.92)')
      : 'transparent',
    navBorder:    scrolled
      ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)')
      : 'transparent',
    // Gradient blobs for hero — our dark version of PipNex's light blobs
    blob1: isDark
      ? 'radial-gradient(ellipse 900px 700px at 15% 20%, rgba(168,85,247,0.18) 0%, transparent 70%)'
      : 'radial-gradient(ellipse 900px 700px at 15% 20%, rgba(168,85,247,0.12) 0%, transparent 70%)',
    blob2: isDark
      ? 'radial-gradient(ellipse 700px 600px at 85% 30%, rgba(0,212,255,0.14) 0%, transparent 70%)'
      : 'radial-gradient(ellipse 700px 600px at 85% 30%, rgba(0,212,255,0.08) 0%, transparent 70%)',
    blob3: isDark
      ? 'radial-gradient(ellipse 500px 400px at 50% 80%, rgba(124,58,237,0.1) 0%, transparent 70%)'
      : 'radial-gradient(ellipse 500px 400px at 50% 80%, rgba(124,58,237,0.06) 0%, transparent 70%)',
  };

  const sectionPad = '6rem 1.5rem';
  const maxW = { maxWidth: 1200, margin: '0 auto', width: '100%' };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: "'Inter', 'Space Grotesk', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: T.navBg,
        borderBottom: `1px solid ${T.navBorder}`,
        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        padding: '0 max(1.5rem, calc((100vw - 1200px) / 2))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 68, gap: '2rem' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <LogoIcon size={34} showWordmark wordmarkSize={14} wordmarkColor={T.text} showSubtitle subtitleColor={T.textMuted} />
          </Link>

          {/* Desktop nav links — centered */}
          <div className="landing-nav-links" style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
            {['Features', 'Pricing', 'About', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                textDecoration: 'none', color: T.textMuted, fontSize: '0.875rem', fontWeight: 500,
                padding: '0.45rem 0.85rem', borderRadius: 8, transition: 'all 0.2s',
                letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = 'transparent'; }}
              >{item}</a>
            ))}
          </div>

          {/* Right side */}
          <div className="landing-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <button onClick={toggleTheme} title="Toggle theme" style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${T.border}`, borderRadius: 8,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: T.textMuted, transition: 'all 0.2s',
            }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link to="/login" style={{
              textDecoration: 'none', color: T.text, fontSize: '0.875rem', fontWeight: 500,
              padding: '0.45rem 1rem', borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: 'transparent', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderBright; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
            >Sign In</Link>
            <Link to="/signup" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #00d4ff 100%)',
              color: '#fff', fontSize: '0.875rem', fontWeight: 600,
              padding: '0.5rem 1.25rem', borderRadius: 100,
              transition: 'all 0.2s',
              boxShadow: '0 2px 16px rgba(168,85,247,0.35)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(168,85,247,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(168,85,247,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >Get Started Free</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="landing-hamburger" onClick={() => setMobileMenuOpen(v => !v)} style={{
            display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
            color: T.text, padding: '0.25rem',
          }}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, bottom: 0, zIndex: 999,
              background: T.bg, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
              borderTop: `1px solid ${T.border}`,
            }}
          >
            {['Features', 'Pricing', 'About', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} style={{
                textDecoration: 'none', color: T.text, fontSize: '1rem', fontWeight: 600,
                padding: '0.85rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`,
              }}>{item}</a>
            ))}
            <div style={{ height: 1, background: T.border, margin: '0.25rem 0' }} />
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
              textDecoration: 'none', color: T.text, fontSize: '1rem', fontWeight: 600,
              padding: '0.85rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`, textAlign: 'center',
            }}>Sign In</Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff', fontSize: '1rem', fontWeight: 700,
              padding: '0.9rem 1rem', borderRadius: 100, textAlign: 'center',
            }}>Get Started Free</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — PipNex pattern: large centered headline, gradient blobs, 3-stat bar below
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '7rem 1.5rem 5rem', overflow: 'hidden',
      }}>
        {/* Gradient blobs — our dark version of PipNex's light blobs */}
        <div style={{ position: 'absolute', inset: 0, background: T.blob1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: T.blob2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: T.blob3, pointerEvents: 'none' }} />

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: isDark ? 0.03 : 0.02,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* BETA badge — PipNex pattern: small pill badge above headline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: isDark ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.3)', borderRadius: 100,
            padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 700,
            color: T.purple, marginBottom: '1.75rem', position: 'relative', zIndex: 1,
            letterSpacing: '0.06em',
          }}
        >
          <Sparkles size={12} />
          BETA — QUANTUM AI V3.0 — EARLY ACCESS
        </motion.div>

        {/* Headline — PipNex pattern: brand name on line 1 in accent, tagline on line 2 in dark */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)', fontWeight: 900, lineHeight: 1.1,
            maxWidth: 860, margin: '0 auto 1.5rem', position: 'relative', zIndex: 1,
            letterSpacing: '-0.03em', color: T.text,
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>XMX-QUANTUM</span>
          {' — '}
          <span style={{ color: T.text }}>The AI Terminal That{' '}</span>
          <span style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{typedText}</span>
          <span style={{ borderRight: `3px solid ${T.purple}`, marginLeft: 2, opacity: 0.8 }}>|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: T.textSub,
            maxWidth: 580, margin: '0 auto 2.75rem', lineHeight: 1.75,
            position: 'relative', zIndex: 1,
          }}
        >
          Institutional-grade Quantum AI meets autonomous bot execution. Professional-grade trading tools, built for serious retail traders — without the institutional price tag.
        </motion.p>

        {/* CTA Buttons — PipNex pattern: primary pill + ghost pill side by side */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="hero-cta-row"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
        >
          <Link to="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.9rem 2.25rem', borderRadius: 100, fontSize: '1rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #00d4ff 100%)',
            color: '#fff', textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(168,85,247,0.4)', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,85,247,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(168,85,247,0.4)'; e.currentTarget.style.transform = 'none'; }}
          >
            Start Free Trial <ArrowRight size={17} />
          </Link>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.9rem 2.25rem', borderRadius: 100, fontSize: '1rem', fontWeight: 600,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: T.text, textDecoration: 'none',
            border: `1.5px solid ${T.borderBright}`, transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.purple; e.currentTarget.style.color = T.purple; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderBright; e.currentTarget.style.color = T.text; }}
          >
            View Dashboard →
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1, marginBottom: '4rem' }}
        >
          {[
            { icon: Clock, text: '14-Day Money Back' },
            { icon: Lock, text: 'Non-Custodial' },
            { icon: Activity, text: '24/7 Bot Uptime' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: T.textMuted }}>
              <Icon size={13} color={T.purple} /> {text}
            </div>
          ))}
        </motion.div>

        {/* ── HERO STAT CARDS — PipNex pattern: 3 cards below hero with large bold numbers ── */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="hero-stat-cards"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem',
            maxWidth: 820, width: '100%', position: 'relative', zIndex: 1,
          }}
        >
          {[
            { icon: Brain, value: 'Quantum AI', label: 'Institutional-Grade Engine', color: T.purple },
            { icon: Activity, value: 'Real-Time', label: 'Market Sentiment Analysis', color: T.cyan },
            { icon: Bot, value: '24 / 7', label: 'Autonomous Bot Execution', color: '#10b981' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="stat-card" style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 20, padding: '1.75rem 1.5rem', textAlign: 'center',
              boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: '0 auto 1rem',
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: T.text, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: T.textMuted, lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES — PipNex pattern: section label + h2 + 3-column card grid
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: sectionPad, background: T.bgSoft }}>
        <div style={maxW}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100,
              padding: '0.3rem 1rem', fontSize: '0.72rem', fontWeight: 700,
              color: T.purple, letterSpacing: '0.1em', marginBottom: '1.1rem',
            }}>PLATFORM FEATURES</div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800,
              margin: '0 0 1rem', color: T.text, letterSpacing: '-0.025em', lineHeight: 1.2,
            }}>
              Why Traders Choose{' '}
              <span style={{
                background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>XMX-QUANTUM</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Built for serious traders who demand professional-grade tools without institutional fees.
            </p>
          </div>

          {/* 3-column feature card grid — PipNex pattern */}
          <div className="features-grid-3col" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
          }}>
            {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
              <div key={title} className="card" style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 20, padding: '1.75rem',
                transition: 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
                cursor: 'default', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.35)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = isDark ? '0 16px 40px rgba(168,85,247,0.12)' : '0 16px 40px rgba(168,85,247,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = T.border;
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Icon with tinted bg — PipNex pattern */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: '1.1rem',
                  background: isDark ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={T.purple} />
                </div>
                {/* Tag */}
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: T.purple, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{tag}</div>
                {/* Title */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.text, margin: '0 0 0.6rem', letterSpacing: '-0.01em' }}>{title}</h3>
                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: T.textMuted, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA below features — PipNex pattern */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem', borderRadius: 100, fontSize: '0.95rem', fontWeight: 600,
              border: `1.5px solid rgba(168,85,247,0.4)`, color: T.purple,
              background: isDark ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.05)',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.15)'; e.currentTarget.style.borderColor = T.purple; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.05)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; }}
            >
              Explore All Features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: sectionPad, background: T.bg }}>
        <div style={maxW}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.2)', borderRadius: 100,
              padding: '0.3rem 1rem', fontSize: '0.72rem', fontWeight: 700,
              color: T.cyan, letterSpacing: '0.1em', marginBottom: '1.1rem',
            }}>HOW IT WORKS</div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800,
              margin: '0 0 1rem', color: T.text, letterSpacing: '-0.025em',
            }}>
              Up and Running in{' '}
              <span style={{ color: T.cyan }}>3 Simple Steps</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              From signup to live trading in under 5 minutes.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', position: 'relative' }}>
            {/* Connector line */}
            <div className="steps-connector" style={{
              position: 'absolute', top: '2.5rem', left: '20%', right: '20%', height: 1,
              background: `linear-gradient(90deg, transparent, ${T.purple}, ${T.cyan}, transparent)`,
              opacity: 0.3, pointerEvents: 'none',
            }} />

            {[
              { step: '01', title: 'Connect Your Broker', desc: 'Link your MT5 account in under 2 minutes. We support 200+ regulated brokers worldwide.', icon: Lock, color: T.purple },
              { step: '02', title: 'Configure Your Strategy', desc: 'Choose your instruments, risk level, and trading hours. The AI handles the rest automatically.', icon: Brain, color: T.cyan },
              { step: '03', title: 'Start Earning', desc: 'Watch the Quantum AI execute trades 24/7. Monitor performance in real-time on your dashboard.', icon: TrendingUp, color: '#10b981' },
            ].map(({ step, title, desc, icon: Icon, color }) => (
              <div key={step} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1.5rem',
                  background: `${color}18`, border: `2px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon size={26} color={color} />
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 24, height: 24, borderRadius: '50%',
                    background: color, color: '#fff',
                    fontSize: '0.65rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{step}</div>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: T.text, margin: '0 0 0.6rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: T.textMuted, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING — PipNex pattern: toggle + 3 cards + floating badges
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: sectionPad, background: T.bgSoft, overflow: 'visible' }}>
        <div style={{ ...maxW, overflow: 'visible' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100,
              padding: '0.3rem 1rem', fontSize: '0.72rem', fontWeight: 700,
              color: T.purple, letterSpacing: '0.1em', marginBottom: '1.1rem',
            }}>PRICING</div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800,
              margin: '0 0 1rem', color: T.text, letterSpacing: '-0.025em',
            }}>
              Simple, Transparent{' '}
              <span style={{ color: T.purple }}>Pricing</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Choose the plan that fits your trading goals. No hidden fees, no lock-in contracts.
            </p>

            {/* Monthly/Annual toggle — PipNex pattern */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 100, padding: '0.35rem', border: `1px solid ${T.border}` }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{
                  padding: '0.45rem 1.25rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: billing === b ? (isDark ? '#1e1b4b' : '#fff') : 'transparent',
                  color: billing === b ? T.purple : T.textMuted,
                  boxShadow: billing === b ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}>
                  {b === 'monthly' ? 'Monthly' : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Annual
                      <span style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 100 }}>Save 20%</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing cards — PipNex pattern with floating badge */}
          <div className="pricing-cards-row" style={{
            display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
            paddingTop: '2.5rem', overflow: 'visible',
          }}>
            {PLANS.map((plan) => {
              const isPopular = plan.name === 'Pro';
              const isElite = plan.name === 'Elite';
              return (
                <div key={plan.name} className="pricing-card" style={{
                  flex: '1 1 0', minWidth: 0,
                  background: T.bgCard,
                  border: `1.5px solid ${isPopular ? plan.accent : isElite ? plan.accent : T.border}`,
                  borderRadius: 24, padding: '2rem 1.75rem',
                  position: 'relative', overflow: 'visible',
                  boxShadow: isPopular
                    ? `0 0 0 1px ${plan.accent}30, 0 24px 60px ${plan.accent}20`
                    : isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
                  transform: isPopular ? 'scale(1.03)' : 'none',
                  marginTop: isPopular ? 0 : '0.5rem',
                }}>
                  {/* Floating badge — PipNex pattern: absolute, centered, above card */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                      background: `linear-gradient(135deg, ${plan.accent}, ${isElite ? '#ef4444' : '#7c3aed'})`,
                      color: '#fff', fontSize: '0.72rem', fontWeight: 800,
                      padding: '0.3rem 1rem', borderRadius: 100,
                      whiteSpace: 'nowrap', zIndex: 10,
                      boxShadow: `0 4px 16px ${plan.accent}50`,
                      letterSpacing: '0.04em',
                    }}>
                      {isPopular ? '★ Most Popular' : '⬡ Elite'}
                    </div>
                  )}

                  {/* Plan name */}
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: plan.accent, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{plan.name.toUpperCase()}</div>
                  <p style={{ fontSize: '0.85rem', color: T.textMuted, margin: '0 0 1.5rem', lineHeight: 1.5 }}>{plan.tagline}</p>

                  {/* Price */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '2.75rem', fontWeight: 900, color: T.text, letterSpacing: '-0.04em' }}>
                      ${billing === 'monthly' ? plan.monthly : plan.annual}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: T.textMuted, marginLeft: '0.25rem' }}>/month</span>
                    {billing === 'annual' && (
                      <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.25rem', fontWeight: 600 }}>
                        Save ${(plan.monthly - plan.annual) * 12}/year
                      </div>
                    )}
                  </div>

                  {/* CTA button */}
                  <Link to="/signup" style={{
                    display: 'block', textAlign: 'center', textDecoration: 'none',
                    padding: '0.85rem 1.5rem', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700,
                    marginBottom: '1.75rem', transition: 'all 0.2s',
                    ...(plan.btnStyle === 'solid'
                      ? { background: `linear-gradient(135deg, #7c3aed, ${plan.accent})`, color: '#fff', boxShadow: `0 4px 20px ${plan.accent}40` }
                      : plan.btnStyle === 'gold'
                        ? { background: `linear-gradient(135deg, ${plan.accent}, #ef4444)`, color: '#fff', boxShadow: `0 4px 20px ${plan.accent}40` }
                        : { background: 'transparent', color: T.text, border: `1.5px solid ${T.borderBright}` }),
                  }}>
                    {plan.name === 'Elite' ? 'Go Elite' : 'Get Started'}
                  </Link>

                  {/* Feature list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: T.textSub }}>
                        <Check size={14} color={plan.accent} style={{ flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          REFERRAL — PipNex pattern: full-width gradient CTA section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="referral" style={{ padding: sectionPad, background: T.bg }}>
        <div style={maxW}>
          <div style={{
            borderRadius: 28,
            background: isDark
              ? 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,212,255,0.1) 100%)'
              : 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(0,212,255,0.05) 100%)',
            border: `1px solid rgba(168,85,247,0.2)`,
            padding: '3.5rem 3rem', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '200%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                background: isDark ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.25)', borderRadius: 100,
                padding: '0.3rem 0.9rem', fontSize: '0.72rem', fontWeight: 700,
                color: T.purple, letterSpacing: '0.08em', marginBottom: '1.25rem',
              }}>
                <Gift size={12} /> REFERRAL PROGRAM
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: T.text, margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                Refer Friends, Earn{' '}
                <span style={{ color: T.purple }}>Real Money</span>
              </h2>
              <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Earn 30% recurring commission on every trader you refer. No cap, no expiry — your earnings grow as your network grows.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {[
                  { icon: DollarSign, label: '30% Recurring Commission' },
                  { icon: Activity, label: 'Instant Payouts' },
                  { icon: TrendingUp, label: 'No Earning Cap' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${T.border}`, borderRadius: 100,
                    padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: T.text,
                  }}>
                    <Icon size={14} color={T.purple} /> {label}
                  </div>
                ))}
              </div>
              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2.25rem', borderRadius: 100, fontSize: '0.95rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(168,85,247,0.4)', transition: 'all 0.2s',
              }}>
                Join Referral Program <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ABOUT — PipNex pattern: 4-column grid with AI engine panel
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: sectionPad, background: T.bgSoft }}>
        <div style={maxW}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.2)', borderRadius: 100,
              padding: '0.3rem 1rem', fontSize: '0.72rem', fontWeight: 700,
              color: T.cyan, letterSpacing: '0.1em', marginBottom: '1.1rem',
            }}>ABOUT XMX-QUANTUM</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', color: T.text, letterSpacing: '-0.025em' }}>
              Built By Traders,{' '}
              <span style={{ color: T.cyan }}>For Traders</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              XMX-QUANTUM is developed by Quaxix Technologies — a team of professional traders and ML engineers who got tired of institutional tools being out of reach for retail traders.
            </p>
          </div>

          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[
              { icon: Target, title: 'Our Vision', desc: 'Democratize access to institutional-grade AI trading tools. Every retail trader deserves the same technology used by hedge funds and prop desks.', color: T.purple },
              { icon: Brain, title: 'Our Technology', desc: 'Advanced quantum-inspired ML models analyze 6 instruments across 12 timeframes simultaneously, providing multi-dimensional market insights in real time.', color: T.cyan },
              { icon: TrendingUp, title: 'User Benefits', desc: 'Smart AI signals, adaptive risk management, institutional analytics, and a 24/7 autonomous bot — all from a single professional-grade terminal.', color: '#10b981' },
              { icon: Shield, title: 'Our Commitment', desc: 'Full transparency, non-custodial security, and continuous model improvement. Your capital stays in your account — always. Zero custody risk.', color: T.gold },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{
                background: T.bgCard, border: `1px solid ${T.border}`,
                borderRadius: 20, padding: '1.75rem',
                transition: 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.text, margin: '0 0 0.6rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: T.textMuted, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* AI Engine panel */}
          <div style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(0,212,255,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(0,212,255,0.04) 100%)',
            border: `1px solid rgba(168,85,247,0.2)`,
            borderRadius: 20, padding: '2rem',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
          }} className="ai-engine-panel">
            {[
              { label: 'Instruments', value: '6', sub: 'XAU, BTC, FX, Indices' },
              { label: 'Timeframes', value: '12', sub: 'M1 to MN' },
              { label: 'Uptime', value: '24/7', sub: 'Cloud-hosted bots' },
              { label: 'Status', value: 'BETA', sub: 'Early Access Open' },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: T.purple, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: T.text, marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: T.textMuted }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ — PipNex pattern: centered accordion
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{ padding: sectionPad, background: T.bg }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100,
              padding: '0.3rem 1rem', fontSize: '0.72rem', fontWeight: 700,
              color: T.purple, letterSpacing: '0.1em', marginBottom: '1.1rem',
            }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 1rem', color: T.text, letterSpacing: '-0.025em' }}>
              Frequently Asked{' '}
              <span style={{ color: T.purple }}>Questions</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: T.bgCard, border: `1px solid ${openFaq === i ? 'rgba(168,85,247,0.35)' : T.border}`,
                borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.1rem 1.5rem', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: T.text, fontSize: '0.95rem', fontWeight: 600,
                  textAlign: 'left', gap: '1rem', letterSpacing: '-0.01em',
                }}>
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} color={T.purple} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={T.textMuted} style={{ flexShrink: 0 }} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.9rem', color: T.textMuted, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: '1rem' }}>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA — PipNex pattern: full-width gradient band
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem', background: T.bgSoft }}>
        <div style={{ ...maxW, textAlign: 'center' }}>
          <div style={{
            borderRadius: 28, padding: '4rem 2rem',
            background: isDark
              ? 'linear-gradient(135deg, #0d0820 0%, #0a1628 50%, #080b14 100%)'
              : 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)',
            border: `1px solid ${T.border}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '160%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: T.text, margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
                Ready to Trade Smarter?
              </h2>
              <p style={{ color: T.textMuted, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                Join XMX-QUANTUM Beta today. 14-day money-back guarantee. No credit card required to start.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem 2.5rem', borderRadius: 100, fontSize: '1rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7, #00d4ff)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 28px rgba(168,85,247,0.45)', transition: 'all 0.2s',
                }}>
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem 2.5rem', borderRadius: 100, fontSize: '1rem', fontWeight: 600,
                  background: 'transparent', color: T.text, textDecoration: 'none',
                  border: `1.5px solid ${T.borderBright}`, transition: 'all 0.2s',
                }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER — PipNex pattern: 4-column grid + bottom bar
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: isDark ? '#050710' : '#0f172a', color: '#94a3b8', padding: '4rem 1.5rem 2rem' }}>
        <div style={maxW}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            {/* Brand column */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <LogoIcon size={32} showWordmark wordmarkSize={14} wordmarkColor="#f1f5f9" showSubtitle subtitleColor="#475569" />
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#64748b', maxWidth: 280, marginBottom: '1.5rem' }}>
                Institutional-grade Quantum AI trading terminal. Built for serious retail traders by Quaxix Technologies.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['T', 'X', 'in', 'YT'].map(s => (
                  <div key={s} style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: '#64748b', cursor: 'pointer',
                  }}>{s}</div>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>PLATFORM</div>
              {['Dashboard', 'Signals', 'Bot Control', 'Analytics', 'Trade Journal', 'Leaderboard'].map(l => (
                <div key={l} style={{ marginBottom: '0.6rem' }}>
                  <Link to="/dashboard" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                  >{l}</Link>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>COMPANY</div>
              {['About', 'Pricing', 'Referral Program', 'Blog', 'Careers', 'Contact'].map(l => (
                <div key={l} style={{ marginBottom: '0.6rem' }}>
                  <a href="#about" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                  >{l}</a>
                </div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>LEGAL</div>
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Risk Disclosure', 'Cookie Policy'].map(l => (
                <div key={l} style={{ marginBottom: '0.6rem' }}>
                  <a href="#" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                  >{l}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              © 2025 Quaxix Technologies Ltd. All rights reserved. XMX-QUANTUM is in Beta — trading involves substantial risk.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'Refund'].map(l => (
                <a key={l} href="#" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Responsive styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');

        .landing-nav-links { display: flex !important; }
        .landing-nav-right { display: flex !important; }
        .landing-hamburger { display: none !important; }

        .hero-stat-cards { grid-template-columns: repeat(3, 1fr); }
        .features-grid-3col { grid-template-columns: repeat(3, 1fr); }
        .steps-grid { grid-template-columns: repeat(3, 1fr); }
        .about-grid { grid-template-columns: repeat(2, 1fr); }
        .ai-engine-panel { grid-template-columns: repeat(4, 1fr); }
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        .pricing-cards-row { flex-direction: row; }

        @media (max-width: 1024px) {
          .features-grid-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .ai-engine-panel { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
          .landing-nav-right { display: none !important; }
          .landing-hamburger { display: flex !important; }
          .hero-stat-cards { grid-template-columns: 1fr !important; max-width: 360px !important; }
          .features-grid-3col { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-connector { display: none !important; }
          .pricing-cards-row { flex-direction: column !important; align-items: stretch !important; }
          .pricing-cards-row > * { transform: none !important; margin-top: 0 !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .ai-engine-panel { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-cta-row { flex-direction: column !important; align-items: center !important; }
          .hero-cta-row a { width: 100% !important; max-width: 320px !important; justify-content: center !important; }
        }

        @media (max-width: 480px) {
          .ai-engine-panel { grid-template-columns: 1fr 1fr !important; }
          .hero-stat-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
