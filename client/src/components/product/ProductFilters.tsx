import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { formatPKR } from '../../utils/currency';

interface FilterProps {
  categories: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  offersOnly: boolean;
  onToggleOffers: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  offersOnly,
  onToggleOffers,
  sortBy,
  onSortChange,
  onReset
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {/* Header & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem' }}>
          <Filter size={18} color="var(--primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="input-group">
        <label className="input-label">Sort Products</label>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="form-select"
          style={{ fontSize: '0.88rem' }}
        >
          <option value="newest">✨ Newest Arrivals</option>
          <option value="price-asc">₨ Price: Low to High</option>
          <option value="price-desc">₨ Price: High to Low</option>
          <option value="rating">⭐ Customer Rating</option>
        </select>
      </div>

      {/* Special Offer / In-Stock Quick Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem',
            background: offersOnly ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-tertiary)',
            border: offersOnly ? '1px solid var(--warning)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="checkbox"
            checked={offersOnly}
            onChange={e => onToggleOffers(e.target.checked)}
            style={{ accentColor: 'var(--warning)', width: '16px', height: '16px' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: offersOnly ? 'var(--warning)' : 'var(--text-primary)' }}>
            <Sparkles size={16} /> Flash Sale & Mega Deals Only
          </span>
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem',
            background: inStockOnly ? 'var(--success-bg)' : 'var(--bg-tertiary)',
            border: inStockOnly ? '1px solid var(--success)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => onToggleInStock(e.target.checked)}
            style={{ accentColor: 'var(--success)', width: '16px', height: '16px' }}
          />
          <span style={{ color: inStockOnly ? 'var(--success)' : 'var(--text-primary)' }}>
            In-Stock Items Only
          </span>
        </label>
      </div>

      {/* Category List */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              justifyContent: 'space-between',
              fontSize: '0.88rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span>All Catalog</span>
            {selectedCategory === 'All' && <Check size={16} />}
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    opacity: isSelected ? 1 : 0.6,
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
                    padding: '1px 6px',
                    borderRadius: '999px'
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter (PKR) */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
          Price Range in PKR
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={e => onPriceChange(Number(e.target.value) || 0, maxPrice)}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={e => onPriceChange(minPrice, Number(e.target.value) || 500000)}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
          />
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Showing {formatPKR(minPrice)} to {formatPKR(maxPrice)}
        </div>
      </div>
    </div>
  );
};
