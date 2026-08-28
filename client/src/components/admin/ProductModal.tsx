import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  product: Product | null; // null for creating new
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Smartphones',
    stock: '',
    images: [''],
    isFeatured: false,
    isOffer: false,
    offerTag: '',
    specifications: [] as Array<{ key: string; value: string }>
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const specs = Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value }));
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        category: product.category,
        stock: String(product.stock),
        images: product.images.length > 0 ? product.images : [''],
        isFeatured: product.isFeatured,
        isOffer: product.isOffer,
        offerTag: product.offerTag || '',
        specifications: specs.length > 0 ? specs : [{ key: 'Warranty', value: '1 Year Official' }]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Smartphones',
        stock: '10',
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
        isFeatured: false,
        isOffer: false,
        offerTag: '',
        specifications: [
          { key: 'Warranty', value: '1 Year Official Warranty' },
          { key: 'Condition', value: 'Brand New (Box Packed)' }
        ]
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated.length > 0 ? updated : [''] });
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formData.specifications];
    updated[index][field] = val;
    setFormData({ ...formData, specifications: updated });
  };

  const addSpecField = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };

  const removeSpecField = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specsObj: Record<string, string> = {};
    formData.specifications.forEach(s => {
      if (s.key.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      stock: Number(formData.stock),
      images: formData.images.filter(img => img.trim() !== ''),
      isFeatured: formData.isFeatured,
      isOffer: formData.isOffer,
      offerTag: formData.offerTag,
      specifications: specsObj
    };

    try {
      await onSave(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Smartphones', 'Audio', 'Electronics', 'Accessories', 'Fashion', 'Home & Living'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', padding: '1.75rem' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Package size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {product ? 'Edit Product & Stock' : 'Add New Product in PKR'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Product Name */}
          <div className="input-group">
            <label className="input-label">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Pricing Row in PKR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Sale Price in PKR (₨) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 48500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Original Price in PKR (₨) (Optional)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 55000"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Available Stock (Units) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 15"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Category & Offer Tag */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Offer Tag / Sale Label</label>
              <input
                type="text"
                placeholder="e.g. MEGA DEAL, 40% OFF, FLASH SALE"
                value={formData.offerTag}
                onChange={e => setFormData({ ...formData, offerTag: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isOffer}
                onChange={e => setFormData({ ...formData, isOffer: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--warning)' }}
              />
              <span>Mark as Special Offer / Deal</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Product Description</label>
            <textarea
              rows={3}
              placeholder="Describe key features, warranty, box contents..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          {/* Image URLs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">Image URLs</label>
              <button type="button" onClick={addImageField} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
                <Plus size={14} /> Add Image
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                    className="form-input"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="btn btn-ghost btn-danger btn-icon"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">Technical Specifications</label>
              <button type="button" onClick={addSpecField} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
                <Plus size={14} /> Add Specification
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.specifications.map((spec, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Feature (e.g. Battery Life)"
                    value={spec.key}
                    onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 30 Hours)"
                    value={spec.value}
                    onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                    className="form-input"
                    style={{ flex: 1.5 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecField(idx)}
                    className="btn btn-ghost btn-danger btn-icon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : product ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
