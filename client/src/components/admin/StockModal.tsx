import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';

interface StockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number) => Promise<void>;
}

export const StockModal: React.FC<StockModalProps> = ({ product, isOpen, onClose, onUpdateStock }) => {
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setStock(product.stock);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateStock(product._id, stock);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px', padding: '1.5rem' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Adjust Inventory Stock</h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{product.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Stock: {product.stock} units</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">New Stock Quantity (Units)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setStock(Math.max(0, stock - 1))}
                className="btn btn-secondary btn-icon"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={e => setStock(Math.max(0, Number(e.target.value)))}
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 800 }}
              />
              <button
                type="button"
                onClick={() => setStock(stock + 1)}
                className="btn btn-secondary btn-icon"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setStock(stock + 10)}
              className="btn btn-secondary btn-sm"
            >
              +10 Restock
            </button>
            <button
              type="button"
              onClick={() => setStock(stock + 50)}
              className="btn btn-secondary btn-sm"
            >
              +50 Restock
            </button>
            <button
              type="button"
              onClick={() => setStock(0)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              Mark Out of Stock
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Updating...' : 'Save Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
