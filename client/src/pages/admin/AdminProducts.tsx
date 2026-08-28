import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Sparkles, Package, Check } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { formatPKR } from '../../utils/currency';
import { StockBadge } from '../../components/common/StockBadge';
import { ProductModal } from '../../components/admin/ProductModal';
import { StockModal } from '../../components/admin/StockModal';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const { showToast, error } = useToast();
  const { confirm } = useConfirm();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err: any) {
      error('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct._id, productData);
        if (res.success) {
          showToast(`Updated "${res.product.name}" successfully!`, 'success');
        }
      } else {
        const res = await api.createProduct(productData);
        if (res.success) {
          showToast(`Published "${res.product.name}" to store catalog!`, 'success');
        }
      }
      fetchProducts();
    } catch (err: any) {
      error(err.message || 'Operation failed');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await api.updateStock(productId, newStock);
      if (res.success) {
        showToast(res.message || 'Stock updated', 'success');
        fetchProducts();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update stock');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const ok = await confirm({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${product.name}" from your catalog?`,
      confirmText: 'Yes, Delete',
      isDangerous: true
    });

    if (ok) {
      try {
        const res = await api.deleteProduct(product._id);
        if (res.success) {
          showToast(`Product "${product.name}" deleted`, 'info');
          fetchProducts();
        }
      } catch (err: any) {
        error(err.message || 'Delete failed');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

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
              Catalog & Stock Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Create products, adjust live stock units, set PKR pricing, and configure promo tags.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-lg)' }}
          >
            <Plus size={18} />
            <span>Add New Product in PKR</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter products by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Smartphones', 'Audio', 'Electronics', 'Accessories'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Product Details</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Price in PKR</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Stock Control</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Promotion</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading inventory records...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* Thumbnail & Title */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: '52px',
                              height: '52px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              background: 'var(--bg-tertiary)',
                              padding: '2px',
                              border: '1px solid var(--border-color)',
                              flexShrink: 0
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', maxWidth: '320px', lineHeight: 1.3 }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              ID: {product._id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-secondary">{product.category}</span>
                      </td>

                      {/* Price in PKR */}
                      <td style={{ padding: '1rem' }}>
                        <div className="price-pkr" style={{ fontSize: '1.05rem' }}>
                          <span className="price-currency">₨</span>
                          {new Intl.NumberFormat('en-PK').format(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {formatPKR(product.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock Control */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <StockBadge stock={product.stock} />
                          <button
                            type="button"
                            onClick={() => setStockProduct(product)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 8px', fontSize: '0.78rem' }}
                            title="Adjust inventory"
                          >
                            Edit
                          </button>
                        </div>
                      </td>

                      {/* Promotion Tag */}
                      <td style={{ padding: '1rem' }}>
                        {product.offerTag ? (
                          <span className="badge badge-sale">{product.offerTag}</span>
                        ) : product.isOffer ? (
                          <span className="badge badge-primary">On Sale</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Regular</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit product details"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="btn btn-ghost btn-danger btn-icon btn-sm"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        product={editingProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Stock Adjuster Modal */}
      <StockModal
        product={stockProduct}
        isOpen={!!stockProduct}
        onClose={() => setStockProduct(null)}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
};
