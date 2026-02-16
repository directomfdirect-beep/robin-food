import React, { useState } from 'react';
import { ArrowLeft, MapPin, MessageCircle, Package, Clock, CheckCircle, Truck, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STATUSES = [
  { key: 'pending', label: 'Ожидание', icon: Clock },
  { key: 'confirmed', label: 'Подтверждён', icon: CheckCircle },
  { key: 'picking', label: 'Сборка', icon: Package },
  { key: 'ready', label: 'Готов', icon: Truck },
  { key: 'customer_arrived', label: 'Выдача', icon: User },
  { key: 'completed', label: 'Завершён', icon: CheckCircle },
];

/**
 * OrderTrackingScreen — 3 tabs: Status, Items, Chat
 */
export const OrderTrackingScreen = ({ order, onBack, onArrive, onCancel }) => {
  const [activeTab, setActiveTab] = useState('status');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Заказ создан', time: '12:30' },
  ]);

  const orderData = order || {
    number: `#${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'picking',
    store: { name: 'Магнит', address: 'ул. Усачёва, 15' },
    items: [],
    total: 0,
  };

  const currentStatusIdx = STATUSES.findIndex((s) => s.key === orderData.status);
  const canCancel = ['pending', 'confirmed'].includes(orderData.status);
  const showArrived = orderData.status === 'ready';

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'buyer', text: chatMessage.trim(), time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatMessage('');
  };

  const tabs = [
    { id: 'status', label: 'Статус' },
    { id: 'items', label: 'Состав' },
    { id: 'chat', label: 'Чат' },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-black italic uppercase text-lg">Заказ {orderData.number}</h1>
          <p className="text-[10px] text-gray-400">{orderData.store?.name} — {orderData.store?.address}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 flex gap-2 border-b border-gray-50 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === t.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'status' && (
          <div className="p-6">
            {/* Progress steps */}
            <div className="space-y-4 mb-8">
              {STATUSES.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                return (
                  <div key={s.key} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrent ? 'bg-brand-green text-white' : isCompleted ? 'bg-brand-green/20 text-brand-green' : 'bg-gray-100 text-gray-300'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${isCurrent ? 'text-brand-green' : isCompleted ? 'text-black' : 'text-gray-300'}`}>
                        {s.label}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded-lg">
                        Текущий
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            {showArrived && (
              <Button onClick={onArrive} fullWidth size="lg" className="mb-3">
                Я на месте
              </Button>
            )}
            {canCancel && (
              <button
                onClick={onCancel}
                className="w-full py-3 text-sm font-bold text-error hover:bg-error/5 rounded-2xl transition-colors"
              >
                Отменить заказ
              </button>
            )}

            {/* Store info */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <MapPin size={18} className="text-brand-green" />
              <div>
                <p className="font-bold text-sm">{orderData.store?.name}</p>
                <p className="text-[10px] text-gray-400">{orderData.store?.address}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-4">Состав заказа</p>
            {orderData.items?.length > 0 ? (
              <div className="space-y-3">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400">{item.qty} шт</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Данные о составе загружаются...</p>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-6 space-y-3 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'buyer' ? 'bg-brand-green text-white' : msg.sender === 'system' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'buyer' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="p-3 bg-brand-green text-white rounded-2xl disabled:opacity-30 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
