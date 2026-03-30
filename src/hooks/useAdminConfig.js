import { useState, useCallback } from 'react';
import { ONBOARDING_DATA, CATEGORIES } from '@/data/constants';

// Default tabs with icon keys (string) for dynamic rendering
const DEFAULT_TABS = [
  { id: 'home', label: 'Главная', icon: 'Radar' },
  { id: 'catalog', label: 'Каталог', icon: 'Search' },
  { id: 'cart', label: 'Корзина', icon: 'ShoppingBag' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const STORAGE_KEY = 'rf_admin_config';

const getDefaults = () => ({
  onboarding: ONBOARDING_DATA,
  tabs: DEFAULT_TABS,
  categories: CATEGORIES,
});

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveToStorage = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
};

/**
 * Hook that manages admin-editable config for onboarding slides, tab labels and category filters.
 * Persists to localStorage under rf_admin_config. Falls back to hardcoded constants.
 */
export const useAdminConfig = () => {
  const [config, setConfig] = useState(() => {
    const saved = loadFromStorage();
    if (!saved) return getDefaults();
    // If saved tabs contain legacy ids (categories/favorites), reset to new defaults
    const savedTabs = saved.tabs || [];
    const hasLegacyTabs = savedTabs.some(t => t.id === 'categories' || t.id === 'favorites');
    if (hasLegacyTabs) {
      const fresh = getDefaults();
      saveToStorage(fresh);
      return fresh;
    }
    return { ...getDefaults(), ...saved };
  });

  const updateConfig = useCallback((updater) => {
    setConfig((prev) => {
      const next = updater(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateOnboarding = useCallback((slides) => {
    updateConfig((prev) => ({ ...prev, onboarding: slides }));
  }, [updateConfig]);

  const updateTabs = useCallback((tabs) => {
    updateConfig((prev) => ({ ...prev, tabs }));
  }, [updateConfig]);

  const updateCategories = useCallback((categories) => {
    updateConfig((prev) => ({ ...prev, categories }));
  }, [updateConfig]);

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaults();
    saveToStorage(defaults);
    setConfig(defaults);
  }, []);

  return {
    config,
    updateOnboarding,
    updateTabs,
    updateCategories,
    resetToDefaults,
  };
};
