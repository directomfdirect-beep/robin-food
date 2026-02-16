import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Search, X, Loader2 } from 'lucide-react';

/**
 * Address search input with OpenStreetMap Nominatim autocomplete
 */
export const AddressSearch = ({ value, onChange, onSelect, placeholder = 'Введите адрес...' }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch suggestions from Nominatim API
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Nominatim API with Moscow bias
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('format', 'json');
      url.searchParams.set('addressdetails', '1');
      url.searchParams.set('limit', '5');
      url.searchParams.set('countrycodes', 'ru');
      url.searchParams.set('viewbox', '37.2,55.9,37.9,55.5'); // Moscow bounds
      url.searchParams.set('bounded', '1');

      const response = await fetch(url.toString(), {
        headers: {
          'Accept-Language': 'ru',
        },
      });
      
      const data = await response.json();
      
      // Format results
      const formatted = data.map((item) => ({
        id: item.place_id,
        displayName: item.display_name,
        shortName: formatShortAddress(item),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
      }));
      
      setSuggestions(formatted);
      setShowSuggestions(formatted.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Nominatim search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format short address from Nominatim result
  const formatShortAddress = (item) => {
    const address = item.address || {};
    const parts = [];
    
    if (address.road) parts.push(address.road);
    if (address.house_number) parts.push(address.house_number);
    if (!parts.length && address.neighbourhood) parts.push(address.neighbourhood);
    if (!parts.length && address.suburb) parts.push(address.suburb);
    
    const district = address.suburb || address.city_district || address.district || '';
    if (district && parts.length) {
      return `${parts.join(', ')}, ${district}`;
    }
    
    return parts.length ? parts.join(', ') : item.display_name.split(',')[0];
  };

  // Debounced search
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce API call
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  }, [onChange, fetchSuggestions]);

  // Handle suggestion selection
  const handleSelect = useCallback((suggestion) => {
    setQuery(suggestion.shortName);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange?.(suggestion.shortName);
    onSelect?.({
      address: suggestion.shortName,
      fullAddress: suggestion.displayName,
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
  }, [onChange, onSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSelect]);

  // Clear input
  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onChange?.('');
    inputRef.current?.focus();
  }, [onChange]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Input field */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green">
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <MapPin size={20} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-12 py-3 
            bg-gray-100 rounded-2xl
            text-sm font-medium text-black
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-green/30
            transition-all
          "
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="
            absolute top-full left-0 right-0 mt-2 
            bg-white rounded-2xl shadow-xl 
            border border-gray-100 
            overflow-hidden z-50
            max-h-[240px] overflow-y-auto
          "
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className={`
                w-full px-4 py-3 text-left flex items-start gap-3
                transition-colors
                ${index === selectedIndex ? 'bg-brand-green/10' : 'hover:bg-gray-50'}
                ${index !== suggestions.length - 1 ? 'border-b border-gray-50' : ''}
              `}
            >
              <MapPin size={18} className="text-brand-green mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-black truncate">
                  {suggestion.shortName}
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">
                  {suggestion.displayName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
