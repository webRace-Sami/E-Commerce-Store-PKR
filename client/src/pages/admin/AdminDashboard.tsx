import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminStats, Product } from '../../types';
import { formatPKR } from '../../utils/currency';
import { StockModal } from '../../components/admin/StockModal';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await api.updateStock(productId, newStock);
      if (res.success) {
        showToast(res.message || 'Stock updated successfully', 'success');
        fetchStats();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading administrator analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-gold">
                <Shield size={13} /> ADMIN CONTROL PANEL
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
              Store Operations Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Real-time revenue in PKR, stock controls, and promotional campaigns.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link to="/admin/products" className="btn btn-primary btn-sm">
              <Plus size={16} /> Manage Products & Stock
            </Link>
            <Link to="/admin/offers" className="btn btn-sale btn-sm">
              <Sparkles size={16} /> Big Offers & Promos
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              <ShoppingBag size={16} /> Fulfillment Orders
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Card 1: Total Revenue in PKR */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL REVENUE (PKR)</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DollarSign size={20} />
              </div>
            </div>
            <div className="price-pkr" style={{ fontSize: '1.75rem' }}>
              <span className="price-currency">₨</span>
              {new Intl.NumberFormat('en-PK').format(stats?.totalRevenue || 0)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.35rem' }}>
              Total confirmed customer orders
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL ORDERS</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.totalOrders || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {stats?.pendingOrders || 0} Pending • {stats?.deliveredOrders || 0} Delivered
            </div>
          </div>

          {/* Card 3: Active Catalog */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATALOG ITEMS</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--info-bg)',
                  color: 'var(--info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.totalProducts || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Across 5 Major Electronic Categories
            </div>
          </div>

          {/* Card 4: Low Stock Alerts */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>LOW STOCK WARNINGS</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: (stats?.lowStockCount || 0) > 0 ? 'var(--warning-bg)' : 'var(--success-bg)',
                  color: (stats?.lowStockCount || 0) > 0 ? 'var(--warning)' : 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: (stats?.lowStockCount || 0) > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
              {stats?.lowStockCount || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {stats?.outOfStockCount || 0} items completely out of stock
            </div>
          </div>
        </div>

        {/* Low Stock Warning Section */}
        {(stats?.lowStockItems && stats.lowStockItems.length > 0) && (
          <section className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem', border: '1.5px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={22} color="var(--warning)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Low Stock Inventory Alerts (≤ 5 units remaining)
                </h3>
              </div>
              <span className="badge badge-warning">{stats.lowStockItems.length} Products</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {stats.lowStockItems.map(item => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Category: {item.category} • Price: {formatPKR(item.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const dummyProduct: any = { _id: item._id, name: item.name, stock: item.stock, images: [''] };
                      setSelectedStockProduct(dummyProduct);
                    }}
                    className="btn btn-warning btn-sm"
                    style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning)' }}
                  >
                    Restock ({item.stock} left)
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Orders Overview */}
        <section className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              <span>View All Orders</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Destination</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total in PKR</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700 }}>#{order._id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{order.shippingAddress.city}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{formatPKR(order.totalPrice)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : order.orderStatus === 'Shipped' ? 'badge-primary' : 'badge-warning'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Stock adjustment modal */}
      <StockModal
        product={selectedStockProduct}
        isOpen={!!selectedStockProduct}
        onClose={() => setSelectedStockProduct(null)}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
};
