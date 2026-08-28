import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield, ShoppingBag, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const UserLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginCustomer } = useAuth();
  const { showToast, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomer({ email, password });
      if (res.success) {
        showToast(res.message || 'Login successful!', 'success');
        navigate(from, { replace: true });
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUserFill = () => {
    setEmail('user@store.pk');
    setPassword('User123!');
    showToast('Demo customer credentials filled!', 'info');
  };

  return (
    <div style={{ padding: '3rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <User size={28} />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Customer Sign In
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Log in to manage your orders, track shipments, and access your cart.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@store.pk"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Password</label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Customer'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Auto-Fill Button */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={handleDemoUserFill}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', gap: '0.4rem' }}
          >
            <Key size={14} /> Quick Demo Customer Credentials (user@store.pk)
          </button>
        </div>

        {/* Switch Links */}
        <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'center', fontSize: '0.88rem' }}>
          <div>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create Customer Account
            </Link>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Store Manager or Admin? </span>
            <Link
              to="/admin/login"
              style={{
                color: 'var(--warning)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Shield size={14} /> Admin Access Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
