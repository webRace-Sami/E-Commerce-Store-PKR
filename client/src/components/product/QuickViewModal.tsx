import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, CheckCircle2, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPKR, calculateSavings } from '../../utils/currency';
import { StockBadge } from '../common/StockBadge';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const savings = calculateSavings(product.price, product.originalPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (addToCart(product, quantity)) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '780px',
          padding: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left column: Image Gallery */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '85%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '1rem'
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedImage === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                    padding: '2px'
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Details & Purchase */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            style={{ position: 'absolute', top: '12px', right: '12px' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div>
            {/* Category & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <StockBadge stock={product.stock} />
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.25rem', lineHeight: 1.3, marginBottom: '0.5rem', paddingRight: '2rem' }}>
              {product.name}
            </h3>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
              </div>
              <span style={{ fontWeight: 700 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.numReviews} Verified Reviews)</span>
            </div>

            {/* Price Box (PKR) */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <span className="price-pkr" style={{ fontSize: '1.6rem' }}>
                  <span className="price-currency">₨</span>
                  {new Intl.NumberFormat('en-PK').format(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
              </div>
              {savings && (
                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', marginTop: '2px' }}>
                  You save {savings.savingFormatted} ({savings.percentage}% off)
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {product.description}
            </p>

            {/* Badges list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={15} color="var(--primary)" />
                <span>Cash on Delivery Available Across Pakistan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} color="var(--success)" />
                <span>100% Genuine with Official Warranty</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    height: '44px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0 12px', height: '100%', color: 'var(--text-secondary)' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 800, padding: '0 10px', fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '0 12px', height: '100%', color: 'var(--text-secondary)' }}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
                style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)' }}
              >
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className="btn btn-secondary btn-icon"
                style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)' }}
              >
                <Heart size={20} color={isWishlisted ? '#ef4444' : 'var(--text-primary)'} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

            <Link
              to={`/product/${product._id}`}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textAlign: 'center'
              }}
            >
              <span>View Full Specifications & Warranty</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
