import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Star, Trash2, Home, Briefcase } from 'lucide-react';

const MOCK_ADDRESSES = [
  { id: 'a1', label: 'Дом', address: 'Комсомольский пр-т, 36, кв. 42', isDefault: true, icon: 'home' },
  { id: 'a2', label: 'Работа', address: 'ул. Тверская, 22, оф. 301', isDefault: false, icon: 'work' },
  { id: 'a3', label: '', address: 'ул. Арбат, 54, кв. 15', isDefault: false, icon: null },
];

const ICON_MAP = {
  home: Home,
  work: Briefcase,
};

/**
 * AddressScreen — list of saved addresses (max 5)
 */
export const AddressScreen = ({ onBack, onAdd, onEdit }) => {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Мои адреса</h1>
      </div>

      <div className="p-6 space-y-3">
        {addresses.map((addr) => {
          const Icon = ICON_MAP[addr.icon] || MapPin;
          return (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl flex items-start gap-4 ${
                addr.isDefault
                  ? 'bg-brand-green/[0.08] border-[1.5px] border-brand-green'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                addr.isDefault ? 'bg-brand-green/20' : 'bg-white'
              }`}>
                <Icon size={18} className={addr.isDefault ? 'text-brand-green' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm">{addr.label || 'Адрес'}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-lg">
                      Основной
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{addr.address}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Star size={14} className="text-gray-500" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} className="text-error" />
                </button>
              </div>
            </div>
          );
        })}

        {addresses.length < 5 && (
          <button
            onClick={onAdd}
            className="w-full p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <Plus size={20} className="text-gray-400" />
            <span className="font-bold text-sm text-gray-500">
              Добавить адрес ({addresses.length}/5)
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
