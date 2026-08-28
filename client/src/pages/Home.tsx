import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Smartphone,
  Headphones,
  Laptop,
  Watch,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Offer } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { PromoBanner } from '../components/offers/PromoBanner';
import { QuickViewModal } from '../components/product/QuickViewModal';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [offersRes, prodRes, catRes] = await Promise.all([
          api.getActiveOffers(),
          api.getProducts(),
          api.getCategories()
        ]);

        if (offersRes.success) setOffers(offersRes.offers || []);
        if (catRes.success) setCategories(catRes.categories || []);

        if (prodRes.success && prodRes.products) {
          const prods: Product[] = prodRes.products;
          setFeaturedProducts(prods.filter(p => p.isFeatured));
          setDealProducts(prods.filter(p => p.isOffer || (p.discountPercentage && p.discountPercentage > 0)));
        }
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryIcons: Record<string, any> = {
    'Smartphones': <Smartphone size={22} />,
    'Audio': <Headphones size={22} />,
    'Electronics': <Laptop size={22} />,
    'Accessories': <Watch size={22} />
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div className="max-w-7xl">
        {/* Big Promotional Hero Banner */}
        {offers.length > 0 && <PromoBanner offer={offers[0]} />}

        {/* Category Fast Navigation */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Explore Categories</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Find authentic electronics with official warranty</p>
            </div>
            <Link to="/shop" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem'
            }}
          >
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="glass-card"
                style={{
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.6rem',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {categoryIcons[cat.name] || <Sparkles size={22} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Hot Flash Deals Section */}
        {dealProducts.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span className="badge badge-sale">
                    <Sparkles size={13} /> SPECIAL PROMOTIONS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>⚡ Hot Deals in PKR</h3>
              </div>
              <Link
                to="/shop?filter=offers"
                className="btn btn-outline btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                See All Offers
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {dealProducts.slice(0, 4).map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={p => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Flagship Catalog */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span className="badge badge-primary">
                  <TrendingUp size={13} /> TOP PICKS
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Featured Tech & Gadgets</h3>
            </div>
            <Link to="/shop" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
              Browse Full Catalog
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {(featuredProducts.length > 0 ? featuredProducts : dealProducts).slice(0, 8).map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={p => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* Secondary Promo Banner if available */}
        {offers.length > 1 && <PromoBanner offer={offers[1]} />}

        {/* Why Choose ApexStore Pakistan */}
        <section
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 1.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
            background: 'var(--bg-card)'
          }}
        >
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Why Pakistan Shoppers Trust ApexStore
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Guaranteed PTA approved smartphones, sealed studio headphones, and computer accessories with transparent PKR pricing and nationwide Cash on Delivery.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              textAlign: 'left'
            }}
          >
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ color: 'var(--success)', marginBottom: '0.75rem' }}><ShieldCheck size={28} /></div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>100% Genuine Box-Packed</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Directly sourced from authorized brand distributors with verified warranty cards.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}><Truck size={28} /></div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Express Nationwide COD</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Fast 2-4 business day delivery to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, and all Pakistan.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ color: 'var(--warning)', marginBottom: '0.75rem' }}><RotateCcw size={28} /></div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>7-Day Peace of Mind</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Instant replacement support if any manufacturing defect is discovered in your device.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
