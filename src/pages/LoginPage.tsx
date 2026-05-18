import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Zap } from 'lucide-react';
import LogoIcon from '../components/LogoIcon';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top left, rgba(37,99,235,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(124,58,237,0.08) 0%, transparent 50%), var(--bg-primary)',
      padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <LogoIcon size={64} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
            <span className="gradient-text">XMX-QUANTUM</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>by Quaxix Technologies</p>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 'clamp(1.25rem, 4vw, 2rem)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Sign in to your account</h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="username"
                  className="form-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.25rem', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setRemember(r => !r)}>
                <div className={`toggle ${remember ? 'active' : ''}`} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: '0.82rem', color: 'var(--cyan)', minHeight: 44, display: 'flex', alignItems: 'center' }}>Forgot password?</a>
            </div>

            <motion.button
              type="submit"
              className="btn btn-cyan btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', position: 'relative', minHeight: 48 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                    <Zap size={16} />
                  </motion.div>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Sign up</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Lock size={11} />
          256-bit SSL encrypted
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
