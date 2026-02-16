import { useState, useCallback, useMemo } from 'react';
import { STORES } from '@/data/constants';
import { MASTER_CATALOG } from '@/data/catalog';
import { syncProductsToDatabase, checkDatabaseConnection } from '@/lib/supabase';

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in km
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Shopping modes
 * - 'single': User buys only from one store
 * - 'multi': User can buy from multiple stores
 * - null: Not yet chosen
 */
const SHOPPING_MODES = {
  SINGLE: 'single',
  MULTI: 'multi',
};

/**
 * Hook for managing store selection and product distribution
 * @returns {Object} Store selection state and methods
 */
export const useStoreSelection = () => {
  // Selected store (locked after adding to cart in single mode)
  const [selectedStore, setSelectedStore] = useState(null);
  
  // Stores within radar radius
  const [storesInRadius, setStoresInRadius] = useState([]);
  
  // Products distributed to stores (key: storeId, value: array of products)
  const [storeProducts, setStoreProducts] = useState({});
  
  // Flag indicating if radar has been applied
  const [radarApplied, setRadarApplied] = useState(false);
  
  // Shopping mode: 'single', 'multi', or null (not chosen yet)
  const [shoppingMode, setShoppingMode] = useState(null);
  
  // Selected chain filter (reserved for future use)
  const [selectedChain, setSelectedChain] = useState(null);
  
  // Database sync status
  const [dbSyncStatus, setDbSyncStatus] = useState({ syncing: false, synced: false, error: null });

  /**
   * Apply radar - find stores in radius and distribute products
   * @param {Object} center - Center coordinates {lat, lng}
   * @param {number} radius - Radius in km
   */
  const applyRadar = useCallback(async (center, radius) => {
    // Find stores within radius
    const stores = STORES.filter((store) => {
      const distance = calculateDistance(
        center.lat,
        center.lng,
        store.lat,
        store.lng
      );
      return distance <= radius;
    });

    if (stores.length === 0) {
      setStoresInRadius([]);
      setStoreProducts({});
      setRadarApplied(true);
      return;
    }

    setStoresInRadius(stores);

    // Shuffle products for random distribution
    const shuffledProducts = shuffleArray([...MASTER_CATALOG]);
    
    // Distribute products evenly among stores
    const distribution = {};
    stores.forEach((store) => {
      distribution[store.id] = [];
    });

    shuffledProducts.forEach((product, index) => {
      const storeIndex = index % stores.length;
      const store = stores[storeIndex];
      
      // Create product copy with store info
      const productWithStore = {
        ...product,
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
      };
      
      distribution[store.id].push(productWithStore);
    });

    setStoreProducts(distribution);
    setRadarApplied(true);
    
    // Reset selected store when radar changes
    setSelectedStore(null);
    
    // Sync to database in background
    syncToDatabase(stores, distribution);
  }, []);

  /**
   * Sync products to Supabase database
   */
  const syncToDatabase = useCallback(async (stores, distribution) => {
    setDbSyncStatus({ syncing: true, synced: false, error: null });
    
    try {
      // Check if database is available
      const { connected } = await checkDatabaseConnection();
      
      if (!connected) {
        console.log('📊 Database not available, skipping sync');
        setDbSyncStatus({ syncing: false, synced: false, error: 'Database not connected' });
        return;
      }
      
      // Sync products for each store
      const syncPromises = stores.map((store) => {
        const products = distribution[store.id] || [];
        return syncProductsToDatabase(products, store);
      });
      
      await Promise.all(syncPromises);
      
      console.log('✅ All products synced to database');
      setDbSyncStatus({ syncing: false, synced: true, error: null });
    } catch (error) {
      console.error('❌ Database sync error:', error);
      setDbSyncStatus({ syncing: false, synced: false, error: error.message });
    }
  }, []);

  /**
   * Lock to a specific store (called when adding first item to cart)
   * @param {string} storeId - Store ID to lock to
   */
  const lockToStore = useCallback((storeId) => {
    const store = storesInRadius.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  }, [storesInRadius]);

  /**
   * Reset store selection (called when cart is cleared)
   */
  const resetStoreSelection = useCallback(() => {
    setSelectedStore(null);
    setShoppingMode(null);
    setSelectedChain(null);
  }, []);

  /**
   * Set shopping mode
   * @param {'single' | 'multi'} mode - Shopping mode
   * @param {string} [storeId] - Store ID to lock to (for single mode)
   */
  const setMode = useCallback((mode, storeId = null) => {
    setShoppingMode(mode);
    if (mode === SHOPPING_MODES.SINGLE && storeId) {
      const store = storesInRadius.find((s) => s.id === storeId);
      if (store) {
        setSelectedStore(store);
      }
    }
  }, [storesInRadius]);

  /**
   * Set chain filter
   * @param {string|null} chainId - Chain ID or null for all
   */
  const setChainFilter = useCallback((chainId) => {
    setSelectedChain(chainId);
  }, []);

  /**
   * Get unique store names in radius
   */
  const chainsInRadius = useMemo(() => {
    const names = new Set(storesInRadius.map((s) => s.name));
    return Array.from(names).map((name) => ({
      id: name,
      name,
      storeCount: storesInRadius.filter((s) => s.name === name).length,
    }));
  }, [storesInRadius]);

  /**
   * Get all products based on current state:
   * - If store is selected: only products from that store
   * - If chain is selected: only products from stores of that chain
   * - If radar applied but no store: all products from all stores in radius
   * - If radar not applied: return empty (user should select radar first)
   */
  const availableProducts = useMemo(() => {
    if (!radarApplied) {
      return [];
    }

    if (selectedStore) {
      // Return only products from selected store
      return storeProducts[selectedStore.id] || [];
    }

    // Get all products from stores
    let products = Object.values(storeProducts).flat();

    return products;
  }, [radarApplied, selectedStore, storeProducts]);

  /**
   * Get store by ID
   * @param {string} storeId - Store ID
   * @returns {Object|null} Store object or null
   */
  const getStoreById = useCallback((storeId) => {
    return storesInRadius.find((s) => s.id === storeId) || null;
  }, [storesInRadius]);

  return {
    // State
    selectedStore,
    storesInRadius,
    storeProducts,
    radarApplied,
    availableProducts,
    shoppingMode,
    selectedChain,
    chainsInRadius,
    dbSyncStatus,
    
    // Constants
    SHOPPING_MODES,
    
    // Methods
    applyRadar,
    lockToStore,
    resetStoreSelection,
    getStoreById,
    setMode,
    setChainFilter,
  };
};
