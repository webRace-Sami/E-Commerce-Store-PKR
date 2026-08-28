import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';
import { useSettings } from './SettingsContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sm_cart') || localStorage.getItem('apex_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sm_wishlist') || localStorage.getItem('apex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { showToast, warning } = useToast();

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number = 1): boolean => {
    if (product.stock <= 0) {
      warning(`Sorry, "${product.name}" is currently out of stock!`);
      return false;
    }

    let added = false;
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product._id === product._id);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;

        if (newQty > product.stock) {
          warning(`Only ${product.stock} units available in stock for this item.`);
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: newQty };
        added = true;
        return updated;
      } else {
        if (quantity > product.stock) {
          warning(`Only ${product.stock} units available in stock.`);
          return prev;
        }
        added = true;
        return [...prev, { product, quantity }];
      }
    });

    if (added) {
      showToast(`Added "${product.name}" to cart!`, 'success', 'Cart Updated');
    }
    return added;
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product._id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev => {
      return prev.map(item => {
        if (item.product._id === productId) {
          if (quantity > item.product.stock) {
            warning(`Only ${item.product.stock} units available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < (settings.freeShippingThreshold || 50000) ? (settings.shippingFee || 350) : 0;
  const tax = subtotal > 0 && settings.taxRate > 0 ? Math.round((subtotal * settings.taxRate) / 100) : 0;
  const totalPrice = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        tax,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
