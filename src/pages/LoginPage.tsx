import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import LogoIcon from '../components/LogoIcon';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Sign Up state
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: '', color: 'transparent', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (score === 2) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    if (score === 3) return { label: 'Good', color: '#10b981', width: '75%' };
    return { label: 'Strong', color: '#00d4ff', width: '100%' };
  };

  const strength = getPasswordStrength(signUpPassword);
  const passwordsMatch = signUpPassword && signUpConfirm && signUpPassword === signUpConfirm;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms || !passwordsMatch) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => navigate('/dashboard'), 1500); }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(168,85,247,0.1) 0%, transparent 60%), #0a0a0f',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Back to home */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440, position: 'relative' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <LogoIcon size={56} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 900, marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">XMX-QUANTUM</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>by Quaxix Technologies</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,15,25,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)',
        }}>
          {/* Tab Bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            {(['signin', 'signup'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSuccess(false); }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                  borderBottom: activeTab === tab ? '2px solid #00d4ff' : '2px solid transparent',
                  transition: 'all 0.2s',
                  letterSpacing: '-0.01em',
                  minHeight: 48,
                }}
              >
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={handleSignIn}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email or Username</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                      <input
                        className="form-input"
                        type="text"
                        placeholder="you@example.com"
                        value={signInEmail}
                        onChange={e => setSignInEmail(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                      <input
                        className="form-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: '0.25rem', minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: 36 }} onClick={() => setRemember(r => !r)}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4,
                        border: `2px solid ${remember ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
                        background: remember ? '#00d4ff' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                      }}>
                        {remember && <CheckCircle size={10} color="#000" />}
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Remember me</span>
                    </label>
                    <a href="#" style={{ fontSize: '0.82rem', color: '#00d4ff', textDecoration: 'none' }}>Forgot password?</a>
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    style={{
                      width: '100%', minHeight: 50, borderRadius: 12,
                      background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                      border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      letterSpacing: '-0.01em', marginTop: '0.25rem',
                      boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    {loading ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Zap size={16} /></motion.div> Signing In...</>
                    ) : 'Sign In'}
                  </motion.button>

                  <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setActiveTab('signup')} style={{ background: 'none', border: 'none', color: '#00d4ff', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>
                      Sign up free
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={handleSignUp}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  {success ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <CheckCircle size={48} color="#00d4ff" style={{ margin: '0 auto 1rem' }} />
                      <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Account Created!</h3>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Redirecting to dashboard...</p>
                    </motion.div>
                  ) : (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                          <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                          <input className="form-input" type="text" placeholder="Choose a username" value={signUpUsername} onChange={e => setSignUpUsername(e.target.value)} style={{ paddingLeft: '2.5rem' }} autoComplete="username" required minLength={3} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                          <input className="form-input" type="email" placeholder="you@example.com" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} style={{ paddingLeft: '2.5rem' }} autoComplete="email" required />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                          <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} autoComplete="new-password" required minLength={8} />
                          <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {signUpPassword && (
                          <div style={{ marginTop: '0.4rem' }}>
                            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} style={{ height: '100%', background: strength.color, borderRadius: 2, transition: 'all 0.3s' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: strength.color, marginTop: '0.2rem', display: 'block' }}>{strength.label}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                          <input className="form-input" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat your password" value={signUpConfirm} onChange={e => setSignUpConfirm(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem', borderColor: signUpConfirm ? (passwordsMatch ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)') : undefined }} autoComplete="new-password" required />
                          <button type="button" onClick={() => setShowConfirmPassword(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {signUpConfirm && (
                          <p style={{ fontSize: '0.72rem', marginTop: '0.25rem', color: passwordsMatch ? '#10b981' : '#ef4444' }}>
                            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </p>
                        )}
                      </div>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', minHeight: 36 }} onClick={() => setAgreedTerms(t => !t)}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, marginTop: 2,
                          border: `2px solid ${agreedTerms ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
                          background: agreedTerms ? '#00d4ff' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s', flexShrink: 0,
                        }}>
                          {agreedTerms && <CheckCircle size={10} color="#000" />}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                          I agree to the <a href="#" style={{ color: '#00d4ff' }}>Terms of Service</a> and <a href="#" style={{ color: '#00d4ff' }}>Privacy Policy</a>
                        </span>
                      </label>

                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !agreedTerms || !passwordsMatch}
                        style={{
                          width: '100%', minHeight: 50, borderRadius: 12,
                          background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                          border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                          cursor: (loading || !agreedTerms || !passwordsMatch) ? 'not-allowed' : 'pointer',
                          opacity: (loading || !agreedTerms || !passwordsMatch) ? 0.5 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          letterSpacing: '-0.01em', marginTop: '0.25rem',
                          boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
                          transition: 'all 0.2s',
                        }}
                      >
                        {loading ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Zap size={16} /></motion.div> Creating Account...</>
                        ) : 'Create Account'}
                      </motion.button>

                      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
                        Already have an account?{' '}
                        <button type="button" onClick={() => setActiveTab('signin')} style={{ background: 'none', border: 'none', color: '#00d4ff', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>
                          Sign in
                        </button>
                      </p>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Lock size={11} />
          256-bit SSL encrypted &nbsp;·&nbsp; Non-custodial &nbsp;·&nbsp; BETA
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
