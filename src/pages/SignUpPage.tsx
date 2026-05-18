import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Zap, CheckCircle } from 'lucide-react';
import LogoIcon from '../components/LogoIcon';

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    if (!agree) e.agree = 'You must agree to the terms';
    return e;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 1400);
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColors = ['#ff3b6b', '#ff8c00', '#ffd700', '#00ff88'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strength = passwordStrength();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(0,212,255,0.07) 0%, transparent 50%), var(--bg-primary)',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', padding: '0' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <LogoIcon size={64} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>XMX-QUANTUM</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>by Quaxix Technologies</p>
        </div>

        {/* Card */}
        <div className="card" style={{
          borderRadius: 20, padding: 'clamp(1.25rem, 4vw, 2rem)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '1.5rem 0' }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ marginBottom: '1rem' }}
              >
                <CheckCircle size={56} color="var(--green)" style={{ margin: '0 auto' }} />
              </motion.div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--green)' }}>Account Created!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Redirecting you to the dashboard...</p>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Create your account</h2>

              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Username */}
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                      style={{ paddingLeft: '2.5rem', borderColor: errors.username ? 'var(--red)' : undefined }}
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && <div style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</div>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      style={{ paddingLeft: '2.5rem', borderColor: errors.email ? 'var(--red)' : undefined }}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <div style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderColor: errors.password ? 'var(--red)' : undefined }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <div style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                  {/* Password strength bar */}
                  {password && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i < strength ? strengthColors[strength - 1] : 'var(--border)',
                            transition: 'background 0.3s',
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: strength > 0 ? strengthColors[strength - 1] : 'var(--text-muted)' }}>
                        {strength > 0 ? strengthLabels[strength - 1] : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderColor: errors.confirm ? 'var(--red)' : (confirm && confirm === password) ? 'var(--green)' : undefined }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <div style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirm}</div>}
                  {confirm && confirm === password && !errors.confirm && (
                    <div style={{ color: 'var(--green)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={12} /> Passwords match
                    </div>
                  )}
                </div>

                {/* Terms agreement */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                    <div
                      onClick={() => { setAgree(a => !a); setErrors(p => ({ ...p, agree: '' })); }}
                      style={{
                        width: 18, height: 18, borderRadius: 4, border: `2px solid ${errors.agree ? 'var(--red)' : agree ? 'var(--cyan)' : 'var(--border-bright)'}`,
                        background: agree ? 'var(--cyan)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 2, transition: 'all 0.2s',
                      }}
                    >
                      {agree && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      I agree to the{' '}
                      <a href="#" style={{ color: 'var(--cyan)' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" style={{ color: 'var(--cyan)' }}>Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agree && <div style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.agree}</div>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="btn btn-cyan btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', position: 'relative', background: 'linear-gradient(135deg, #7c3aed, #00d4ff)', color: '#fff', border: 'none' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                        <Zap size={16} />
                      </motion.div>
                      Creating account...
                    </span>
                  ) : 'Create Free Account'}
                </motion.button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Sign in</Link>
              </div>
            </>
          )}
        </div>

        {/* Security note */}
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Lock size={11} />
          256-bit SSL encrypted · Non-custodial · 14-day free trial
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
