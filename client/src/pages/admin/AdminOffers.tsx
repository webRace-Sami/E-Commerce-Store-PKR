import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, Tag, Calendar, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { Offer } from '../../types';
import { OfferModal } from '../../components/admin/OfferModal';
import { PromoBanner } from '../../components/offers/PromoBanner';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [previewOffer, setPreviewOffer] = useState<Offer | null>(null);

  const { showToast, error } = useToast();
  const { confirm } = useConfirm();

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOffers();
      if (res.success) {
        setOffers(res.offers || []);
      }
    } catch (err: any) {
      error('Failed to load offers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSaveOffer = async (offerData: any) => {
    try {
      if (editingOffer) {
        const res = await api.updateOffer(editingOffer._id, offerData);
        if (res.success) {
          showToast(`Promotional campaign updated!`, 'success');
        }
      } else {
        const res = await api.createOffer(offerData);
        if (res.success) {
          showToast(`New big promotional campaign launched!`, 'success');
        }
      }
      fetchOffers();
    } catch (err: any) {
      error(err.message || 'Operation failed');
    }
  };

  const handleDeleteOffer = async (offer: Offer) => {
    const ok = await confirm({
      title: 'Remove Offer Campaign',
      message: `Are you sure you want to delete the offer campaign "${offer.title}"?`,
      confirmText: 'Yes, Remove',
      isDangerous: true
    });

    if (ok) {
      try {
        const res = await api.deleteOffer(offer._id);
        if (res.success) {
          showToast(`Offer campaign removed`, 'info');
          fetchOffers();
        }
      } catch (err: any) {
        error(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        {/* Header */}
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
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
              Big Promotional Offers & Hero Banners
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Create eye-catching flash sales, countdown timers, and discount coupons displayed big on the homepage.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingOffer(null);
              setIsOfferModalOpen(true);
            }}
            className="btn btn-sale"
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-lg)' }}
          >
            <Plus size={18} />
            <span>Create Big Promotional Offer</span>
          </button>
        </div>

        {/* Live Preview If clicked */}
        {previewOffer && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">LIVE HOMEPAGE BANNER PREVIEW</span>
              <button onClick={() => setPreviewOffer(null)} className="btn btn-ghost btn-sm">Close Preview</button>
            </div>
            <PromoBanner offer={previewOffer} />
          </div>
        )}

        {/* Offers Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading campaigns...</div>
          ) : offers.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              <Sparkles size={36} color="var(--warning)" style={{ margin: '0 auto 1rem auto' }} />
              <h3>No Promotional Campaigns Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Launch a big flash sale banner to attract buyers across Pakistan!
              </p>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setIsOfferModalOpen(true);
                }}
                className="btn btn-primary"
              >
                Create First Big Offer
              </button>
            </div>
          ) : (
            offers.map(offer => (
              <div
                key={offer._id}
                className="card"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: offer.isActive ? '1.5px solid var(--warning)' : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Banner Thumbnail */}
                <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                  <img
                    src={offer.bannerImage}
                    alt={offer.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      gap: '0.4rem'
                    }}
                  >
                    <span className="badge badge-sale">{offer.badge}</span>
                    {offer.isActive ? (
                      <span className="badge badge-success">ACTIVE HERO</span>
                    ) : (
                      <span className="badge badge-secondary">INACTIVE</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.4rem' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                      {offer.subtitle}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                      <span className="badge badge-gold">
                        <Tag size={12} /> {offer.discountText}
                      </span>
                      {offer.discountCode && (
                        <span className="badge badge-primary">
                          Code: {offer.discountCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <button
                      onClick={() => setPreviewOffer(offer)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.82rem', gap: '0.3rem' }}
                    >
                      <Eye size={15} /> Preview
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsOfferModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer)}
                        className="btn btn-ghost btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        offer={editingOffer}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSave={handleSaveOffer}
      />
    </div>
  );
};
