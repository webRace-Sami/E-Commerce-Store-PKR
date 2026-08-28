import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { formatPKR, calculateSavings } from '../../utils/currency';
import { StockBadge } from '../common/StockBadge';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const savings = calculateSavings(product.price, product.originalPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)'
      }}
    >
      {/* Top badges (Offer Tag / Discount %) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {product.offerTag && (
          <span className="badge badge-sale" style={{ fontSize: '0.7rem' }}>
            {product.offerTag}
          </span>
        )}
        {savings && (
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
            -{savings.percentage}% OFF
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease'
        }}
        aria-label="Save to Wishlist"
      >
        <Heart
          size={18}
          color={isWishlisted ? '#ef4444' : 'var(--text-primary)'}
          fill={isWishlisted ? '#ef4444' : 'none'}
        />
      </button>

      {/* Product Image */}
      <Link
        to={`/product/${product._id}`}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '80%', // 4:3 Aspect Ratio
          overflow: 'hidden',
          background: 'var(--bg-tertiary)',
          display: 'block'
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          className="product-card-img"
        />
      </Link>

      {/* Card Content */}
      <div
        style={{
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        <div>
          {/* Category & Stock row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem',
              gap: '0.5rem'
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {product.category}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            style={{
              fontWeight: 700,
              fontSize: '0.98rem',
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '0.4rem'
            }}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              <Star size={14} fill="#f59e0b" />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.numReviews})</span>
          </div>
        </div>

        {/* Pricing & Add to cart */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
              gap: '0.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span className="price-pkr" style={{ fontSize: '1.25rem' }}>
                <span className="price-currency">₨</span>
                {new Intl.NumberFormat('en-PK').format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="price-original">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            {savings && (
              <span className="price-saving" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                Save {savings.savingFormatted}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="btn btn-secondary btn-sm btn-icon"
                title="Quick preview"
                aria-label="Quick View"
              >
                <Eye size={16} />
              </button>
            )}

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              style={{ flex: 1, gap: '0.4rem' }}
            >
              <ShoppingBag size={16} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .card:hover .product-card-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
