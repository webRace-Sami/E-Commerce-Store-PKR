import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Headphones, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPKR } from '../../utils/currency';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '3rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto'
      }}
    >
      <div className="max-w-7xl">
        {/* Value Proposition Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Free Delivery</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders above {formatPKR(settings.freeShippingThreshold)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>100% Genuine Tech</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official warranty & PTA approved</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--warning-bg)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <RefreshCw size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>7 Days Easy Return</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hassle-free replacement policy</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>24/7 Priority Support</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp & phone assistance</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                SM*<span style={{ color: 'var(--primary)' }}>STORE</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Pakistan’s leading destination for premium consumer electronics, flagship smartphones, studio audio, and computer peripherals in PKR.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">₨ PKR Pricing</span>
              <span className="badge badge-success">Cash on Delivery</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>WhatsApp Helpline:</strong> {settings.phone}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Link to="/shop?category=Smartphones" style={{ transition: 'color 0.2s' }}>Smartphones & Tablets</Link>
              <Link to="/shop?category=Audio" style={{ transition: 'color 0.2s' }}>Studio Audio & Headphones</Link>
              <Link to="/shop?category=Electronics" style={{ transition: 'color 0.2s' }}>Laptops & Computing</Link>
              <Link to="/shop?category=Accessories" style={{ transition: 'color 0.2s' }}>Smart Watches & Power Banks</Link>
              <Link to="/shop?filter=offers" style={{ color: 'var(--warning)', fontWeight: 600 }}>Flash Sale Offers</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Customer Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Link to="/orders">Track My Order</Link>
              <Link to="/shop">Shipping & Delivery Info</Link>
              <Link to="/shop">Warranty & Return Claims</Link>
              <Link to="/login">Customer Sign In</Link>
              <Link to="/register">Create Account</Link>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Administration
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Dedicated portal for store managers to edit inventory, stock counts, and flash sale banners.
            </p>
            <Link
              to="/admin/login"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}
            >
              <Shield size={14} /> Admin Access Portal
            </Link>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} SM*Store Pakistan. All rights reserved to WebRace Co. 2026.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Accepted in Pakistan:</span>
            <span className="badge badge-secondary" style={{ border: '1px solid var(--border-color)' }}>Cash on Delivery (COD)</span>
            <span className="badge badge-secondary" style={{ border: '1px solid var(--border-color)' }}>Bank Transfer</span>
            <span className="badge badge-secondary" style={{ border: '1px solid var(--border-color)' }}>EasyPaisa / JazzCash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
