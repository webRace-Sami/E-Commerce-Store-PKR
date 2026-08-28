import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Flame, ShoppingBag, User, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { user, isAdmin, isAuthenticated } = useAuth();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
        end
      >
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
      >
        <Compass size={22} />
        <span>Catalog</span>
      </NavLink>

      <NavLink
        to="/shop?filter=offers"
        className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
      >
        <div style={{ position: 'relative' }}>
          <Flame size={22} color="var(--warning)" />
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-4px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--danger)',
              boxShadow: '0 0 6px var(--danger)'
            }}
          />
        </div>
        <span style={{ color: 'var(--warning)', fontWeight: 700 }}>Offers</span>
      </NavLink>

      {/* Cart Button */}
      <button
        type="button"
        onClick={openCart}
        className="nav-item-mobile"
        style={{ position: 'relative' }}
        aria-label="Open Cart"
      >
        <ShoppingBag size={22} />
        {totalItems > 0 && <span className="badge-pill-counter">{totalItems}</span>}
        <span>Cart</span>
      </button>

      {/* Profile or Admin */}
      {isAdmin ? (
        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
        >
          <Shield size={22} color="var(--warning)" />
          <span>Admin</span>
        </NavLink>
      ) : isAuthenticated ? (
        <NavLink
          to="/orders"
          className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
        >
          <User size={22} />
          <span>Orders</span>
        </NavLink>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`}
        >
          <User size={22} />
          <span>Login</span>
        </NavLink>
      )}
    </nav>
  );
};
