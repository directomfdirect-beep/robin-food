import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * OrderDetailScreen — shows completed/cancelled order details + rating
 */
export const OrderDetailScreen = ({ order, onBack, onRate }) => {
  const [rating, setRating] = useState(order?.rating || 0);
  const [comment, setComment] = useState('');
  const [rated, setRated] = useState(!!order?.rating);

  const handleRate = () => {
    if (rating === 0) return;
    setRated(true);
    onRate?.({ orderId: order?.id, rating, comment });
  };

  const orderData = order || { number: '#0000', status: 'completed', storeName: 'Магнит', total: 0 };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-black italic uppercase text-lg">Заказ {orderData.number}</h1>
          <p className="text-[10px] text-gray-400">{orderData.createdAt}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
          orderData.status === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-500'
        }`}>
          {orderData.status === 'completed' ? 'Завершён' : 'Отменён'}
        </div>

        {/* Store */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
          <MapPin size={18} className="text-brand-green" />
          <div>
            <p className="font-bold text-sm">{orderData.storeName}</p>
            <p className="text-[10px] text-gray-400">{orderData.storeAddress}</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Состав</p>
          {orderData.items?.length > 0 ? (
            <div className="space-y-2">
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
            <p className="text-sm text-gray-400">{orderData.itemsCount || 0} товаров</p>
          )}
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="font-bold text-sm">Итого</span>
          <span className="font-bold text-xl text-brand-green">₽{orderData.total}</span>
        </div>

        {/* Rating */}
        {orderData.status === 'completed' && (
          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">
              {rated ? 'Ваша оценка' : 'Оцените заказ'}
            </p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !rated && setRating(star)}
                  disabled={rated}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'text-orange-500' : 'text-gray-200'}
                    fill={star <= rating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            {!rated && (
              <>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Комментарий (опционально)"
                  maxLength={500}
                  rows={3}
                  className="w-full p-3 bg-white rounded-xl text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none mb-3"
                />
                <Button onClick={handleRate} fullWidth size="md" disabled={rating === 0}>
                  Отправить оценку
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
