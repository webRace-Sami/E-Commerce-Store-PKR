import React, { useState, useEffect } from 'react';
import { Settings, Save, Phone, Mail, Truck, Percent, Building, Store, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { formatPKR } from '../../utils/currency';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, loading, refreshSettings } = useSettings();
  const { showToast, error } = useToast();

  const [formData, setFormData] = useState({
    storeName: settings.storeName || 'SM*Store',
    adminEmail: settings.adminEmail || 'samiullahnawaz942@gmail.com',
    phone: settings.phone || '+92 300 1234567',
    shippingFee: settings.shippingFee !== undefined ? settings.shippingFee : 350,
    freeShippingThreshold: settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 50000,
    taxRate: settings.taxRate !== undefined ? settings.taxRate : 0,
    currency: settings.currency || 'PKR',
    address: settings.address || 'Karachi, Pakistan'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      storeName: settings.storeName || 'SM*Store',
      adminEmail: settings.adminEmail || 'samiullahnawaz942@gmail.com',
      phone: settings.phone || '+92 300 1234567',
      shippingFee: settings.shippingFee !== undefined ? settings.shippingFee : 350,
      freeShippingThreshold: settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 50000,
      taxRate: settings.taxRate !== undefined ? settings.taxRate : 0,
      currency: settings.currency || 'PKR',
      address: settings.address || 'Karachi, Pakistan'
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const ok = await updateSettings({
        storeName: formData.storeName,
        adminEmail: formData.adminEmail,
        phone: formData.phone,
        shippingFee: Number(formData.shippingFee),
        freeShippingThreshold: Number(formData.freeShippingThreshold),
        taxRate: Number(formData.taxRate),
        currency: formData.currency,
        address: formData.address
      });

      if (ok) {
        showToast('Store settings & rates updated successfully across system!', 'success');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (err: any) {
      error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Settings size={28} color="var(--primary)" /> Store Configuration & System Settings
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Manage admin email, WhatsApp customer helpline, courier fees, and sales tax. Changes update everywhere including receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshSettings}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-md)', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Refresh Live Data
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Box 1: Store Contact & Identification */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={20} color="var(--primary)" /> Brand & Helpline Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="input-group">
                  <label className="input-label">Official Store Name</label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                    className="form-input"
                    placeholder="SM*Store"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="form-input"
                    placeholder="samiullahnawaz942@gmail.com"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Used for admin sign in, notifications, and customer inquiry receipts.
                  </span>
                </div>

                <div className="input-group">
                  <label className="input-label">WhatsApp Helpline / Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="+92 300 1234567"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Printed on official PDF receipts, top navigation, and website footer.
                  </span>
                </div>

                <div className="input-group">
                  <label className="input-label">Dispatch Office Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="form-input"
                    placeholder="PECHS, Karachi, Pakistan"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Courier & Sales Tax Rate */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--primary)" /> Courier & Tax Rates
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="input-group">
                  <label className="input-label">Standard Courier / Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={formData.shippingFee}
                    onChange={e => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Current Courier Price: <strong>{formatPKR(formData.shippingFee)}</strong> (Added automatically to orders and receipts).
                  </span>
                </div>

                <div className="input-group">
                  <label className="input-label">Free Delivery Minimum Order (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={formData.freeShippingThreshold}
                    onChange={e => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Orders equal to or above <strong>{formatPKR(formData.freeShippingThreshold)}</strong> get FREE nationwide shipping.
                  </span>
                </div>

                <div className="input-group">
                  <label className="input-label">GST / Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    value={formData.taxRate}
                    onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Current Tax: <strong>{formData.taxRate}%</strong> (Calculated on subtotal and printed on PDF receipts).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Action Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Save & Apply Settings</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Persistent in MongoDB Atlas and backup storage across all system reloads.
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: 'var(--radius-lg)', gap: '0.5rem', padding: '0.8rem 2rem' }}
            >
              <Save size={18} />
              {saving ? 'Saving to Database...' : 'Save & Publish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
