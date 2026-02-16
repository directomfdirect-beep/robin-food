import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Clock, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_CARDS = [
  { id: 'pm_001', type: 'card', brand: 'visa', last4: '4242', isDefault: true },
  { id: 'pm_002', type: 'card', brand: 'mastercard', last4: '5555', isDefault: false },
];

/**
 * PaymentMethodScreen — select payment method before checkout
 */
export const PaymentMethodScreen = ({ onSelect, onBack, onAddCard }) => {
  const [selected, setSelected] = useState(MOCK_CARDS.find((c) => c.isDefault)?.id || '');

  const methods = [
    ...MOCK_CARDS.map((c) => ({
      id: c.id,
      icon: CreditCard,
      label: `${c.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• ${c.last4}`,
      sub: c.isDefault ? 'Основная' : '',
    })),
    { id: 'sbp', icon: Smartphone, label: 'СБП', sub: 'Система быстрых платежей' },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Способ оплаты</h1>
      </div>

      <div className="p-6 space-y-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left ${
                isActive
                  ? 'bg-brand-green/[0.08] border-[1.5px] border-brand-green'
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-brand-green/20' : 'bg-white'}`}>
                <Icon size={20} className={isActive ? 'text-brand-green' : 'text-gray-400'} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{m.label}</p>
                {m.sub && <p className="text-[10px] text-gray-400">{m.sub}</p>}
              </div>
              {isActive && <Check size={20} className="text-brand-green" />}
            </button>
          );
        })}

        <button
          onClick={onAddCard}
          className="w-full p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Plus size={20} className="text-gray-400" />
          </div>
          <span className="font-bold text-sm text-gray-500">Добавить карту</span>
        </button>
      </div>

      <div className="px-6 mt-4">
        <Button onClick={() => onSelect(selected)} fullWidth size="lg">
          Продолжить
        </Button>
      </div>
    </div>
  );
};
