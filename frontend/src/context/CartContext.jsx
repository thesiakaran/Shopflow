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
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product) => {
    try {
      await api.post('/api/cart/add', {
        productId: product.productId || product.id,
        productName: product.productName || product.name || product.productDisplayName,
        productImage: product.productImage || product.imageUrl || `/images/${product.id}.jpg`,
        price: product.price,
        quantity: 1,
        category: product.category || 'electronics',
      });
      await fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
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
      console.error('Failed to clear cart:', err);
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
