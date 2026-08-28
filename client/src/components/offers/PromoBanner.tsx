import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, Copy, Check, Tag } from 'lucide-react';
import { Offer } from '../../types';
import { useToast } from '../../context/ToastContext';

interface PromoBannerProps {
  offer: Offer;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ offer }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(offer.expiresAt).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [offer.expiresAt]);

  const copyPromoCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (offer.discountCode) {
      navigator.clipboard.writeText(offer.discountCode);
      setCopied(true);
      showToast(`Promo Code "${offer.discountCode}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #090d16 0%, #151c33 50%, #201335 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: 'var(--shadow-xl)',
        margin: '1.5rem 0 2.5rem 0'
      }}
    >
      {/* Background Decorative Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${offer.bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          filter: 'blur(2px)'
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '2.5rem 1.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        {/* Left column: Badge, Title, Discount text, Countdown */}
        <div>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <span className="badge badge-sale" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>
              <Sparkles size={14} /> {offer.badge}
            </span>
          </div>

          {/* Big Offer Title */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}
          >
            {offer.title}
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '1.25rem',
              lineHeight: 1.5,
              maxWidth: '520px'
            }}
          >
            {offer.subtitle}
          </p>

          {/* Big Discount Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1.5px solid #f97316',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <Tag size={18} color="#fb923c" />
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fb923c', letterSpacing: '0.02em' }}>
              {offer.discountText}
            </span>
          </div>

          {/* Countdown Clock */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', fontWeight: 600 }}>
              <Clock size={15} /> SALE ENDS IN:
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds }
              ].map(t => (
                <div
                  key={t.label}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 0.75rem',
                    textAlign: 'center',
                    minWidth: '58px'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>
                    {String(t.value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions & Promo Code */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              to={offer.buttonLink || '/shop?filter=offers'}
              className="btn btn-sale btn-lg"
              style={{ borderRadius: 'var(--radius-full)', fontWeight: 700 }}
            >
              <span>{offer.buttonText || 'Shop Offer Now'}</span>
              <ArrowRight size={18} />
            </Link>

            {offer.discountCode && (
              <button
                type="button"
                onClick={copyPromoCode}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1.5px dashed rgba(255, 255, 255, 0.35)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.7rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Code: {offer.discountCode}</span>
                {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Right column: High-impact hero image showcase */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <img
              src={offer.bannerImage}
              alt={offer.title}
              style={{ width: '100%', height: '320px', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}
            >
              <div>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>EXCLUSIVE IN PAKISTAN</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>All Prices in PKR (₨)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
