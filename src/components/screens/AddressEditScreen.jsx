import React, { useState, useCallback } from 'react';
import { ArrowLeft, MapPin, Home, Briefcase, Tag, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LABELS = [
  { id: 'home', label: 'Дом', icon: Home },
  { id: 'work', label: 'Работа', icon: Briefcase },
  { id: 'custom', label: 'Другое', icon: Tag },
];

/**
 * AddressEditScreen — add/edit address with geocoding suggest + map preview
 */
export const AddressEditScreen = ({ address, onSave, onBack }) => {
  const [query, setQuery] = useState(address?.address || '');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(address?.icon || 'home');
  const [customLabel, setCustomLabel] = useState(address?.label || '');
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [intercom, setIntercom] = useState('');

  const handleAddressChange = useCallback((val) => {
    setQuery(val);
    if (val.length >= 3) {
      setSuggestions([
        { text: `${val}, д. 1`, lat: 55.73, lng: 37.58 },
        { text: `${val}, д. 12`, lat: 55.74, lng: 37.59 },
        { text: `${val}, д. 25`, lat: 55.75, lng: 37.60 },
      ]);
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleSave = () => {
    onSave?.({
      address: query,
      label: selectedLabel === 'custom' ? customLabel : LABELS.find((l) => l.id === selectedLabel)?.label,
      icon: selectedLabel,
      isDefault,
      apartment,
      entrance,
      floor,
      intercom,
    });
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">
          {address ? 'Редактировать адрес' : 'Новый адрес'}
        </h1>
      </div>

      <div className="p-6 space-y-5">
        {/* Address input */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Адрес</p>
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Улица, дом"
              className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s.text);
                    setSuggestions([]);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Квартира</p>
            <input
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Подъезд</p>
            <input
              type="text"
              value={entrance}
              onChange={(e) => setEntrance(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Этаж</p>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Домофон</p>
            <input
              type="text"
              value={intercom}
              onChange={(e) => setIntercom(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
        </div>

        {/* Label */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Метка</p>
          <div className="flex gap-2">
            {LABELS.map((l) => {
              const Icon = l.icon;
              return (
                <button
                  key={l.id}
                  onClick={() => setSelectedLabel(l.id)}
                  className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                    selectedLabel === l.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon size={16} />
                  {l.label}
                </button>
              );
            })}
          </div>
          {selectedLabel === 'custom' && (
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Название"
              className="w-full mt-2 p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          )}
        </div>

        {/* Default toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
          <span className="font-bold text-sm">Сделать основным</span>
          <button
            onClick={() => setIsDefault(!isDefault)}
            className={`w-12 h-7 rounded-full transition-colors relative ${isDefault ? 'bg-brand-green' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDefault ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        <Button onClick={handleSave} fullWidth size="lg">
          Сохранить
        </Button>
      </div>
    </div>
  );
};
