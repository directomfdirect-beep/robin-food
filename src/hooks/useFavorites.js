import { useState, useCallback } from 'react';

/**
 * Favorites management hook
 * @param {Array} initialFavorites - Initial favorite IDs
 * @returns {Object} Favorites state and methods
 */
export const useFavorites = (initialFavorites = []) => {
  const [favorites, setFavorites] = useState(initialFavorites);

  // Toggle favorite status
  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  // Add to favorites
  const addFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  // Check if product is favorite
  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
};
