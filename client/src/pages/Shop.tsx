import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageX, Sparkles, Heart } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { useCart } from '../context/CartContext';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const isOfferFilter = searchParams.get('filter') === 'offers';
  const isWishlistFilter = searchParams.get('filter') === 'wishlist';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [offersOnly, setOffersOnly] = useState<boolean>(isOfferFilter);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    setLocalSearch(searchQuery);
    setOffersOnly(isOfferFilter);
  }, [searchQuery, isOfferFilter]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};

        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (minPrice > 0) params.minPrice = String(minPrice);
        if (maxPrice < 500000) params.maxPrice = String(maxPrice);
        if (inStockOnly) params.inStock = 'true';
        if (offersOnly) params.isOffer = 'true';
        if (sortBy) params.sort = sortBy;

        const res = await api.getProducts(params);
        if (res.success) {
          let list: Product[] = res.products || [];
          if (isWishlistFilter) {
            list = list.filter(p => wishlist.includes(p._id));
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly, offersOnly, sortBy, isWishlistFilter, wishlist]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      newParams.set('search', localSearch.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(500000);
    setInStockOnly(false);
    setOffersOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <div className="max-w-7xl">
        {/* Page Title & Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
                {isWishlistFilter ? 'My Saved Wishlist' : isOfferFilter ? '⚡ Flash Sale & Mega Deals' : 'Product Catalog in PKR'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {loading ? 'Updating catalog...' : `Showing ${products.length} verified electronic devices & accessories`}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn btn-secondary mobile-filter-btn"
              style={{ display: 'none', gap: '0.4rem' }}
            >
              <SlidersHorizontal size={18} />
              <span>Filters & Sort</span>
            </button>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: '600px' }}>
            <Search
              size={20}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by name, brand, model or specifications in PKR..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '48px',
                paddingRight: '100px',
                borderRadius: 'var(--radius-full)',
                height: '48px',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '4px',
                top: '4px',
                bottom: '4px',
                borderRadius: 'var(--radius-full)',
                padding: '0 1.25rem'
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Catalog Grid Layout (Sidebar Filters + Products Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="desktop-filters">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              offersOnly={offersOnly}
              onToggleOffers={setOffersOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Products Grid */}
          <main>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="card" style={{ height: '360px', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--text-muted)'
                  }}
                >
                  <PackageX size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Matching Tech Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  We couldn't find any products matching your active filters. Try adjusting price range or searching different keywords.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={p => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer Modal */}
        {isMobileFilterOpen && (
          <div className="modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
            <div
              className="modal-content"
              style={{
                maxWidth: '380px',
                padding: '1.25rem',
                margin: 'auto 0 0 0',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                maxHeight: '85vh'
              }}
              onClick={e => e.stopPropagation()}
            >
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={cat => {
                  handleCategorySelect(cat);
                  setIsMobileFilterOpen(false);
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                offersOnly={offersOnly}
                onToggleOffers={setOffersOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onReset={handleResetFilters}
              />
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Apply Filters & View ({products.length})
              </button>
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
