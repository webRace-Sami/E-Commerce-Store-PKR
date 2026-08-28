import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { formatPKR, calculateSavings } from '../utils/currency';
import { StockBadge } from '../components/common/StockBadge';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, openCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage(0);
          setQuantity(1);
        } else {
          showToast('Product not found in catalog', 'error');
          navigate('/shop');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        showToast('Error loading product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading product specifications...</div>
      </div>
    );
  }

  if (!product) return null;

  const savings = calculateSavings(product.price, product.originalPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (addToCart(product, quantity)) {
      // Optional auto open cart
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on SM*Store Pakistan for ${formatPKR(product.price)}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        {/* Back breadcrumb */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Shopping</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>

        {/* Main Product Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
            marginBottom: '3.5rem'
          }}
        >
          {/* Product Image Gallery */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '85%',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-md)'
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
                  padding: '1.5rem'
                }}
              />
              {product.offerTag && (
                <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <Sparkles size={13} /> {product.offerTag}
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedImage === idx ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                      overflow: 'hidden',
                      background: 'var(--bg-card)',
                      padding: '4px',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Info */}
          <div>
            {/* Category & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <StockBadge stock={product.stock} />
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Reviews summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} fill="#f59e0b" />
                ))}
              </div>
              <span style={{ fontWeight: 800 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.numReviews} Customer Reviews in Pakistan)</span>
            </div>

            {/* Price Box in PKR */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                border: '1.5px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="price-pkr" style={{ fontSize: '2rem' }}>
                  <span className="price-currency">₨</span>
                  {new Intl.NumberFormat('en-PK').format(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="price-original" style={{ fontSize: '1.25rem' }}>
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
                {savings && (
                  <span className="badge badge-sale" style={{ fontSize: '0.8rem' }}>
                    {savings.percentage}% OFF
                  </span>
                )}
              </div>

              {savings && (
                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  Instant Discount: Save {savings.savingFormatted} on this device!
                </div>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Includes all applicable taxes & official PTA regulatory approval (where applicable).
              </div>
            </div>

            {/* Product Description */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Overview</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {product.description}
              </p>
            </div>

            {/* Purchase Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Quantity */}
                {!isOutOfStock && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      height: '48px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '0 14px', height: '100%', color: 'var(--text-secondary)' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, padding: '0 12px', fontSize: '1.05rem' }}>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{ padding: '0 14px', height: '100%', color: 'var(--text-secondary)' }}
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add to cart */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  <ShoppingBag size={20} />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product._id)}
                  className="btn btn-secondary btn-icon btn-lg"
                  title="Add to wishlist"
                >
                  <Heart size={22} color={isWishlisted ? '#ef4444' : 'var(--text-primary)'} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={() => {
                    if (addToCart(product, quantity)) {
                      openCart();
                    }
                  }}
                  className="btn btn-sale btn-lg"
                  style={{ width: '100%' }}
                >
                  Buy Now with Cash on Delivery
                </button>
              )}
            </div>

            {/* Pakistan Customer Perks */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.85rem',
                background: 'var(--bg-tertiary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Truck size={18} color="var(--primary)" />
                <span>Nationwide COD</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} color="var(--success)" />
                <span>Official Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <RotateCcw size={18} color="var(--warning)" />
                <span>7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <section
          className="card"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Layers size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Technical Specifications
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.88rem' }}>{key}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
