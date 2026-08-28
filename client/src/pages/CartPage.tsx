import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ArrowLeft,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatPKR } from '../utils/currency';

export const CartPage: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    totalPrice,
    totalItems
  } = useCart();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === 'PAKTECH2026' || promoCode.toUpperCase() === 'AUDIO15') {
      setDiscountApplied(true);
      showToast(`Promo code "${promoCode.toUpperCase()}" applied successfully!`, 'success');
    } else {
      showToast('Invalid promo code. Please check active flash sale codes.', 'error');
    }
  };

  const handleClearCart = async () => {
    const ok = await confirm({
      title: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart?',
      confirmText: 'Yes, Clear Cart',
      isDangerous: true
    });
    if (ok) {
      clearCart();
      showToast('Shopping cart cleared', 'info');
    }
  };

  const finalDiscount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = totalPrice - finalDiscount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--text-muted)'
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 2rem auto' }}>
          Looks like you haven't added any products to your bag yet. Explore our latest tech deals in PKR.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Explore Products Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Review your items and proceed to secure checkout in PKR.
            </p>
          </div>

          <button onClick={handleClearCart} className="btn btn-ghost btn-danger btn-sm">
            <Trash2 size={15} /> Clear Entire Cart
          </button>
        </div>

        {/* Free Shipping Alert */}
        <div
          className="card"
          style={{
            padding: '1rem 1.5rem',
            background: 'var(--bg-tertiary)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: subtotal >= 50000 ? 'var(--success-bg)' : 'var(--primary-light)',
                color: subtotal >= 50000 ? 'var(--success)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {subtotal >= 50000 ? 'FREE Nationwide Delivery Unlocked!' : 'Free Delivery in Pakistan'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {subtotal >= 50000
                  ? 'Your order qualifies for 100% free courier delivery anywhere in Pakistan.'
                  : `Add ${formatPKR(50000 - subtotal)} more to your cart to get free shipping.`}
              </div>
            </div>
          </div>

          <div style={{ width: '180px' }}>
            <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (subtotal / 50000) * 100)}%`,
                  height: '100%',
                  background: subtotal >= 50000 ? 'var(--success)' : 'var(--primary-gradient)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Cart Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }} className="cart-grid-layout">
          {/* Cart Items List */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map(item => (
                <div
                  key={item.product._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr auto',
                    gap: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center'
                  }}
                  className="cart-item-row"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.4rem'
                    }}
                  />

                  <div>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                      {item.product.category}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.4rem' }}>
                      <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                    </h3>
                    <div className="price-pkr" style={{ fontSize: '1.1rem' }}>
                      <span className="price-currency">₨</span>
                      {new Intl.NumberFormat('en-PK').format(item.product.price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        height: '36px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        style={{ padding: '0 10px', height: '100%', color: 'var(--text-secondary)' }}
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 800, padding: '0 10px', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        style={{ padding: '0 10px', height: '100%', color: 'var(--text-secondary)' }}
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal for item */}
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {formatPKR(item.product.price * item.quantity)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="btn btn-ghost btn-danger btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/shop" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary in PKR */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={14} /> Have a Promo Code?
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. PAKTECH2026"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </div>
              {discountApplied && (
                <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={14} /> 10% Flash Discount Applied!
                </div>
              )}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatPKR(subtotal)}</span>
              </div>

              {discountApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Promo Discount (10%)</span>
                  <span style={{ fontWeight: 700 }}>-{formatPKR(finalDiscount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery (Pakistan)</span>
                <span style={{ fontWeight: 700, color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                  {shipping === 0 ? 'FREE' : formatPKR(shipping)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total in PKR</span>
              <span className="price-pkr" style={{ fontSize: '1.6rem' }}>
                <span className="price-currency">₨</span>
                {new Intl.NumberFormat('en-PK').format(grandTotal)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              🔒 256-bit Encrypted Checkout • Cash on Delivery Available
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
