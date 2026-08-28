import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertCircle, Phone, MapPin, Search } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { formatPKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { showToast, error } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err: any) {
      error('Failed to load orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order #${orderId} marked as "${newStatus}"`, 'success');
        fetchOrders();
      }
    } catch (err: any) {
      error(err.message || 'Status update failed');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
            Customer Orders & Fulfillment
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Update courier statuses (Pending → Processing → Shipped → Delivered) and review PKR payments.
          </p>
        </div>

        {/* Filter Controls */}
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by order ID, name, phone, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>No matching orders found</h3>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                        #{order._id}
                      </span>
                      <span className="badge badge-secondary">{order.paymentMethod}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Placed on {new Date(order.createdAt).toLocaleString('en-PK')}
                    </div>
                  </div>

                  {/* Status update selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className="form-select"
                      style={{
                        width: 'auto',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        borderColor: order.orderStatus === 'Delivered' ? 'var(--success)' : order.orderStatus === 'Shipped' ? 'var(--primary)' : 'var(--warning)'
                      }}
                    >
                      <option value="Pending">🕒 Pending</option>
                      <option value="Processing">⚙️ Processing</option>
                      <option value="Shipped">🚚 Shipped (In Transit)</option>
                      <option value="Delivered">✅ Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Body info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                  {/* Customer Info */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Customer & Shipping Details
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <Phone size={14} /> {order.customerPhone}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <MapPin size={14} style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span>{order.shippingAddress.address}, {order.shippingAddress.city}, Pakistan</span>
                    </div>
                    {order.shippingAddress.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.3rem' }}>
                        Note: {order.shippingAddress.notes}
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Ordered Products ({order.orderItems.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span style={{ fontWeight: 700 }}>{formatPKR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Row */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Order Total (PKR)</span>
                  <span className="price-pkr" style={{ fontSize: '1.3rem' }}>
                    <span className="price-currency">₨</span>
                    {new Intl.NumberFormat('en-PK').format(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
