import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, Printer } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatPKR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { generateReceiptPDF } from '../utils/receiptGenerator';

export const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success"><CheckCircle2 size={13} /> Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-primary"><Truck size={13} /> Shipped / In Transit</span>;
      case 'Processing':
        return <span className="badge badge-warning"><Clock size={13} /> Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-danger"><AlertCircle size={13} /> Cancelled</span>;
      case 'Pending':
      default:
        return <span className="badge badge-secondary"><Clock size={13} /> Order Received (Pending)</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <Package size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sign In to Track Orders</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Please log in to your customer account to view your past purchases and shipment statuses.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Sign In as Customer
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
            My Orders & Tracking
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track the live progress of your electronic purchases in Pakistan and print official invoices.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--text-muted)'
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You have not placed any orders yet. Check out our tech collection with Cash on Delivery!
            </p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div
                key={order._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Invoice #INV-{order._id}</span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })} • Payment: {order.paymentMethod}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                      <div className="price-pkr" style={{ fontSize: '1.3rem' }}>
                        <span className="price-currency">₨</span>
                        {new Intl.NumberFormat('en-PK').format(order.totalPrice)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => generateReceiptPDF(order)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem', borderRadius: 'var(--radius-md)' }}
                    >
                      <Printer size={14} /> Download PDF Receipt
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: 'var(--bg-tertiary)',
                          padding: '4px',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × {formatPKR(item.price)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Destination */}
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <strong>Delivery To:</strong> {order.customerName}, {order.shippingAddress.address}, {order.shippingAddress.city}, Pakistan ({order.customerPhone}) • WhatsApp Helpline: +92 300 1234567
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
