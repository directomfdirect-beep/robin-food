import React, { useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  ShieldCheck,
  Bell,
  CreditCard,
  Store,
  Send,
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  Plus,
  Check,
  AlertCircle,
  X,
  Package,
  Truck,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  Navigation,
  Phone,
  ShoppingBag,
  Mail,
  Star,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Image,
  Trash2,
  Shield,
} from 'lucide-react';
import { MASTER_CATALOG } from '@/data/catalog';
import { Button } from '@/components/ui/Button';

/**
 * Overlay container with navigation
 */
const OverlayContainer = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-gray-bg z-[9000] flex flex-col">
    <nav className="bg-white p-6 flex items-center justify-between border-b border-gray-100 shrink-0">
      <button onClick={onClose} className="text-gray-400 p-2 -ml-2">
        <ChevronLeft size={32} />
      </button>
      <h2 className="ga-title text-xl">{title}</h2>
      <div className="w-10" />
    </nav>
    {children}
  </div>
);

/**
 * Settings overlay
 */
export const SettingsOverlay = ({ onClose, onLogout }) => (
  <OverlayContainer title="Настройки" onClose={onClose}>
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100">
        {[
          { icon: Edit3, label: 'Профиль' },
          { icon: ShieldCheck, label: 'Безопасность' },
          { icon: Bell, label: 'Уведомления' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center justify-between p-6 border-b border-gray-50 last:border-0 active:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <item.icon size={20} className="text-brand-green" />
              <span className="ga-label text-xs">
                {item.label}
              </span>
            </div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full py-6 text-red-500 ga-button text-xs tracking-widest mt-10 shadow-sm bg-white rounded-3xl"
      >
        Выход
      </button>
    </div>
  </OverlayContainer>
);

/**
 * Notifications overlay - Full implementation
 */
export const NotificationsOverlay = ({ notifications = [], onClose, onClear, onMarkRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'order': return Package;
      case 'delivery': return Truck;
      case 'promo': return Heart;
      default: return Bell;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'order': return 'bg-brand-green/10 text-brand-green';
      case 'delivery': return 'bg-blue-50 text-blue-500';
      case 'promo': return 'bg-red-50 text-error';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
  <OverlayContainer title="Уведомления" onClose={onClose}>
      {notifications.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {/* Clear all button */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="ga-label text-[10px] text-gray-400">
              {notifications.filter(n => !n.read).length} НОВЫХ
            </span>
            <button
              onClick={onClear}
              className="ga-button text-xs text-gray-400 hover:text-gray-600"
            >
              Очистить все
            </button>
    </div>

          {/* Notifications list */}
          <div className="p-4 space-y-3">
            {notifications.map((notif) => {
              const IconComponent = getIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkRead?.(notif.id)}
                  className={`bg-white p-4 rounded-2xl border transition-colors cursor-pointer ${
                    notif.read ? 'border-gray-100' : 'border-brand-green bg-green-50/30'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBg(notif.type)}`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="ga-body-medium text-sm">{notif.title}</h4>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-brand-green rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="ga-body text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="ga-body text-[10px] text-gray-400 mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} className="text-gray-300" />
          </div>
          <h3 className="ga-title text-lg mb-2">Нет уведомлений</h3>
          <p className="ga-body text-sm text-gray-400 text-center">
            Здесь появятся уведомления о заказах и акциях
          </p>
        </div>
      )}
  </OverlayContainer>
);
};

/**
 * Support/Help overlay - Full implementation
 */
export const SupportOverlay = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({ category: '', name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Mock FAQ data
  const faqs = [
    {
      id: 'faq_001',
      question: 'Как отследить заказ?',
      answer: 'Чтобы отследить заказ, перейдите в раздел "Мои заказы" в профиле. Там вы увидите статус каждого заказа и сможете отследить доставку в реальном времени.',
      category: 'orders',
    },
    {
      id: 'faq_002',
      question: 'Как вернуть товар?',
      answer: 'Для возврата товара свяжитесь с нашей службой поддержки в течение 24 часов после получения заказа. Мы организуем возврат и вернём деньги на карту.',
      category: 'returns',
    },
    {
      id: 'faq_003',
      question: 'Как работает самовывоз?',
      answer: 'После оформления заказа вы получите уведомление, когда заказ будет готов. Заберите его в выбранном магазине, предъявив QR-код из приложения.',
      category: 'delivery',
    },
    {
      id: 'faq_004',
      question: 'Как получить промокод?',
      answer: 'Промокоды доступны в разделе "Промокоды" профиля. Также следите за нашими акциями в соцсетях и подпишитесь на рассылку.',
      category: 'promo',
    },
    {
      id: 'faq_005',
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты Visa, Mastercard и МИР. Также можно оплатить через Apple Pay и Google Pay.',
      category: 'payment',
    },
  ];

  // Mock chat history
  const chatHistory = [
    { id: 'chat_001', date: '10 января', status: 'resolved', topic: 'Проблема с заказом' },
    { id: 'chat_002', date: '8 января', status: 'resolved', topic: 'Вопрос о доставке' },
  ];

  const tabs = [
    { id: 'faq', label: 'FAQ' },
    { id: 'form', label: 'Написать' },
    { id: 'chat', label: 'Чат' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const categories = [
    { value: 'order', label: 'Проблема с заказом' },
    { value: 'delivery', label: 'Вопрос о доставке' },
    { value: 'payment', label: 'Проблема с оплатой' },
    { value: 'app', label: 'Проблема с приложением' },
    { value: 'other', label: 'Другое' },
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq =>
    !searchQuery ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitForm = useCallback(async () => {
    if (!formData.message.trim()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ category: '', name: '', email: '', message: '' });
    // Show success message
  }, [formData]);

  return (
    <OverlayContainer title="Помощь и поддержка" onClose={onClose}>
      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl ga-button text-[10px] transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
        <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Поиск вопроса..."
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>

            <h3 className="ga-label text-[10px] text-gray-400">ПОПУЛЯРНЫЕ ВОПРОСЫ</h3>

            {/* FAQ list */}
            <div className="space-y-2">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <span className="ga-body-medium text-sm pr-4">{faq.question}</span>
                    <ChevronRight
                      size={18}
                      className={`text-gray-400 transition-transform flex-shrink-0 ${
                        expandedFaq === faq.id ? 'rotate-90' : ''
                      }`}
                    />
        </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="ga-body text-sm text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form Tab */}
        {activeTab === 'form' && (
          <div className="p-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4">
              <h3 className="ga-label text-[10px] text-gray-400">ФОРМА ОБРАТНОЙ СВЯЗИ</h3>

              {/* Category */}
              <div>
                <label className="ga-label text-[10px] text-gray-400 mb-2 block">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="ga-label text-[10px] text-gray-400 mb-2 block">Ваше имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Петров"
                  className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                />
              </div>

              {/* Email */}
              <div>
                <label className="ga-label text-[10px] text-gray-400 mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan@example.com"
                  className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                />
              </div>

              {/* Message */}
              <div>
                <label className="ga-label text-[10px] text-gray-400 mb-2 block">Ваш вопрос</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Опишите вашу проблему..."
                  rows={4}
                  className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none"
                />
              </div>

              {/* Attachment button (mock) */}
              <button className="flex items-center gap-2 text-brand-green ga-button text-xs">
                <Plus size={16} /> Приложить скриншот
              </button>

              {/* Submit */}
              <button
                onClick={handleSubmitForm}
                disabled={isSubmitting || !formData.message.trim()}
                className="w-full py-3 bg-brand-green text-white rounded-xl ga-button text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} /> Отправить
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="p-4 space-y-4">
            {/* Operator status */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="ga-body-medium text-sm">Оператор онлайн</span>
              </div>
              <p className="ga-body text-xs text-gray-400 mb-4">
                Среднее время ответа: 2 мин
              </p>
              <button className="w-full py-3 bg-brand-green text-white rounded-xl ga-button text-sm flex items-center justify-center gap-2">
                <Send size={16} /> Начать чат с поддержкой
              </button>
            </div>

            {/* Chat history */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <h3 className="ga-label text-[10px] text-gray-400 mb-3">ИСТОРИЯ ЧАТОВ</h3>
              <div className="space-y-3">
                {chatHistory.map(chat => (
                  <button
                    key={chat.id}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-left">
                      <p className="ga-body-medium text-sm">{chat.topic}</p>
                      <p className="ga-body text-xs text-gray-400">{chat.date}</p>
                    </div>
                    <span className="ga-label text-[9px] text-brand-green bg-green-50 px-2 py-1 rounded-lg">
                      ✓ Решена
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick chat input */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 flex gap-3">
        <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none"
              />
              <button className="p-3 bg-black text-acid rounded-xl">
                <Send size={18} />
        </button>
      </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="p-4 space-y-4">
            {/* Support contacts */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <h3 className="ga-label text-[10px] text-gray-400 mb-4">ОТДЕЛ ПОДДЕРЖКИ</h3>
              
              <div className="space-y-3">
                <a
                  href="mailto:support@robinfood.ru"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <Mail size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="ga-body-medium text-sm">support@robinfood.ru</p>
                    <p className="ga-body text-[10px] text-gray-400">Email</p>
                  </div>
                </a>

                <a
                  href="tel:+74951234567"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="ga-body-medium text-sm">+7 (495) 123-45-67</p>
                    <p className="ga-body text-[10px] text-gray-400">Пн-Пт 9:00-21:00</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="ga-body-medium text-sm">Москва, ул. Пушкина, 10</p>
                    <p className="ga-body text-[10px] text-gray-400">Офис</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <h3 className="ga-label text-[10px] text-gray-400 mb-4">СОЦИАЛЬНЫЕ СЕТИ</h3>
              <div className="flex gap-3">
                {['VK', 'TG', 'OK', 'YT'].map(social => (
                  <button
                    key={social}
                    className="flex-1 py-3 bg-gray-100 rounded-xl ga-button text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>

            {/* System status */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <h3 className="ga-label text-[10px] text-gray-400 mb-4">СТАТУС СИСТЕМЫ</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="ga-body text-sm">Все системы работают нормально</span>
                </div>
                <p className="ga-body text-xs text-gray-400">
                  Последнее обновление: сегодня, 10:00
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  </OverlayContainer>
);
};

/**
 * Checkout overlay - Full implementation
 */
export const CheckoutOverlay = ({ cartItems, cartStats, onClose, onPay, onAddCard }) => {
  // Store for pickup (from cart items)
  const pickupStore = {
    name: 'Магнит Экстра',
    address: 'ул. Усачева, 15',
    workHours: '08:00 — 22:00',
    pickupTime: '15 мин',
  };

  // Mock payment methods
  const [paymentMethods] = useState([
    { id: 'pm_001', type: 'card', brand: 'visa', last4: '4242', isDefault: true },
    { id: 'pm_002', type: 'card', brand: 'mastercard', last4: '5555', isDefault: false },
  ]);

  const [selectedPayment, setSelectedPayment] = useState(paymentMethods.find(p => p.isDefault) || paymentMethods[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Calculate order totals (no shipping - pickup only)
  const subtotal = cartStats?.totalPrice || 0;
  const promoDiscount = 0; // Would come from cart
  const total = Math.max(0, subtotal - promoDiscount);

  const canSubmit = selectedPayment && agreedToTerms && !isProcessing;

  const handleSubmitOrder = useCallback(async () => {
    if (!canSubmit) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call - Create order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random success/failure
      if (Math.random() > 0.1) {
        // Success - payment completed
    onPay();
      } else {
        throw new Error('Ошибка при обработке платежа');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при оформлении заказа. Попробуйте ещё раз.');
    } finally {
    setIsProcessing(false);
    }
  }, [canSubmit, onPay]);

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa': return '💳 Visa';
      case 'mastercard': return '💳 Mastercard';
      case 'mir': return '💳 МИР';
      default: return '💳 Карта';
    }
  };

  return (
    <OverlayContainer title="Оформление заказа" onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-4">
          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="ga-body-medium text-sm text-error">{error}</p>
          </div>
              <button onClick={() => setError(null)} className="text-gray-400">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Store Pickup Section */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-4">САМОВЫВОЗ ИЗ МАГАЗИНА</h3>
            
            <div className="p-4 border-2 border-brand-green rounded-2xl bg-green-50/50">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Store size={24} className="text-brand-green" />
                </div>
                <div className="flex-1">
                  <p className="ga-body-medium text-sm text-black">{pickupStore.name}</p>
                  <p className="ga-body text-xs text-gray-500 mt-0.5">{pickupStore.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="ga-body text-[10px] text-gray-400">
                      🕐 {pickupStore.workHours}
                    </span>
                    <span className="ga-label text-[10px] text-brand-green bg-green-100 px-2 py-0.5 rounded-lg">
                      Сборка {pickupStore.pickupTime}
                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>

          {/* Payment Method Section */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-4">СПОСОБ ОПЛАТЫ</h3>
            
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-colors ${
                    selectedPayment?.id === method.id
                      ? 'border-brand-green bg-green-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio button */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment?.id === method.id ? 'border-brand-green' : 'border-gray-300'
                    }`}>
                      {selectedPayment?.id === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                      )}
          </div>
                    <span className="ga-body-medium text-sm">
                      {getCardIcon(method.brand)} •••• {method.last4}
                    </span>
          </div>
                  {method.isDefault && (
                    <span className="ga-label text-[9px] text-gray-400">По умолчанию</span>
                  )}
                </button>
              ))}
        </div>

            <button 
              onClick={onAddCard}
              className="w-full mt-3 py-3 ga-button text-xs text-brand-green border border-brand-green rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Добавить карту
            </button>
        </div>

          {/* Order Details Section */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-4">ДЕТАЛИ ЗАКАЗА</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="ga-body text-sm text-gray-500">Товары</span>
                <span className="ga-body-medium text-sm">{cartStats?.count || 0} шт</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="ga-body text-sm text-gray-500">Сумма товаров</span>
                <span className="ga-body-medium text-sm">₽{subtotal}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="ga-body text-sm text-gray-500">Скидка по коду</span>
                  <span className="ga-body-medium text-sm text-brand-green">−₽{promoDiscount}</span>
        </div>
              )}
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="ga-title text-lg">ИТОГО К ОПЛАТЕ</span>
                  <span className="ga-price text-2xl text-brand-green">₽{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  agreedToTerms ? 'bg-brand-green border-brand-green' : 'border-gray-300'
                }`}
              >
                {agreedToTerms && <Check size={14} className="text-white" />}
              </button>
              <span className="ga-body text-xs text-gray-500 leading-relaxed">
                Я согласен(-а) с{' '}
                <span className="text-brand-green underline">условиями обслуживания</span>
                {' '}и{' '}
                <span className="text-brand-green underline">политикой обработки персональных данных</span>
              </span>
            </label>
          </div>
        </div>
        </div>

      {/* Fixed bottom button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={handleSubmitOrder}
          disabled={!canSubmit}
          loading={isProcessing}
          fullWidth
          size="lg"
        >
          {!isProcessing && `ПОДТВЕРДИТЬ И ОПЛАТИТЬ ₽${total}`}
        </Button>
        {!agreedToTerms && !isProcessing && (
          <p className="ga-body text-xs text-center text-gray-400 mt-2">
            Примите условия для продолжения
          </p>
        )}
      </div>
    </OverlayContainer>
  );
};

/**
 * Orders List / History overlay - Full implementation
 */
export const HistoryOverlay = ({ onClose, onRepeatOrder, onStartShopping, onTrackOrder }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock orders data
  const allOrders = [
    {
      id: 'order_001',
      number: '1234',
      status: 'delivered',
      statusLabel: 'Доставлен',
      statusIcon: CheckCircle2,
      statusColor: 'text-green-500',
      statusBg: 'bg-green-50',
      createdAt: '15 января 2026, 18:30',
      itemsCount: 3,
      total: 379.96,
      items: 'Йогурт, Молоко, Хлеб',
      address: 'ул. Тверская, 8, кв. 5',
      store: 'Магнит Экстра',
      courier: null,
    },
    {
      id: 'order_002',
      number: '1233',
      status: 'in_transit',
      statusLabel: 'В пути',
      statusIcon: Truck,
      statusColor: 'text-blue-500',
      statusBg: 'bg-blue-50',
      createdAt: '14 января 2026, 15:20',
      itemsCount: 2,
      total: 199.98,
      items: 'Сыр, Колбаса',
      address: 'ул. Арбат, 15, кв. 10',
      store: 'Магнит',
      courier: {
        name: 'Иван',
        phone: '+7 985 123-45-67',
      },
    },
    {
      id: 'order_003',
      number: '1232',
      status: 'pending',
      statusLabel: 'В ожидании',
      statusIcon: Clock,
      statusColor: 'text-orange-500',
      statusBg: 'bg-orange-50',
      createdAt: '13 января 2026, 12:00',
      itemsCount: 1,
      total: 89.99,
      items: 'Торт Медовик',
      address: 'ул. Пушкина, 10, кв. 5',
      store: 'Магнит',
      courier: null,
    },
    {
      id: 'order_004',
      number: '1231',
      status: 'cancelled',
      statusLabel: 'Отменён',
      statusIcon: XCircle,
      statusColor: 'text-red-500',
      statusBg: 'bg-red-50',
      createdAt: '12 января 2026, 10:15',
      itemsCount: 4,
      total: 450.00,
      items: 'Мясо, Овощи, Фрукты',
      address: 'ул. Ленина, 25, кв. 8',
      store: 'Магнит Семейный',
      courier: null,
    },
  ];

  // Filter orders based on active tab
  const filteredOrders = allOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'in_transit', 'ready'].includes(order.status);
    if (activeTab === 'history') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Все' },
    { id: 'active', label: 'Активные' },
    { id: 'history', label: 'История' },
  ];

  const handleRepeat = useCallback(async (orderId) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onRepeatOrder?.(orderId);
  }, [onRepeatOrder]);

  return (
    <OverlayContainer title="Мои заказы" onClose={onClose}>
      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl ga-button text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = order.statusIcon;
              return (
        <div
          key={order.id}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
                >
                  {/* Header: Order number & Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="ga-title text-base">Заказ #{order.number}</h4>
                      <p className="ga-body text-xs text-gray-400 mt-0.5">{order.createdAt}</p>
            </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${order.statusBg}`}>
                      <StatusIcon size={14} className={order.statusColor} />
                      <span className={`ga-label text-[10px] ${order.statusColor}`}>
                        {order.statusLabel}
                      </span>
          </div>
        </div>

                  {/* Items & Total */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="ga-body text-sm text-gray-500">
                      {order.itemsCount} товар{order.itemsCount > 1 ? (order.itemsCount < 5 ? 'а' : 'ов') : ''}
                    </p>
                    <p className="ga-price text-lg text-brand-green">₽{order.total}</p>
                  </div>

                  {/* Store & Address */}
                  <div className="flex items-start gap-2 mb-3 p-3 bg-gray-50 rounded-xl">
                    <Store size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="ga-body-medium text-xs text-black">{order.store}</p>
                      <p className="ga-body text-xs text-gray-400">{order.address}</p>
                    </div>
                  </div>

                  {/* Courier info (for in_transit orders) */}
                  {order.courier && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="ga-body-medium text-xs">Курьер: {order.courier.name}</p>
                          <p className="ga-body text-[10px] text-gray-400">{order.courier.phone}</p>
                        </div>
                      </div>
                      <a
                        href={`tel:${order.courier.phone}`}
                        className="p-2 bg-blue-100 rounded-xl"
                      >
                        <Phone size={16} className="text-blue-500" />
                      </a>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl ga-button text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      <Eye size={14} />
                      Просмотреть
                    </button>
                    
                    {order.status === 'in_transit' ? (
                      <button
                        onClick={() => onTrackOrder?.(order)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 text-white rounded-xl ga-button text-xs hover:bg-blue-600 transition-colors"
                      >
                        <Navigation size={14} />
                        Отследить
                      </button>
                    ) : order.status === 'delivered' ? (
                      <button
                        onClick={() => handleRepeat(order.id)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-green text-white rounded-xl ga-button text-xs hover:bg-brand-green/90 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw size={14} />
                        Повторить
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Load more button (mock) */}
            {filteredOrders.length >= 4 && (
              <button className="w-full py-3 ga-button text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Загрузить ещё
              </button>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h3 className="ga-title text-xl text-center mb-2">Нет заказов</h3>
            <p className="ga-body text-sm text-gray-400 text-center mb-8">
              {activeTab === 'active' 
                ? 'У вас нет активных заказов'
                : activeTab === 'history'
                ? 'История заказов пуста'
                : 'Начните покупать, чтобы увидеть свои заказы здесь'
              }
            </p>
            {activeTab === 'all' && (
              <Button
                onClick={onStartShopping}
                variant="primary"
                size="md"
              >
                Начать покупки
              </Button>
            )}
          </div>
        )}
    </div>
  </OverlayContainer>
);
};

/**
 * Promotions & Deals overlay - Full implementation
 */
export const PromotionsOverlay = ({ onClose, onApplyPromo }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPromos, setSavedPromos] = useState(['promo_002', 'promo_004']);
  const [copiedCode, setCopiedCode] = useState(null);

  // Mock promotions data
  const allPromotions = [
    {
      id: 'promo_001',
      code: 'MILK70',
      title: 'FLASH SALE',
      description: 'Скидка 70% на молочное!',
      discountType: 'percentage',
      discountValue: 70,
      maxDiscount: 2000,
      minPurchase: 500,
      category: 'flash_sale',
      expiresIn: '2 часа 30 мин',
      isActive: true,
      userCanUse: true,
      icon: '🔥',
      iconBg: 'bg-red-500',
    },
    {
      id: 'promo_002',
      code: 'WELCOME500',
      title: 'Новым клиентам',
      description: 'Скидка 500 ₽ на первый заказ',
      discountType: 'fixed',
      discountValue: 500,
      maxDiscount: 500,
      minPurchase: 1500,
      category: 'new_customer',
      expiresIn: '30 дней',
      isActive: true,
      userCanUse: true,
      icon: '🎁',
      iconBg: 'bg-orange-500',
    },
    {
      id: 'promo_003',
      code: 'VIP15',
      title: 'VIP Предложение',
      description: 'Скидка 15% на всё!',
      discountType: 'percentage',
      discountValue: 15,
      maxDiscount: 3000,
      minPurchase: 0,
      category: 'vip',
      expiresIn: 'Постоянно',
      isActive: true,
      userCanUse: false,
      icon: '👑',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'promo_004',
      code: 'NEWYEAR40',
      title: 'Сезонное предложение',
      description: 'Скидка 40% на всё!',
      discountType: 'percentage',
      discountValue: 40,
      maxDiscount: 5000,
      minPurchase: 1000,
      category: 'seasonal',
      expiresIn: '5 дней',
      isActive: true,
      userCanUse: true,
      icon: '🌲',
      iconBg: 'bg-brand-green',
    },
    {
      id: 'promo_005',
      code: 'ROBIN10',
      title: 'Скидка Robin Food',
      description: 'Скидка 10% на все товары',
      discountType: 'percentage',
      discountValue: 10,
      maxDiscount: 1000,
      minPurchase: 300,
      category: 'active',
      expiresIn: '14 дней',
      isActive: true,
      userCanUse: true,
      icon: '🦅',
      iconBg: 'bg-black',
    },
  ];

  const tabs = [
    { id: 'all', label: 'Все' },
    { id: 'active', label: 'Активные' },
    { id: 'flash_sale', label: 'Flash' },
    { id: 'seasonal', label: 'Сезон' },
    { id: 'vip', label: 'VIP' },
  ];

  // Filter promotions
  const filteredPromotions = allPromotions.filter(promo => {
    const matchesTab = activeTab === 'all' || promo.category === activeTab || 
      (activeTab === 'active' && promo.isActive && promo.userCanUse);
    const matchesSearch = !searchQuery || 
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const handleToggleSave = useCallback((promoId) => {
    setSavedPromos(prev => 
      prev.includes(promoId) 
        ? prev.filter(id => id !== promoId)
        : [...prev, promoId]
    );
  }, []);

  const handleApply = useCallback((code) => {
    onApplyPromo?.(code);
  }, [onApplyPromo]);

  return (
    <OverlayContainer title="Промокоды и скидки" onClose={onClose}>
      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl ga-button text-xs whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            placeholder="🔍 Введите промокод..."
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Promotions list */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="space-y-4">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white p-5 rounded-3xl border shadow-sm ${
                !promo.userCanUse ? 'border-gray-200 opacity-70' : 'border-gray-100'
              }`}
            >
              {/* Header with icon and title */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${promo.iconBg} rounded-xl flex items-center justify-center text-lg`}>
                    {promo.icon}
                  </div>
                  <div>
                    <h4 className="ga-title text-sm">{promo.title}</h4>
                    <p className="ga-body text-xs text-gray-500 mt-0.5">{promo.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSave(promo.id)}
                  className="p-2"
                >
                  <Heart
                    size={20}
                    className={savedPromos.includes(promo.id) ? 'text-error fill-error' : 'text-gray-300'}
                  />
                </button>
              </div>

              {/* Promo code */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                <code className="ga-price text-lg tracking-wider flex-1">{promo.code}</code>
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className={`px-3 py-1.5 rounded-lg ga-button text-[10px] transition-colors ${
                    copiedCode === promo.code
                      ? 'bg-brand-green text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {copiedCode === promo.code ? '✓ Скопировано' : 'Копировать'}
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="ga-price text-base text-brand-green">
                    {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `-${promo.discountValue} ₽`}
                  </span>
                  {promo.maxDiscount > 0 && (
                    <span className="ga-body text-[10px] text-gray-400">
                      до {promo.maxDiscount} ₽
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`ga-body text-xs ${
                    promo.expiresIn.includes('час') ? 'text-error' : 'text-gray-400'
                  }`}>
                    ⏱️ {promo.expiresIn}
                  </span>
                </div>
              </div>

              {/* Min purchase */}
              {promo.minPurchase > 0 && (
                <p className="ga-body text-[10px] text-gray-400 mb-3">
                  На товары от {promo.minPurchase} ₽
                </p>
              )}

              {/* Status & Action */}
              <div className="flex items-center gap-2">
                {promo.userCanUse ? (
                  <>
                    <span className="ga-label text-[9px] text-brand-green bg-green-50 px-2 py-1 rounded-lg">
                      ✓ Доступно
                    </span>
                    <button
                      onClick={() => handleApply(promo.code)}
                      className="flex-1 py-2.5 bg-brand-green text-white rounded-xl ga-button text-xs hover:bg-brand-green/90 transition-colors"
                    >
                      Применить к заказу
                    </button>
                  </>
                ) : (
                  <>
                    <span className="ga-label text-[9px] text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                      🔒 Недоступно
                    </span>
                    <button
                      className="flex-1 py-2.5 bg-gray-200 text-gray-500 rounded-xl ga-button text-xs"
                    >
                      {promo.category === 'vip' ? 'Узнать о VIP' : 'Недоступно'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <p className="ga-body text-gray-400">Промокоды не найдены</p>
            </div>
          )}
        </div>

        {/* Saved promos section */}
        {savedPromos.length > 0 && (
          <div className="mt-8">
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">
              ⭐ МОИ СОХРАНЁННЫЕ ({savedPromos.length})
            </h3>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2">
              {allPromotions
                .filter(p => savedPromos.includes(p.id))
                .map(promo => (
                  <div key={promo.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{promo.icon}</span>
                      <code className="ga-body-medium text-sm">{promo.code}</code>
                      <span className="ga-price text-xs text-brand-green">
                        {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `-${promo.discountValue}₽`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleSave(promo.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  </OverlayContainer>
);
};

/**
 * Reviews overlay - Full implementation
 */
export const ReviewsOverlay = ({ product, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState({});

  // Mock rating stats
  const ratingStats = {
    average: product?.rating || 4.5,
    total: product?.reviewsCount || 128,
    distribution: { 5: 67, 4: 18, 3: 8, 2: 4, 1: 3 },
  };

  // Mock reviews data
  const allReviews = [
    {
      id: 'review_001',
      author: 'Иван П.',
      avatar: null,
      rating: 5,
      date: '10 января 2026',
      text: 'Отличный товар! Очень свежий и вкусный. Рекомендую всем! Буду заказывать ещё.',
      images: [],
      helpful: 32,
      notHelpful: 2,
    },
    {
      id: 'review_002',
      author: 'Мария К.',
      avatar: null,
      rating: 4,
      date: '8 января 2026',
      text: 'Хороший товар, но немного дороговато. В целом качество на высоте, упаковка аккуратная.',
      images: [],
      helpful: 15,
      notHelpful: 1,
    },
    {
      id: 'review_003',
      author: 'Алексей С.',
      avatar: null,
      rating: 5,
      date: '5 января 2026',
      text: 'Превосходное качество! Заказываю уже третий раз. Всегда свежий и вкусный.',
      images: [],
      helpful: 8,
      notHelpful: 0,
    },
    {
      id: 'review_004',
      author: 'Елена В.',
      avatar: null,
      rating: 3,
      date: '3 января 2026',
      text: 'Средний товар. Ожидала лучшего за эту цену. Не плохо, но и не восторг.',
      images: [],
      helpful: 5,
      notHelpful: 3,
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'Все' },
    { id: '5', label: '5★' },
    { id: '4', label: '4★' },
    { id: '3', label: '3★' },
    { id: '2', label: '2★' },
    { id: '1', label: '1★' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Новые' },
    { id: 'helpful', label: 'Полезные' },
    { id: 'rating_high', label: 'Высокий рейтинг' },
  ];

  // Filter reviews
  const filteredReviews = allReviews.filter(review => 
    activeFilter === 'all' || review.rating === parseInt(activeFilter)
  );

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating_high') return b.rating - a.rating;
    return 0; // newest - keep original order
  });

  const handleVote = useCallback((reviewId, isHelpful) => {
    setUserVotes(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === (isHelpful ? 'up' : 'down') ? null : (isHelpful ? 'up' : 'down')
    }));
  }, []);

  const handleSubmitReview = useCallback(async () => {
    if (!newReview.text.trim()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowWriteReview(false);
    setNewReview({ rating: 5, text: '' });
  }, [newReview]);

  const renderStars = (rating, size = 14, interactive = false, onChange = null) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={size}
            className={star <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <OverlayContainer title={`Отзывы (${ratingStats.total})`} onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Rating summary */}
        <div className="bg-white p-5 m-4 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="ga-price text-4xl text-black">{ratingStats.average}</p>
              <p className="ga-body text-xs text-gray-400">из 5</p>
            </div>
            <div className="flex-1">
              {renderStars(Math.round(ratingStats.average), 20)}
              <p className="ga-body text-xs text-gray-400 mt-1">{ratingStats.total} отзывов</p>
            </div>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-2">
                <span className="ga-label text-[10px] w-6">{stars}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${ratingStats.distribution[stars]}%` }}
                  />
                </div>
                <span className="ga-body text-[10px] text-gray-400 w-8">{ratingStats.distribution[stars]}%</span>
              </div>
            ))}
          </div>

          {/* Write review button */}
          <button
            onClick={() => setShowWriteReview(true)}
            className="w-full mt-4 py-3 bg-brand-green text-white rounded-xl ga-button text-sm flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Написать отзыв
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 mb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-4 py-2 rounded-xl ga-button text-xs whitespace-nowrap transition-colors ${
                  activeFilter === option.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-3 py-1.5 rounded-lg ga-body text-xs transition-colors ${
                  sortBy === option.id
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div className="px-4 space-y-3">
          {sortedReviews.map(review => (
            <div key={review.id} className="bg-white p-4 rounded-2xl border border-gray-100">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center ga-label text-sm">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="ga-body-medium text-sm">{review.author}</p>
                    <p className="ga-body text-[10px] text-gray-400">{review.date}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Text */}
              <p className="ga-body text-sm text-gray-600 mb-3 leading-relaxed">
                {review.text}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(review.id, true)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    userVotes[review.id] === 'up' 
                      ? 'bg-brand-green/10 text-brand-green' 
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <ThumbsUp size={14} />
                  <span className="ga-body text-xs">{review.helpful + (userVotes[review.id] === 'up' ? 1 : 0)}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, false)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    userVotes[review.id] === 'down' 
                      ? 'bg-red-50 text-error' 
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <ThumbsDown size={14} />
                  <span className="ga-body text-xs">{review.notHelpful + (userVotes[review.id] === 'down' ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          ))}

          {sortedReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="ga-body text-gray-400">Нет отзывов с таким рейтингом</p>
            </div>
          )}
        </div>
      </div>

      {/* Write review modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className="bg-white w-full rounded-t-[40px] p-6 pb-10 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="ga-title text-lg">Написать отзыв</h3>
              <button onClick={() => setShowWriteReview(false)} className="p-2">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Star rating */}
            <div className="text-center mb-6">
              <p className="ga-label text-[10px] text-gray-400 mb-3">ВАША ОЦЕНКА</p>
              <div className="flex justify-center">
                {renderStars(newReview.rating, 32, true, (rating) => setNewReview({ ...newReview, rating }))}
              </div>
            </div>

            {/* Review text */}
            <div className="mb-4">
              <label className="ga-label text-[10px] text-gray-400 mb-2 block">ВАШ ОТЗЫВ</label>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Расскажите о вашем опыте..."
                rows={4}
                className="w-full p-4 bg-gray-50 rounded-2xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none"
              />
            </div>

            {/* Photo button */}
            <button className="flex items-center gap-2 text-brand-green ga-button text-xs mb-6">
              <Plus size={16} /> Добавить фото
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting || !newReview.text.trim()}
              className="w-full py-4 bg-brand-green text-white rounded-xl ga-button text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Отправить отзыв'
              )}
            </button>
          </div>
        </div>
      )}
    </OverlayContainer>
  );
};

/**
 * Edit Profile overlay - Full implementation
 */
export const EditProfileOverlay = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave?.({ ...formData, avatar: avatarPreview });
    setIsSaving(false);
  };

  const handlePhotoSelect = (type) => {
    setShowPhotoOptions(false);
    
    if (type === 'camera') {
      // In real app: open camera
      alert('Открытие камеры...');
    } else if (type === 'gallery') {
      // Simulate file picker - in real app use input[type=file]
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setAvatarPreview(ev.target?.result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else if (type === 'remove') {
      setAvatarPreview(null);
    }
  };

  const isChanged = 
    formData.firstName !== (user?.firstName || '') ||
    formData.lastName !== (user?.lastName || '') ||
    formData.email !== (user?.email || '') ||
    formData.phone !== (user?.phone || '') ||
    avatarPreview !== (user?.avatar || null);

  return (
    <OverlayContainer title="Редактировать профиль" onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center py-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-green text-white ga-title text-3xl">
                    {formData.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoOptions(true)}
                className="absolute bottom-0 right-0 p-3 bg-brand-green rounded-full border-3 border-white shadow-lg hover:bg-brand-green/90 transition-colors active:scale-90"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <button
              onClick={() => setShowPhotoOptions(true)}
              className="mt-3 ga-button text-sm text-brand-green"
            >
              Изменить фото
            </button>
          </div>

          {/* Form fields */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4">
            <h3 className="ga-label text-[10px] text-gray-400">ЛИЧНЫЕ ДАННЫЕ</h3>
            
            <div>
              <label className="ga-body text-xs text-gray-500 mb-1.5 block">Имя</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Введите имя"
                className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
            
            <div>
              <label className="ga-body text-xs text-gray-500 mb-1.5 block">Фамилия</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Введите фамилию"
                className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4">
            <h3 className="ga-label text-[10px] text-gray-400">КОНТАКТЫ</h3>
            
            <div>
              <label className="ga-body text-xs text-gray-500 mb-1.5 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
            
            <div>
              <label className="ga-body text-xs text-gray-500 mb-1.5 block">Телефон</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                />
              </div>
              <p className="mt-1.5 ga-body text-[10px] text-gray-400">
                Для изменения номера потребуется подтверждение по SMS
              </p>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isChanged || isSaving}
            className={`w-full py-4 rounded-2xl ga-button text-sm flex items-center justify-center gap-2 transition-colors ${
              isChanged && !isSaving
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Check size={18} />
                Сохранить изменения
              </>
            )}
          </button>
        </div>
      </div>

      {/* Photo options modal */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className="bg-white w-full rounded-t-[40px] p-6 pb-10 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="ga-title text-lg">Изменить фото</h3>
              <button onClick={() => setShowPhotoOptions(false)} className="p-2">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handlePhotoSelect('camera')}
                className="w-full p-4 flex items-center gap-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <Camera size={20} className="text-brand-green" />
                </div>
                <span className="ga-body-medium text-sm">Сделать фото</span>
              </button>
              
              <button
                onClick={() => handlePhotoSelect('gallery')}
                className="w-full p-4 flex items-center gap-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Image size={20} className="text-blue-500" />
                </div>
                <span className="ga-body-medium text-sm">Выбрать из галереи</span>
              </button>
              
              {avatarPreview && (
                <button
                  onClick={() => handlePhotoSelect('remove')}
                  className="w-full p-4 flex items-center gap-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Trash2 size={20} className="text-error" />
                  </div>
                  <span className="ga-body-medium text-sm text-error">Удалить фото</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </OverlayContainer>
  );
};

/**
 * My Addresses overlay - Full implementation
 */
export const AddressesOverlay = ({ onClose, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([
    { id: 'addr_1', title: 'Дом', address: 'ул. Тверская, 15, кв. 42', isDefault: true },
    { id: 'addr_2', title: 'Работа', address: 'Пресненская наб., 12, офис 301', isDefault: false },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const handleAddAddress = () => {
    if (!newAddress.title.trim() || !newAddress.address.trim()) return;
    
    const addr = {
      id: `addr_${Date.now()}`,
      title: newAddress.title,
      address: newAddress.address,
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, addr]);
    setNewAddress({ title: '', address: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // If deleted was default, make first one default
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const handleSetDefault = (id) => {
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setNewAddress({ title: addr.title, address: addr.address });
    setShowAddForm(true);
  };

  const handleSaveEdit = () => {
    if (!newAddress.title.trim() || !newAddress.address.trim()) return;
    
    setAddresses(prev =>
      prev.map(a =>
        a.id === editingId
          ? { ...a, title: newAddress.title, address: newAddress.address }
          : a
      )
    );
    setEditingId(null);
    setNewAddress({ title: '', address: '' });
    setShowAddForm(false);
  };

  return (
    <OverlayContainer title="Мои адреса" onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white p-4 rounded-2xl border transition-colors ${
                addr.isDefault ? 'border-brand-green bg-green-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  addr.isDefault ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="ga-body-medium text-sm">{addr.title}</h4>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-brand-green text-white text-[10px] ga-label rounded-full">
                        По умолчанию
                      </span>
                    )}
                  </div>
                  <p className="ga-body text-xs text-gray-500 mt-1">{addr.address}</p>
                  
                  <div className="flex gap-3 mt-3">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="ga-button text-xs text-brand-green"
                      >
                        Сделать основным
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      className="ga-button text-xs text-gray-500"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="ga-button text-xs text-error"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-gray-300" />
              </div>
              <p className="ga-body text-sm text-gray-400">Нет сохранённых адресов</p>
            </div>
          )}

          {/* Add/Edit form */}
          {showAddForm && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
              <h4 className="ga-label text-[10px] text-gray-400">
                {editingId ? 'РЕДАКТИРОВАТЬ АДРЕС' : 'НОВЫЙ АДРЕС'}
              </h4>
              <input
                type="text"
                value={newAddress.title}
                onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Название (напр. Дом, Работа)"
                className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
              <input
                type="text"
                value={newAddress.address}
                onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Полный адрес"
                className="w-full p-3 bg-gray-50 rounded-xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setNewAddress({ title: '', address: '' });
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl ga-button text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={editingId ? handleSaveEdit : handleAddAddress}
                  disabled={!newAddress.title.trim() || !newAddress.address.trim()}
                  className="flex-1 py-3 bg-brand-green text-white rounded-xl ga-button text-sm disabled:opacity-50"
                >
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </div>
          )}

          {/* Add button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl ga-button text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <Plus size={18} /> Добавить адрес
            </button>
          )}
        </div>
      </div>
    </OverlayContainer>
  );
};

/**
 * Payment Methods overlay - Full implementation
 */
export const PaymentOverlay = ({ onClose, onAddCard }) => {
  const [cards, setCards] = useState([
    { id: 'card_1', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 'card_2', brand: 'Mastercard', last4: '8888', expiry: '03/25', isDefault: false },
  ]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleSetDefault = (id) => {
    setCards(prev =>
      prev.map(c => ({ ...c, isDefault: c.id === id }))
    );
  };

  const handleDelete = (id) => {
    setCards(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length > 0 && !filtered.some(c => c.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    setShowDeleteConfirm(null);
  };

  const getCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            </div>
          </div>
        );
      case 'mir':
        return (
          <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-white text-[8px] font-bold">
            МИР
          </div>
        );
      default:
        return (
          <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
            <CreditCard size={16} className="text-gray-500" />
          </div>
        );
    }
  };

  return (
    <OverlayContainer title="Методы оплаты" onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-white p-4 rounded-2xl border transition-colors ${
                card.isDefault ? 'border-brand-green bg-green-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {getCardIcon(card.brand)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="ga-body-medium text-sm">
                      {card.brand} •••• {card.last4}
                    </h4>
                    {card.isDefault && (
                      <span className="px-2 py-0.5 bg-brand-green text-white text-[10px] ga-label rounded-full">
                        Основная
                      </span>
                    )}
                  </div>
                  <p className="ga-body text-xs text-gray-500 mt-0.5">
                    Действует до {card.expiry}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="ga-button text-xs text-brand-green"
                  >
                    Сделать основной
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(card.id)}
                  className="ga-button text-xs text-error"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-gray-300" />
              </div>
              <p className="ga-body text-sm text-gray-400">Нет сохранённых карт</p>
              <p className="ga-body text-xs text-gray-300 mt-1">
                Добавьте карту для быстрой оплаты
              </p>
            </div>
          )}

          {/* Add card button */}
          <button
            onClick={onAddCard}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl ga-button text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <Plus size={18} /> Добавить карту
          </button>

          {/* Payment info */}
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-brand-green" />
              <span className="ga-label text-[10px] text-gray-400">БЕЗОПАСНОСТЬ</span>
            </div>
            <p className="ga-body text-xs text-gray-500">
              Данные карт надёжно защищены и хранятся в зашифрованном виде. 
              Мы не сохраняем CVV-коды.
            </p>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-error" />
              </div>
              <h3 className="ga-title text-lg mb-2">Удалить карту?</h3>
              <p className="ga-body text-sm text-gray-500">
                Карта будет удалена из ваших методов оплаты
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl ga-button text-sm"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-error text-white rounded-xl ga-button text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </OverlayContainer>
  );
};

/**
 * Order Tracking overlay - Full implementation
 */
export const TrackingOverlay = ({ order, onClose, onCancel }) => {
  const [notifications, setNotifications] = useState(true);
  const [eta, setEta] = useState(5);
  const [distance, setDistance] = useState(0.7);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Mock courier data
  const courier = {
    name: 'Иван Сидоров',
    phone: '+7 985 123-45-67',
    rating: 4.8,
    vehicle: 'Toyota Camry, жёлтый',
    licensePlate: 'О 123 АБ 777',
  };

  // Simulate live tracking updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => Math.max(1, prev - 0.5));
      setDistance(prev => Math.max(0.1, prev - 0.05));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCall = () => {
    window.open(`tel:${courier.phone}`, '_self');
  };

  const handleMessage = () => {
    window.open(`https://wa.me/${courier.phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel?.();
  };

  return (
    <OverlayContainer title="Отслеживание заказа" onClose={onClose}>
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Map placeholder */}
        <div className="relative h-64 bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck size={32} className="text-brand-green" />
              </div>
              <p className="ga-body text-sm text-gray-500">Карта отслеживания</p>
              <p className="ga-body text-xs text-gray-400">Курьер в пути</p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="ga-label text-[10px]">LIVE</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* ETA & Distance */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-brand-green" />
                </div>
                <div>
                  <p className="ga-label text-[10px] text-gray-400">ПРИБЫТИЕ ЧЕРЕЗ</p>
                  <p className="ga-price text-2xl text-brand-green">{Math.round(eta)} мин</p>
                </div>
              </div>
              <div className="text-right">
                <p className="ga-label text-[10px] text-gray-400">РАССТОЯНИЕ</p>
                <p className="ga-body-medium text-lg">{distance.toFixed(1)} км</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-green rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(10, 100 - (eta / 10) * 100)}%` }}
              />
            </div>
          </div>

          {/* Courier info */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-4">КУРЬЕР</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center ga-title text-lg">
                {courier.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="ga-body-medium text-base">{courier.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={14} className="text-orange-400 fill-orange-400" />
                  <span className="ga-body text-sm text-gray-500">{courier.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-gray-400" />
                <span className="ga-body text-xs text-gray-500">{courier.vehicle}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={14} className="text-gray-400" />
                <span className="ga-body text-xs text-gray-500">{courier.licensePlate}</span>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleMessage}
                className="flex-1 py-3 bg-brand-green text-white rounded-xl ga-button text-sm flex items-center justify-center gap-2"
              >
                <Send size={16} /> Написать
              </button>
              <button
                onClick={handleCall}
                className="flex-1 py-3 border-2 border-brand-green text-brand-green rounded-xl ga-button text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Позвонить
              </button>
            </div>
          </div>

          {/* Order info */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">ИНФОРМАЦИЯ О ЗАКАЗЕ</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="ga-body text-sm">ул. Тверская, 8, кв. 5</span>
              </div>
              <div className="flex items-center gap-2">
                <Store size={14} className="text-gray-400" />
                <span className="ga-body text-sm">Магнит Экстра</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={14} className="text-gray-400" />
                <span className="ga-body text-sm">Заказ #{order?.number || '1233'}</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">НАСТРОЙКИ</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-400" />
                <span className="ga-body text-sm">Уведомления</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-brand-green' : 'bg-gray-200'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Cancel button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 border-2 border-error text-error rounded-xl ga-button text-sm flex items-center justify-center gap-2"
          >
            <XCircle size={16} /> Отменить заказ
          </button>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-error" />
              </div>
              <h3 className="ga-title text-lg mb-2">Отменить заказ?</h3>
              <p className="ga-body text-sm text-gray-500">
                Вы уверены, что хотите отменить заказ? Это действие нельзя отменить.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl ga-button text-sm"
              >
                Нет, оставить
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 bg-error text-white rounded-xl ga-button text-sm"
              >
                Да, отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </OverlayContainer>
  );
};

/**
 * Favorites overlay
 */
export const FavoritesOverlay = ({ favorites, onClose, onRemove, onProductClick }) => (
  <OverlayContainer title="Избранное" onClose={onClose}>
    <div className="p-6 overflow-y-auto pb-20">
      <div className="grid grid-cols-2 gap-5">
        {MASTER_CATALOG.filter((p) => favorites.includes(p.id)).map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex flex-col gap-2 cursor-pointer"
          >
            <div className="aspect-[3/4] rounded-[36px] overflow-hidden bg-gray-50 relative border border-gray-100">
              <img
                src={product.image}
                className="w-full h-full object-cover"
                alt={product.title}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(product.id);
                }}
                className="absolute top-3 right-3 p-2 bg-error rounded-full text-white shadow-lg"
              >
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
            <span className="ga-label text-[10px] truncate px-2">
              {product.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  </OverlayContainer>
);
