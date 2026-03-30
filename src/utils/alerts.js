/**
 * Shared helpers for Smart Alerts — used by SmartAlertsScreen, AlertDetailScreen, and useStoreSelection.
 */
export const ALERTS_STORAGE_KEY = 'rf_smart_alerts';

const DEFAULT_ALERTS = [
  {
    id: 'al_fish_default',
    category: 'Рыба',
    minDiscount: 30,
    radiusKm: 2,
    schedule: 'all_day',
    enabled: true,
    triggerCount: 2,
    lastTriggered: '10.03.2026',
  },
  {
    id: 'al_meat_default',
    category: 'Мясо',
    minDiscount: 40,
    radiusKm: 3,
    schedule: 'evening',
    enabled: true,
    triggerCount: 0,
    lastTriggered: null,
  },
];

export const loadAlerts = () => {
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ALERTS;
  } catch {
    return DEFAULT_ALERTS;
  }
};

export const saveAlerts = (alerts) => {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // ignore
  }
};
