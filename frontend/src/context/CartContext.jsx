import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!token) { setCartItems([]); setCartCount(0); return; }
    try {
      setLoading(true);
      const res = await api.get('/api/cart');
      setCartItems(res.data);
      const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      // Mock Fallback
      const mockCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      setCartItems(mockCart);
      setCartCount(mockCart.reduce((sum, item) => sum + item.quantity, 0));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product) => {
    const newItem = {
      productId: product.productId || product.id,
      productName: product.productName || product.name || product.productDisplayName,
      productImage: product.productImage || product.imageUrl || `/images/${product.id}.jpg`,
      price: product.price,
      quantity: 1,
      category: product.category || 'electronics',
      id: Date.now() // mock id
    };
    try {
      await api.post('/api/cart/add', newItem);
      await fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      // Mock Fallback
      const mockCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      const existing = mockCart.find(i => i.productId === newItem.productId);
      if (existing) { existing.quantity += 1; } else { mockCart.push(newItem); }
      localStorage.setItem('mockCart', JSON.stringify(mockCart));
      await fetchCart();
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      // Mock Fallback
      let mockCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      mockCart = mockCart.map(item => item.id === cartItemId ? { ...item, quantity } : item);
      localStorage.setItem('mockCart', JSON.stringify(mockCart));
      await fetchCart();
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      // Mock Fallback
      let mockCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      mockCart = mockCart.filter(item => item.id !== cartItemId);
      localStorage.setItem('mockCart', JSON.stringify(mockCart));
      await fetchCart();
    }
  };

  const clearCart = async (localOnly = false) => {
    if (localOnly) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      await api.delete('/api/cart/clear');
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      // Mock Fallback
      localStorage.removeItem('mockCart');
      setCartItems([]);
      setCartCount(0);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, isCartOpen, addToCart, updateQuantity, removeItem, clearCart, openCart, closeCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
