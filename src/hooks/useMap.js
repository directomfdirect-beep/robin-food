import { useEffect, useRef, useCallback } from 'react';
import { STORES } from '@/data/constants';

/**
 * Uber-style minimalist map colors with brand green radar
 */
const MAP_COLORS = {
  radar: '#208C80',
  radarFill: 'rgba(32, 140, 128, 0.06)',
  pulse: '#000000',
  pulseRing: 'rgba(0, 0, 0, 0.15)',
};

/**
 * Calculate appropriate zoom level based on radius
 */
const getZoomForRadius = (radiusKm) => {
  const zoom = 15 - Math.log2(radiusKm / 0.5);
  return Math.max(10, Math.min(16, Math.round(zoom)));
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Default center (Комсомольский 40)
 */
const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * Leaflet map management hook with Uber-style visualization
 */
export const useMap = ({ enabled = false, radius = 1.5, center = DEFAULT_CENTER }) => {
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const storeMarkersRef = useRef([]);
  const magnitIconRef = useRef(null);
  const currentRadiusRef = useRef(radius);
  const currentCenterRef = useRef(center);
  
  currentRadiusRef.current = radius;
  currentCenterRef.current = center;

  // Load Leaflet scripts
  const loadLeaflet = useCallback(() => {
    return new Promise((resolve) => {
      if (window.L) {
        resolve(window.L);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    });
  }, []);

  // Update store markers based on radius and center
  const updateStoreMarkers = useCallback((map, icon, radiusKm, centerCoords) => {
    if (!map || !icon) return;

    storeMarkersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    storeMarkersRef.current = [];

    STORES.forEach((store) => {
      const distance = getDistanceKm(
        centerCoords.lat, centerCoords.lng,
        store.lat, store.lng
      );

      if (distance <= radiusKm) {
        const marker = window.L.marker([store.lat, store.lng], {
          icon: icon,
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; text-align: center;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${store.name}</div>
              <div style="color: #666; font-size: 12px;">${store.address}</div>
              <div style="color: #999; font-size: 11px; margin-top: 4px;">${distance.toFixed(1)} км</div>
            </div>
          `);
        
        storeMarkersRef.current.push(marker);
      }
    });
  }, []);

  // Initialize map
  const initMap = useCallback(async (containerId, initialRadius, initialCenter) => {
    const L = await loadLeaflet();
    const container = document.getElementById(containerId);
    
    if (!container) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerId, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: getZoomForRadius(initialRadius),
      zoomControl: false,
      attributionControl: false,
    });

    // Uber-style minimalist map tiles (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Main radar circle - subtle black outline
    const circle = L.circle([initialCenter.lat, initialCenter.lng], {
      radius: initialRadius * 1000,
      color: MAP_COLORS.radar,
      fillColor: MAP_COLORS.radar,
      fillOpacity: 0.03,
      weight: 1.5,
      dashArray: '4, 6',
    }).addTo(map);
    circleRef.current = circle;

    // Inner gradient circles for depth effect
    const innerCircle1 = L.circle([initialCenter.lat, initialCenter.lng], {
      radius: initialRadius * 1000 * 0.66,
      color: 'transparent',
      fillColor: MAP_COLORS.radar,
      fillOpacity: 0.03,
      weight: 0,
    }).addTo(map);

    const innerCircle2 = L.circle([initialCenter.lat, initialCenter.lng], {
      radius: initialRadius * 1000 * 0.33,
      color: 'transparent',
      fillColor: MAP_COLORS.radar,
      fillOpacity: 0.04,
      weight: 0,
    }).addTo(map);

    // Store inner circles for updates
    circle._innerCircles = [innerCircle1, innerCircle2];

    // Uber-style user marker (simple black dot with pulse)
    const pulseIcon = L.divIcon({
      className: 'uber-marker',
      html: `
        <div class="uber-pulse-ring"></div>
        <div class="uber-pulse-ring uber-delay-1"></div>
        <div class="uber-dot"></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([initialCenter.lat, initialCenter.lng], {
      icon: pulseIcon,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup('<div style="font-family: system-ui; font-weight: 500;">Мое местоположение</div>');
    userMarkerRef.current = userMarker;

    // Minimalist store icon
    const storeIcon = L.divIcon({
      className: 'uber-store-marker',
      html: `
        <div class="uber-store-dot">
          <img src="/magnit-logo.png" alt="" />
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    magnitIconRef.current = storeIcon;

    updateStoreMarkers(map, storeIcon, initialRadius, initialCenter);

    mapRef.current = map;
  }, [loadLeaflet, updateStoreMarkers]);

  // Update center position
  const updateCenter = useCallback((newCenter) => {
    if (!mapRef.current) return;
    
    mapRef.current.setView([newCenter.lat, newCenter.lng], mapRef.current.getZoom(), { animate: true });
    
    if (circleRef.current) {
      circleRef.current.setLatLng([newCenter.lat, newCenter.lng]);
      // Update inner circles too
      if (circleRef.current._innerCircles) {
        circleRef.current._innerCircles.forEach(c => c.setLatLng([newCenter.lat, newCenter.lng]));
      }
    }
    
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([newCenter.lat, newCenter.lng]);
    }
    
    if (magnitIconRef.current) {
      updateStoreMarkers(mapRef.current, magnitIconRef.current, currentRadiusRef.current, newCenter);
    }
  }, [updateStoreMarkers]);

  // Update radius
  const updateRadius = useCallback((newRadius) => {
    if (!mapRef.current) return;
    
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius * 1000);
      // Update inner circles too
      if (circleRef.current._innerCircles) {
        circleRef.current._innerCircles[0].setRadius(newRadius * 1000 * 0.66);
        circleRef.current._innerCircles[1].setRadius(newRadius * 1000 * 0.33);
      }
    }
    
    const targetZoom = getZoomForRadius(newRadius);
    mapRef.current.setZoom(targetZoom, { animate: true });
    
    if (magnitIconRef.current) {
      updateStoreMarkers(mapRef.current, magnitIconRef.current, newRadius, currentCenterRef.current);
    }
  }, [updateStoreMarkers]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      circleRef.current = null;
      userMarkerRef.current = null;
      storeMarkersRef.current = [];
      magnitIconRef.current = null;
    }
  }, []);

  // Effect for initialization
  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(() => {
        initMap('osm-map', currentRadiusRef.current, currentCenterRef.current);
      }, 150);
      return () => {
        clearTimeout(timer);
        cleanup();
      };
    }
    return cleanup;
  }, [enabled, initMap, cleanup]);

  // Effect for radius updates
  useEffect(() => {
    updateRadius(radius);
  }, [radius, updateRadius]);

  // Effect for center updates
  useEffect(() => {
    updateCenter(center);
  }, [center, updateCenter]);

  return {
    mapRef,
    updateRadius,
    updateCenter,
    cleanup,
  };
};
