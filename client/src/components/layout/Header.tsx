import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Search,
  User as UserIcon,
  Shield,
  LogOut,
  Package,
  Sliders,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { totalItems, wishlist, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Smartphones', path: '/shop?category=Smartphones' },
    { name: 'Audio & Sound', path: '/shop?category=Audio' },
    { name: 'Electronics', path: '/shop?category=Electronics' },
    { name: 'Special Offers', path: '/shop?filter=offers', isOffer: true }
  ];

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 7000, width: '100%' }}>
      {/* Top Notification Announcement Bar */}
      <div
        style={{
          background: 'var(--sale-gradient)',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 700,
          textAlign: 'center',
          padding: '0.35rem 1rem',
          letterSpacing: '0.02em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>⚡ GRAND PAKISTAN TECH GALA • FREE NATIONWIDE DELIVERY ON ORDERS OVER RS. 50,000</span>
      </div>

      <div className="max-w-7xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '1rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', lineHeight: 1, letterSpacing: '-0.03em' }}>
              SM*<span style={{ color: 'var(--primary)' }}>STORE</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
              PAKISTAN • PKR
            </div>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'none',
            flex: 1,
            maxWidth: '420px',
            position: 'relative'
          }}
          className="desktop-search-form"
        >
          <Search
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search Sony headphones, iPhone 15, laptops..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '40px',
              paddingRight: '80px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              height: '42px'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{
              position: 'absolute',
              right: '4px',
              top: '4px',
              bottom: '4px',
              borderRadius: 'var(--radius-full)',
              padding: '0 1rem'
            }}
          >
            Search
          </button>
        </form>

        {/* Desktop & Tablet Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Day / Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon btn-ghost"
            title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            aria-label="Toggle theme"
            style={{ border: '1px solid var(--border-color)' }}
          >
            {theme === 'dark' ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6366f1" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/shop?filter=wishlist"
            className="btn-icon btn-ghost"
            style={{ position: 'relative', border: '1px solid var(--border-color)' }}
            title="Wishlist"
          >
            <Heart size={20} color={wishlist.length > 0 ? '#ef4444' : 'var(--text-primary)'} fill={wishlist.length > 0 ? '#ef4444' : 'none'} />
            {wishlist.length > 0 && (
              <span className="badge-pill-counter" style={{ top: '-4px', right: '-4px' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="btn btn-primary"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.1rem',
              gap: '0.4rem'
            }}
            title="Open Shopping Cart"
          >
            <ShoppingBag size={18} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cart</span>
            {totalItems > 0 && (
              <span
                style={{
                  background: '#ffffff',
                  color: '#4f46e5',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* User / Admin Authentication State */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn btn-secondary"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.5rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isAdmin ? <Shield size={18} color="var(--warning)" /> : <UserIcon size={18} color="var(--primary)" />}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name.split(' ')[0]}
                </span>
                {isAdmin && <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>ADMIN</span>}
              </button>

              {isUserMenuOpen && (
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    minWidth: '220px',
                    padding: '0.5rem',
                    zIndex: 8000
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        <Shield size={16} color="var(--warning)" /> Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        <Package size={16} /> Manage Products & Stock
                      </Link>
                      <Link
                        to="/admin/offers"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        <Sliders size={16} /> Big Offers & Promos
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        <ShoppingBag size={16} /> Manage Orders
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      <Package size={16} /> My Orders & Tracking
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost btn-danger"
                      style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 700 }}
              >
                Sign In
              </Link>
              <Link
                to="/admin/login"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Admin Control Login"
              >
                <Shield size={14} /> Admin
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-icon btn-ghost mobile-menu-btn"
            style={{ border: '1px solid var(--border-color)' }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links Bar */}
      <div
        className="desktop-nav-bar"
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)'
        }}
      >
        <div className="max-w-7xl" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '44px', overflowX: 'auto' }}>
          {navLinks.map(link => {
            const isActive = location.pathname + location.search === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 600,
                  color: link.isOffer ? 'var(--warning)' : isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  padding: '0.3rem 0',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {link.isOffer && <span className="stock-dot low-stock" />}
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xl)',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.25rem', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search products in PKR..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
            />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-ghost"
                style={{
                  justifyContent: 'flex-start',
                  fontWeight: 600,
                  color: link.isOffer ? 'var(--warning)' : 'var(--text-primary)'
                }}
              >
                {link.isOffer && <span className="stock-dot low-stock" />}
                {link.name}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Customer Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                <Shield size={16} /> Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .desktop-search-form { display: none !important; }
          .desktop-nav-bar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .desktop-search-form { display: block !important; }
          .desktop-nav-bar { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
