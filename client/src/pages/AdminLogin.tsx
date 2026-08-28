import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, User, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const { showToast, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide administrator credentials');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin({ email, password });
      if (res.success) {
        showToast(res.message || 'Admin authentication verified', 'success');
        navigate('/admin');
      } else {
        throw new Error(res.message || 'Admin authentication failed');
      }
    } catch (err: any) {
      error(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminFill = () => {
    setEmail('admin@store.pk');
    setPassword('Admin123!');
    showToast('Demo administrator credentials filled!', 'info');
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
          border: '1.5px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}
      >
        {/* Top security tag */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Shield size={32} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
            RESTRICTED ACCESS
          </span>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Store Admin Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Exclusive control center for managing stock, adding products, publishing offers, and fulfilling orders.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@store.pk"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Admin Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-sale btn-lg"
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginTop: '0.5rem', background: 'var(--gold-gradient)', color: '#0f172a' }}
          >
            {loading ? 'Verifying Authorization...' : 'Access Admin Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Auto-Fill Button */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={handleDemoAdminFill}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', gap: '0.4rem', border: '1px dashed var(--warning)' }}
          >
            <Key size={14} color="var(--warning)" /> Quick Demo Admin Credentials (admin@store.pk)
          </button>
        </div>

        {/* User Return Link */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Are you a customer? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Customer Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
