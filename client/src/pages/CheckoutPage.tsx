import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatPKR } from '../utils/currency';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shipping, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast, error } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Karachi',
    postalCode: user?.address?.postalCode || '',
    notes: '',
    paymentMethod: 'Cash on Delivery' as 'Cash on Delivery' | 'Bank Transfer' | 'EasyPaisa / JazzCash'
  });

  const pakistanCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Abbottabad',
    'Bahawalpur'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      error('Your cart is empty');
      navigate('/shop');
      return;
    }

    if (!formData.customerName || !formData.customerPhone || !formData.address || !formData.city) {
      error('Please complete all required shipping fields');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || 'customer@store.pk',
        customerPhone: formData.customerPhone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        orderItems: items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity
        })),
        paymentMethod: formData.paymentMethod
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setPlacedOrder(res.order);
        clearCart();
        showToast('Order confirmed successfully!', 'success');
      } else {
        throw new Error(res.message || 'Order failed');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (placedOrder) {
    return (
      <div className="max-w-7xl" style={{ padding: '3rem 1rem 5rem 1rem', textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '580px',
            margin: '0 auto',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
            ORDER CONFIRMED
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Shukriya, {placedOrder.customerName}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Your order has been recorded in our dispatch system. We will contact you via WhatsApp / Call at <strong>{placedOrder.customerPhone}</strong> to confirm delivery.
          </p>

          {/* Receipt Info Box */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <strong style={{ fontFamily: 'monospace' }}>#{placedOrder._id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong>{placedOrder.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Destination:</span>
              <strong>{placedOrder.shippingAddress.city}, Pakistan</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
              <span style={{ fontWeight: 800 }}>Total in PKR:</span>
              <span className="price-pkr" style={{ fontSize: '1.2rem' }}>
                <span className="price-currency">₨</span>
                {new Intl.NumberFormat('en-PK').format(placedOrder.totalPrice)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/orders"
              className="btn btn-secondary btn-lg"
              style={{ flex: 1, borderRadius: 'var(--radius-lg)' }}
            >
              Track Order Status
            </Link>
            <Link
              to="/shop"
              className="btn btn-primary btn-lg"
              style={{ flex: 1, borderRadius: 'var(--radius-lg)' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary">Go to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/cart')}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={16} /> Return to Cart
          </button>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
            Checkout & Shipping in Pakistan
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Fast delivery with Cash on Delivery or Bank Transfer.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }} className="checkout-layout">
            {/* Left Column: Shipping & Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Customer Contact */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={18} color="var(--primary)" /> 1. Contact Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hamza Khan"
                      value={formData.customerName}
                      onChange={e => handleInputChange('customerName', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Phone Number (Pakistan WhatsApp/Mobile) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300 1234567"
                      value={formData.customerPhone}
                      onChange={e => handleInputChange('customerPhone', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Email Address (For Order Updates)</label>
                    <input
                      type="email"
                      placeholder="e.g. hamza@example.com"
                      value={formData.customerEmail}
                      onChange={e => handleInputChange('customerEmail', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address in Pakistan */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={18} color="var(--primary)" /> 2. Delivery Address
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Street Address & House/Flat # *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House # 45, Street 12, Block 6, PECHS"
                      value={formData.address}
                      onChange={e => handleInputChange('address', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="input-label">City in Pakistan *</label>
                      <select
                        value={formData.city}
                        onChange={e => handleInputChange('city', e.target.value)}
                        className="form-select"
                      >
                        {pakistanCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Postal / Zip Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 75400"
                        value={formData.postalCode}
                        onChange={e => handleInputChange('postalCode', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Delivery Notes / Landmarks (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Main Market, Call before arrival"
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--primary)" /> 3. Payment Method in Pakistan
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: formData.paymentMethod === 'Cash on Delivery' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.paymentMethod === 'Cash on Delivery' ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={() => handleInputChange('paymentMethod', 'Cash on Delivery')}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay in PKR cash to the rider upon parcel arrival at your doorstep.</div>
                    </div>
                    <span className="badge badge-success">POPULAR</span>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: formData.paymentMethod === 'Bank Transfer' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.paymentMethod === 'Bank Transfer' ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Bank Transfer"
                      checked={formData.paymentMethod === 'Bank Transfer'}
                      onChange={() => handleInputChange('paymentMethod', 'Bank Transfer')}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Direct Bank Transfer (IBFT)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meezan Bank / HBL / Bank Alfalah account transfer.</div>
                    </div>
                  </label>

                  {/* EasyPaisa / JazzCash */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: formData.paymentMethod === 'EasyPaisa / JazzCash' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.paymentMethod === 'EasyPaisa / JazzCash' ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EasyPaisa / JazzCash"
                      checked={formData.paymentMethod === 'EasyPaisa / JazzCash'}
                      onChange={() => handleInputChange('paymentMethod', 'EasyPaisa / JazzCash')}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>EasyPaisa / JazzCash Mobile Wallet</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant mobile account digital transfer.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review */}
            <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Your Order Items ({items.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                {items.map(item => (
                  <div key={item.product._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', background: 'var(--bg-tertiary)', padding: '2px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatPKR(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatPKR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Courier Delivery (Pakistan)</span>
                  <span style={{ fontWeight: 700, color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {shipping === 0 ? 'FREE' : formatPKR(shipping)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.3rem', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total in PKR</span>
                  <span className="price-pkr" style={{ fontSize: '1.5rem' }}>
                    <span className="price-currency">₨</span>
                    {new Intl.NumberFormat('en-PK').format(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
              >
                {loading ? 'Processing Order...' : `Confirm & Place Order (${formatPKR(totalPrice)})`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="var(--success)" />
                <span>100% Secure Checkout Guaranteed</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
