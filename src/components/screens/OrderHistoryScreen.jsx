import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, ChevronRight } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'ord_1', number: '#1234', status: 'picking', storeName: 'Магнит', storeAddress: 'ул. Усачёва, 15', total: 467, itemsCount: 3, createdAt: '10.02.2026, 12:30' },
  { id: 'ord_2', number: '#1233', status: 'completed', storeName: 'Магнит', storeAddress: 'Комсомольский пр-т, 36', total: 892, itemsCount: 5, createdAt: '09.02.2026, 18:15', rating: 5 },
  { id: 'ord_3', number: '#1232', status: 'cancelled', storeName: 'Магнит', storeAddress: 'ул. Арбат, 54', total: 350, itemsCount: 2, createdAt: '08.02.2026, 09:45' },
  { id: 'ord_4', number: '#1231', status: 'completed', storeName: 'Магнит', storeAddress: 'ул. Тверская, 22', total: 1250, itemsCount: 7, createdAt: '07.02.2026, 14:20', rating: 4 },
];

const STATUS_CONFIG = {
  pending: { label: 'Ожидание', color: 'bg-blue-100 text-blue-600', icon: Clock },
  confirmed: { label: 'Подтверждён', color: 'bg-blue-100 text-blue-600', icon: Clock },
  picking: { label: 'Сборка', color: 'bg-blue-100 text-blue-600', icon: Package },
  ready: { label: 'Готов', color: 'bg-green-100 text-green-600', icon: CheckCircle },
  customer_arrived: { label: 'Ожидает выдачи', color: 'bg-green-100 text-green-600', icon: CheckCircle },
  completed: { label: 'Завершён', color: 'bg-gray-100 text-gray-500', icon: CheckCircle },
  cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-500', icon: XCircle },
};

const ACTIVE_STATUSES = ['pending', 'confirmed', 'picking', 'ready', 'customer_arrived'];

/**
 * OrderHistoryScreen — order history with filter tabs
 */
export const OrderHistoryScreen = ({ onBack, onOrderClick }) => {
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_ORDERS.filter((o) => {
    if (filter === 'active') return ACTIVE_STATUSES.includes(o.status);
    if (filter === 'completed') return o.status === 'completed';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'active', label: 'Активные' },
    { id: 'completed', label: 'Завершённые' },
    { id: 'cancelled', label: 'Отменённые' },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Мои заказы</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              filter === f.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="p-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = config.icon;
            return (
              <button
                key={order.id}
                onClick={() => onOrderClick(order)}
                className="w-full bg-gray-50 rounded-2xl p-4 text-left hover:bg-gray-100 transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{order.number}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Package size={14} />
                  <span className="text-xs">{order.storeName} — {order.storeAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{order.itemsCount} товаров · {order.createdAt}</span>
                  <span className="font-bold text-sm">₽{order.total}</span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="font-bold text-sm text-gray-400">Пока нет заказов</p>
          </div>
        )}
      </div>
    </div>
  );
};
