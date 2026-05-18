import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Shield, BarChart3, Bot, Globe, Check, ChevronDown, ChevronUp, Star, ArrowRight, TrendingUp, Activity, Users, Menu, X } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI-Powered Signals', desc: 'Machine learning models trained on 10M+ historical trades generate high-probability signals in real time.' },
  { icon: Zap, title: 'Sub-Second Execution', desc: 'Direct MT5 integration with smart order routing ensures your trades execute at the best available price.' },
  { icon: Shield, title: 'Risk Management', desc: 'Automated stop-loss, take-profit, and drawdown protection keeps your capital safe around the clock.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep-dive performance metrics: Sharpe ratio, profit factor, win-rate heatmaps, and custom dashboards.' },
  { icon: Bot, title: 'Autonomous Bot', desc: 'Set it and forget it. The bot runs 24/7, scanning 6 instruments and executing trades while you sleep.' },
  { icon: Globe, title: 'Multi-Instrument', desc: 'Trade XAUUSDm, BTCUSDm, EURUSD, GBPUSD, NASDAQm, and US30m from one unified terminal.' },
];

const PRICING = [
  {
    tier: 'Basic', price: 29, color: 'var(--text-secondary)', featured: false,
    features: ['3 Instruments', '50 Trades/Month', 'Basic Signals', 'Email Alerts', 'Community Access'],
  },
  {
    tier: 'Pro', price: 79, color: 'var(--cyan)', featured: true,
    features: ['6 Instruments', 'Unlimited Trades', 'AI Signals', 'Telegram Alerts', 'Analytics Dashboard', 'Bot Control', 'Priority Support'],
  },
  {
    tier: 'Elite', price: 199, color: '#7f00ff', featured: false,
    features: ['Everything in Pro', 'ML Model Access', 'Custom Strategies', 'API Access', 'Dedicated Account Manager', 'White-label Option'],
  },
];

const TESTIMONIALS = [
  { name: 'Marcus L.', role: 'Prop Trader, London', avatar: 'ML', text: 'XMX-QUANTUM changed my trading completely. 78% win rate in 3 months. The AI signals are uncannily accurate on Gold.', stars: 5 },
  { name: 'Aisha R.', role: 'Retail Trader, Dubai', avatar: 'AR', text: "I was skeptical at first, but the bot's risk management saved me during the May volatility. Down only 3% when others lost 20%.", stars: 5 },
  { name: 'James K.', role: 'Fund Manager, Lagos', avatar: 'JK', text: 'The analytics suite alone is worth the subscription. I finally understand my own performance at a level I never could before.', stars: 5 },
];

const FAQS = [
  { q: 'Does XMX-QUANTUM work with my broker?', a: 'XMX-QUANTUM integrates with any MT5 broker. We support over 200 regulated brokers worldwide including IC Markets, FTMO, and XM.' },
  { q: 'What instruments can I trade?', a: 'Currently XAUUSDm (Gold), BTCUSDm (Bitcoin), EURUSD, GBPUSD, NASDAQm, and US30m. More instruments are added monthly.' },
  { q: 'Is my capital safe?', a: 'XMX-QUANTUM never holds your funds. Your capital stays in your own broker account. We only send trade signals and manage orders via MT5 API.' },
  { q: 'How is the 78% win rate calculated?', a: 'Aggregated across all active Pro/Elite accounts over the last 90 days. Individual results may vary based on risk settings and market conditions.' },
  { q: 'Can I run the bot 24/7?', a: 'Yes. The bot is cloud-hosted and runs continuously. It monitors the market, manages open positions, and executes signals even when your device is off.' },
  { q: 'What is the refund policy?', a: 'We offer a 14-day money-back guarantee, no questions asked. If you are not satisfied within 14 days of your first payment, we will refund you in full.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="landing-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: 'auto' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--cyan), #0066cc)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', color: '#000' }}>XQ</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--cyan)', letterSpacing: '0.05em' }}>XMX-QUANTUM</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>by Quaxix Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }} className="mobile-hidden">
          {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >{item}</a>
          ))}
        </div>
        <Link to="/login" className="btn btn-outline btn-sm mobile-hidden" style={{ marginLeft: '0.5rem' }}>Sign In</Link>
        <Link to="/dashboard" className="btn btn-cyan btn-sm mobile-hidden">Start Free Trial</Link>
        
        {/* Mobile Hamburger Icon */}
        <button className="desktop-hidden" onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: '0.25rem' }}>
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', inset: 0, background: '#0a1628', zIndex: 200, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
                <X size={32} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginTop: '2rem' }}>
              {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
              
              <div style={{ width: '100%', maxWidth: 300, height: 1, background: 'var(--border)', margin: '0.5rem 0' }} />
              
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-cyan btn-lg" style={{ width: '100%', maxWidth: 300, justifyContent: 'center', marginTop: '0.5rem', fontSize: '1.1rem' }}>Start Free Trial</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-hidden { display: none !important; }
        @media (max-width: 768px) {
          .desktop-hidden { display: block !important; }
          .mobile-hidden { display: none !important; }
          .landing-nav { padding: 0 1.25rem !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="hero-bg" style={{ padding: '6rem 2rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }} style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-block', background: 'var(--cyan-dim)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 999, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--cyan)', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              🚀 Now with GPT-4 Powered Analysis
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            The AI Trading Terminal That{' '}
            <span className="gradient-text">Thinks Faster Than Markets</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            XMX-QUANTUM combines institutional-grade AI with autonomous bot execution to give retail traders an unfair edge. Professional terminal. Zero compromise.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-cyan btn-lg" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
              Start Trading Now <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-outline btn-lg" style={{ fontSize: '1rem' }}>
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            maxWidth: 900, margin: '4rem auto 0', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.1)',
          }}
        >
          {/* Terminal Header */}
          <div style={{ background: '#080f1d', borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ marginLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>XMX-QUANTUM Terminal v2.1.4 — LIVE</span>
            <div className="status-dot" style={{ marginLeft: 'auto' }} />
          </div>
          {/* Mini Dashboard Preview */}
          <div className="grid-4" style={{ padding: '1.5rem', gap: '1rem' }}>
            {[
              { label: 'Balance', value: '$23,847.50', color: 'var(--cyan)' },
              { label: "Today's P&L", value: '+$342.80', color: 'var(--green)' },
              { label: 'Win Rate', value: '78.4%', color: 'var(--cyan)' },
              { label: 'Active Bots', value: '3 Running', color: 'var(--green)' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: TrendingUp, value: '50,000+', label: 'Trades Executed' },
            { icon: Activity, value: '78%', label: 'Average Win Rate' },
            { icon: Users, value: '$2.3M', label: 'Profit Generated' },
          ].map(({ icon: Icon, value, label }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <Icon size={24} color="var(--cyan)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Everything You Need to <span className="gradient-text">Dominate the Markets</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Built for serious traders who demand professional-grade tools without institutional fees.</p>
        </motion.div>
        <div className="stats-grid" style={{ gap: '1.5rem' }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="feature-icon"><Icon size={22} /></div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '5rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Simple, <span className="gradient-text">Transparent Pricing</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>No hidden fees. Cancel anytime. 14-day money-back guarantee.</p>
          </motion.div>
          <div className="stats-grid" style={{ gap: '1.5rem' }}>
            {PRICING.map(({ tier, price, featured, features }, i) => (
              <motion.div key={tier} className={`pricing-card ${featured ? 'featured' : ''}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ transform: featured ? 'scale(1.04)' : undefined }}>
                {featured && <div className="pricing-badge">Most Popular</div>}
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: PRICING[i].color }}>{tier}</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.25rem' }}>${price}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span></div>
                <div style={{ height: 1, background: 'var(--border)', margin: '1.25rem 0' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, marginBottom: '1.5rem' }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Check size={14} color="var(--green)" style={{ flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`btn ${featured ? 'btn-cyan' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '5rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Trusted by <span className="gradient-text">5,000+ Traders</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real results from real traders using XMX-QUANTUM.</p>
        </motion.div>
        <div className="stats-grid" style={{ gap: '1.5rem' }}>
          {TESTIMONIALS.map(({ name, role, avatar, text, stars }, i) => (
            <motion.div key={name} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                {Array(stars).fill(0).map((_, j) => <Star key={j} size={14} fill="#ffd700" color="#ffd700" />)}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), #7f00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>{avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Frequently Asked <span className="gradient-text">Questions</span></h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map(({ q, a }, i) => (
              <motion.div key={i} className="card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', gap: '1rem' }}
                >
                  {q}
                  {openFaq === i ? <ChevronUp size={18} color="var(--cyan)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>
                {openFaq === i && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Trade <span className="gradient-text">Like an Institution?</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>Join 5,000+ traders using XMX-QUANTUM. Start your 14-day free trial today.</p>
          <Link to="/dashboard" className="btn btn-cyan btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
            Start Trading Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="stats-grid" style={{ gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--cyan), #0066cc)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.7rem', color: '#000' }}>XQ</div>
                <span style={{ fontWeight: 800, color: 'var(--cyan)', fontSize: '0.85rem' }}>XMX-QUANTUM</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Professional AI trading terminal by Quaxix Technologies. Trade smarter, not harder.</p>
            </div>
            {[
              { title: 'Platform', links: ['Dashboard', 'Bot Control', 'Analytics', 'Signals', 'Trade Journal'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {links.map(l => <a key={l} href="#" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>© 2026 Quaxix Technologies Ltd. All rights reserved.</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>⚠️ Trading involves significant risk. Past performance is not indicative of future results.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
