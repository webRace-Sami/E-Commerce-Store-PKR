import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders } from 'lucide-react';
import { Offer } from '../../types';

interface OfferModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: any) => Promise<void>;
}

export const OfferModal: React.FC<OfferModalProps> = ({ offer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '⚡ FLASH SALE • UP TO 40% OFF',
    discountText: 'SAVE UP TO RS. 35,000 ON TOP TECH',
    discountCode: 'PAKTECH2026',
    bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Shop Mega Offers Now',
    buttonLink: '/shop?filter=offers',
    expiresAt: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        subtitle: offer.subtitle,
        badge: offer.badge,
        discountText: offer.discountText,
        discountCode: offer.discountCode || '',
        bannerImage: offer.bannerImage,
        buttonText: offer.buttonText,
        buttonLink: offer.buttonLink,
        expiresAt: offer.expiresAt ? new Date(offer.expiresAt).toISOString().split('T')[0] : '',
        isActive: offer.isActive
      });
    } else {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setFormData({
        title: 'Grand Pakistan Mega Electronics Gala',
        subtitle: 'Exclusive discounts on premium Flagship Smartphones, Studio Audio & Laptops in PKR.',
        badge: '⚡ FLASH SALE • UP TO 40% OFF',
        discountText: 'SAVE UP TO RS. 35,000 ON TOP TECH',
        discountCode: 'PAKTECH2026',
        bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
        buttonText: 'Shop Mega Offers Now',
        buttonLink: '/shop?filter=offers',
        expiresAt: futureDate,
        isActive: true
      });
    }
  }, [offer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '600px', padding: '1.75rem' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.15)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {offer ? 'Edit Big Promotional Banner' : 'Create Big Promotional Offer'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group">
            <label className="input-label">Offer Headline / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Pakistan Mega Electronics Gala"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Subtitle / Description</label>
            <input
              type="text"
              placeholder="e.g. Exclusive discounts on Smartphones and Studio Audio"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Badge Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. ⚡ FLASH SALE • UP TO 40% OFF"
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Discount Highlight in PKR *</label>
              <input
                type="text"
                required
                placeholder="e.g. SAVE UP TO RS. 35,000"
                value={formData.discountText}
                onChange={e => setFormData({ ...formData, discountText: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Promo / Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. PAKTECH2026"
                value={formData.discountCode}
                onChange={e => setFormData({ ...formData, discountCode: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Sale Expiry Date</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Banner Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.bannerImage}
              onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Button Text</label>
              <input
                type="text"
                placeholder="e.g. Shop Mega Offers Now"
                value={formData.buttonText}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Button Link</label>
              <input
                type="text"
                placeholder="e.g. /shop?filter=offers"
                value={formData.buttonLink}
                onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Active on Homepage Hero</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : offer ? 'Update Offer' : 'Publish Big Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
