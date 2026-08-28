import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPKR } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    totalPrice,
    totalItems
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="modal-backdrop" onClick={closeCart} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 9999
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Shopping Cart ({totalItems})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="btn-icon btn-ghost"
            style={{ width: '34px', height: '34px' }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress in Pakistan */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 600 }}>
            <Truck size={16} color={subtotal >= 50000 ? 'var(--success)' : 'var(--primary)'} />
            {subtotal >= 50000 ? (
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>🎉 You have qualified for FREE Delivery in Pakistan!</span>
            ) : (
              <span>Add {formatPKR(50000 - subtotal)} more for <strong>FREE Delivery</strong></span>
            )}
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'var(--border-color)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (subtotal / 50000) * 100)}%`,
                height: '100%',
                background: subtotal >= 50000 ? 'var(--success)' : 'var(--primary-gradient)',
                borderRadius: '999px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  color: 'var(--text-muted)'
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Explore our catalog with premium tech at best PKR rates.</p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.product._id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{
                    width: '74px',
                    height: '74px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        lineHeight: 1.3,
                        marginBottom: '0.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div className="price-pkr" style={{ fontSize: '0.95rem' }}>
                      <span className="price-currency">₨</span>
                      {new Intl.NumberFormat('en-PK').format(item.product.price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    {/* Quantity controls */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                        height: '30px'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        style={{ padding: '0 8px', height: '100%', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 8px' }}>
                        {item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        style={{ padding: '0 8px', height: '100%', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      style={{ color: 'var(--danger)', padding: '4px', cursor: 'pointer' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatPKR(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Delivery (Pakistan)</span>
              <span style={{ fontWeight: 700, color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                {shipping === 0 ? 'FREE' : formatPKR(shipping)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                alignItems: 'baseline'
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Total in PKR</span>
              <span className="price-pkr" style={{ fontSize: '1.4rem' }}>
                <span className="price-currency">₨</span>
                {new Intl.NumberFormat('en-PK').format(totalPrice)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleViewCart}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              >
                View Full Cart Page
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
