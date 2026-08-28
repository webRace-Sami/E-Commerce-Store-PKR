import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, User, Key, KeyRound, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

type AdminView = 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-password';

export const AdminLogin: React.FC = () => {
  const [view, setView] = useState<AdminView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password state
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      error('Please enter your administrator email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(resetEmail);
      if (res.success) {
        setOtpSentCode(res.otp || null);
        showToast(res.message || 'Verification OTP code dispatched!', 'success');
        setView('forgot-otp');
      } else {
        throw new Error(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      error(err.message || 'Failed to initiate password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      error('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(resetEmail, otp.trim());
      if (res.success) {
        showToast('OTP code verified! Please set a new password.', 'success');
        setView('forgot-password');
      } else {
        throw new Error(res.message || 'Verification failed');
      }
    } catch (err: any) {
      error(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({
        email: resetEmail,
        otp: otp.trim(),
        newPassword
      });

      if (res.success) {
        showToast('Admin password updated successfully! Please sign in.', 'success');
        setEmail(resetEmail);
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpSentCode(null);
        setView('login');
      } else {
        throw new Error(res.message || 'Password update failed');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update admin password');
    } finally {
      setLoading(false);
    }
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
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
        {/* ================= VIEW: LOGIN ================= */}
        {view === 'login' && (
          <>
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
                Sign in with admin email and password. Multi-device simultaneous access enabled.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
                />
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Admin Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      setView('forgot-email');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--warning)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
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

            {/* User Return Link */}
            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Are you a customer? </span>
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Customer Sign In
              </Link>
            </div>
          </>
        )}

        {/* ================= VIEW: ADMIN FORGOT STEP 1 ================= */}
        {view === 'forgot-email' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
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
                <KeyRound size={28} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Admin Password Reset
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Enter administrator email to receive a 6-digit OTP verification code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@store.pk"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="form-input"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-sale btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', background: 'var(--gold-gradient)', color: '#0f172a' }}
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} /> Back to Admin Sign In
              </button>
            </form>
          </>
        )}

        {/* ================= VIEW: ADMIN FORGOT STEP 2 (OTP) ================= */}
        {view === 'forgot-otp' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Shield size={28} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Verify Admin Code
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Enter the OTP sent to <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
              </p>
            </div>

            {otpSentCode && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--warning)',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={16} /> Verification Code: <strong style={{ letterSpacing: '2px' }}>{otpSentCode}</strong>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">6-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  style={{
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '8px',
                    fontWeight: 700,
                    borderColor: 'rgba(245, 158, 11, 0.3)'
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn btn-sale btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', background: 'var(--gold-gradient)', color: '#0f172a' }}
              >
                {loading ? 'Verifying...' : 'Verify OTP Code'}
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, gap: '0.35rem' }}
                >
                  <RefreshCw size={14} /> Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => setView('forgot-email')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, gap: '0.35rem' }}
                >
                  <ArrowLeft size={14} /> Change Email
                </button>
              </div>
            </form>
          </>
        )}

        {/* ================= VIEW: ADMIN FORGOT STEP 3 ================= */}
        {view === 'forgot-password' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
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
                <Lock size={28} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                New Admin Password
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Set a strong password for administrator <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-sale btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', background: 'var(--gold-gradient)', color: '#0f172a' }}
              >
                {loading ? 'Updating Password...' : 'Update & Sign In'}
                <CheckCircle2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.4rem' }}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
