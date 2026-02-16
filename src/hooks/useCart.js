import { useState, useMemo, useCallback } from 'react';
import { calculatePrices } from '@/utils/price';

/**
 * Cart management hook
 * @returns {Object} Cart state and methods
 */
export const useCart = () => {
  const [items, setItems] = useState([]);

  // Add item to cart
  // Uses both product.id and product.storeId to identify unique items (for multi-store mode)
  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      // Find existing item by id AND storeId (same product from same store)
      const existing = prev.find((item) => 
        item.id === product.id && item.storeId === product.storeId
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.storeId === product.storeId
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });
  }, []);

  // Helper to match item by id and storeId
  const matchItem = (item, productId, storeId) => {
    if (storeId !== undefined) {
      return item.id === productId && item.storeId === storeId;
    }
    return item.id === productId;
  };

  // Remove item from cart
  const removeItem = useCallback((productId, storeId) => {
    setItems((prev) => prev.filter((item) => !matchItem(item, productId, storeId)));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity, storeId) => {
    if (quantity <= 0) {
      removeItem(productId, storeId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        matchItem(item, productId, storeId) ? { ...item, qty: quantity } : item
      )
    );
  }, [removeItem]);

  // Increment item quantity
  const incrementItem = useCallback((productId, storeId) => {
    setItems((prev) =>
      prev.map((item) =>
        matchItem(item, productId, storeId) ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }, []);

  // Decrement item quantity
  const decrementItem = useCallback((productId, storeId) => {
    setItems((prev) => {
      const item = prev.find((i) => matchItem(i, productId, storeId));
      if (item && item.qty <= 1) {
        return prev.filter((i) => !matchItem(i, productId, storeId));
      }
      return prev.map((i) =>
        matchItem(i, productId, storeId) ? { ...i, qty: i.qty - 1 } : i
      );
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate cart stats
  const stats = useMemo(() => {
    const count = items.length;
    const totalQuantity = items.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = items.reduce((acc, item) => {
      return acc + calculatePrices(item, item.qty).totalPrice;
    }, 0);

    return {
      count,
      totalQuantity,
      totalPrice,
    };
  }, [items]);

  return {
    items,
    stats,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
  };
};
