import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_CARDS = [
  { id: 'pm_001', brand: 'visa', last4: '4242', isDefault: true },
  { id: 'pm_002', brand: 'mastercard', last4: '5555', isDefault: false },
];

/**
 * PaymentMethodsScreen — CRUD for payment cards
 */
export const PaymentMethodsScreen = ({ onBack }) => {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [showAdd, setShowAdd] = useState(false);

  const handleSetDefault = (id) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const handleDelete = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Способы оплаты</h1>
      </div>

      <div className="p-6 space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-2xl flex items-center gap-4 ${
              card.isDefault ? 'bg-brand-green/[0.08] border-[1.5px] border-brand-green' : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <CreditCard
              size={20}
              className={card.isDefault ? 'text-brand-green' : 'text-gray-400'}
            />
            <div className="flex-1">
              <p className="font-bold text-sm">
                {card.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
              </p>
              {card.isDefault && (
                <p className="text-[10px] text-brand-green font-bold">Основная</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!card.isDefault && (
                <button
                  onClick={() => handleSetDefault(card.id)}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  title="Сделать основной"
                >
                  <Check size={14} className="text-gray-500" />
                </button>
              )}
              <button
                onClick={() => handleDelete(card.id)}
                className="p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} className="text-error" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAdd(true)}
          className="w-full p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <Plus size={20} className="text-gray-400" />
          <span className="font-bold text-sm text-gray-500">Добавить карту</span>
        </button>

        {showAdd && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase text-gray-400">Новая карта</p>
            <input
              type="text"
              placeholder="Номер карты"
              className="w-full p-3 bg-white rounded-xl text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="flex-1 p-3 bg-white rounded-xl text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-24 p-3 bg-white rounded-xl text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-gray-200 rounded-xl text-sm font-bold text-gray-600"
              >
                Отмена
              </button>
              <Button
                onClick={() => {
                  setCards((prev) => [
                    ...prev,
                    { id: `pm_${Date.now()}`, brand: 'visa', last4: '1234', isDefault: false },
                  ]);
                  setShowAdd(false);
                }}
                className="flex-1"
                size="md"
              >
                Добавить
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
