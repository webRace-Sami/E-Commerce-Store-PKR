import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield, Key, KeyRound, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

type AuthView = 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-password';

export const UserLogin: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password / OTP State
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);

  const { loginCustomer } = useAuth();
  const { showToast, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  // Regular Email Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide both your email address and password');
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

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      error('Please enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(resetEmail);
      if (res.success) {
        setOtpSentCode(res.otp || null);
        showToast(res.message || 'OTP verification code sent!', 'success');
        setView('forgot-otp');
      } else {
        throw new Error(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      error(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      error('Please enter the valid 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(resetEmail, otp.trim());
      if (res.success) {
        showToast(res.message || 'OTP verified! Please create a new password.', 'success');
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

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Passwords do not match. Please re-enter.');
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
        showToast(res.message || 'Password reset successfully! Please sign in.', 'success');
        setEmail(resetEmail);
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpSentCode(null);
        setView('login');
      } else {
        throw new Error(res.message || 'Password reset failed');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update password');
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
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* ================= VIEW: LOGIN ================= */}
        {view === 'login' && (
          <>
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
                Log in via email to manage orders, track shipments, and checkout.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      setView('forgot-email');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
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
          </>
        )}

        {/* ================= VIEW: FORGOT STEP 1 (EMAIL) ================= */}
        {view === 'forgot-email' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <KeyRound size={28} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Password Recovery
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Enter your registered email address to receive a 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Registered Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
              >
                {loading ? 'Generating OTP...' : 'Send Verification OTP'}
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </form>
          </>
        )}

        {/* ================= VIEW: FORGOT STEP 2 (OTP) ================= */}
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
                Verify 6-Digit Code
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Enter the OTP sent to <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
              </p>
            </div>

            {/* Quick Helper Banner if code available in preview */}
            {otpSentCode && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--success)',
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
                    fontWeight: 700
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
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

        {/* ================= VIEW: FORGOT STEP 3 (NEW PASSWORD) ================= */}
        {view === 'forgot-password' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Lock size={28} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Set New Password
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Create a secure password for <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
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
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
              >
                {loading ? 'Updating Password...' : 'Reset & Log In'}
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
