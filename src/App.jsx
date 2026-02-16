import React, { useState, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { DEFAULT_USER, VIEWS } from '@/data/constants';

// Screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SmsScreen,
  CardBindingScreen,
  SuccessScreen,
  CatalogTab,
  MapTab,
  CartTab,
  ProfileTab,
} from '@/components/screens';

// Layout
import { Header, BottomNav } from '@/components/layout';

// Modals & Overlays
import { ProductModal } from '@/components/modals';
import {
  SettingsOverlay,
  NotificationsOverlay,
  SupportOverlay,
  CheckoutOverlay,
  HistoryOverlay,
  PromotionsOverlay,
  ReviewsOverlay,
  TrackingOverlay,
  AddressesOverlay,
  PaymentOverlay,
  EditProfileOverlay,
  FavoritesOverlay,
} from '@/components/overlays';

/**
 * Main Application Component
 */
export default function App() {
  // Navigation state
  const [view, setView] = useState(VIEWS.SPLASH);
  const [activeTab, setActiveTab] = useState('map');
  const [activeOverlay, setActiveOverlay] = useState(null);

  // User state
  const [user] = useState(DEFAULT_USER);
  const [phone, setPhone] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState([]);


  // Add notification helper
  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now(),
      time: 'Только что',
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Product state
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Custom hooks
  const cart = useCart();
  const favorites = useFavorites([0, 5, 10]);

  // Navigation handlers
  const handleSplashComplete = () => setView(VIEWS.ONBOARD);
  const handleOnboardingComplete = () => setView(VIEWS.LOGIN);
  const handleOnboardingSkip = () => setView(VIEWS.LOGIN);

  const handleLoginSubmit = (phoneNumber) => {
    setPhone(phoneNumber);
    setView(VIEWS.SMS);
  };

  const handleSmsVerify = () => setView(VIEWS.CARD_BIND);
  
  const handleCardBindSuccess = () => setView(VIEWS.HUB);
  const handleCardBindSkip = () => setView(VIEWS.HUB);

  const handleCheckoutPay = () => {
    // Add order confirmation notification
    addNotification({
      type: 'order',
      title: 'Заказ оформлен!',
      message: `Заказ #${Math.floor(1000 + Math.random() * 9000)} успешно оформлен. Ожидайте готовности в магазине.`,
    });

    // Add estimated time notification
    setTimeout(() => {
      addNotification({
        type: 'delivery',
        title: 'Заказ готовится',
        message: 'Ваш заказ готовится к выдаче. Примерное время: 15-20 минут.',
      });
    }, 2000);

    setActiveOverlay(null);
    cart.clearCart();
    setView(VIEWS.SUCCESS);
  };

  const handleSuccessContinue = () => {
    setView(VIEWS.HUB);
    setActiveTab('catalog');
  };

  const handleLogout = () => {
    setActiveOverlay(null);
    setView(VIEWS.LOGIN);
  };

  // Product handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product, quantity) => {
    cart.addItem(product, quantity);
  };

  // Render current view
  const renderView = () => {
    switch (view) {
      case VIEWS.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;

      case VIEWS.ONBOARD:
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        );

      case VIEWS.LOGIN:
        return <LoginScreen onSubmit={handleLoginSubmit} />;

      case VIEWS.SMS:
        return <SmsScreen phone={phone} onVerify={handleSmsVerify} />;

      case VIEWS.CARD_BIND:
        return (
          <CardBindingScreen
            onBack={() => setView(VIEWS.SMS)}
            onSuccess={handleCardBindSuccess}
            onSkip={handleCardBindSkip}
          />
        );

      case VIEWS.SUCCESS:
        return <SuccessScreen onContinue={handleSuccessContinue} />;

      case VIEWS.HUB:
        return renderHub();

      default:
        return null;
    }
  };

  // Render main hub (tabs)
  const renderHub = () => (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header
        cartTotal={cart.stats.totalPrice}
        notificationCount={notifications.filter(n => !n.read).length}
        onNotificationsClick={() => setActiveOverlay('notifications')}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'catalog' && (
          <CatalogTab
            favorites={favorites.favorites}
            onToggleFavorite={favorites.toggleFavorite}
            onProductClick={handleProductClick}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            isActive={activeTab === 'map' && !activeOverlay}
            onSearchCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'cart' && (
          <CartTab
            items={cart.items}
            stats={cart.stats}
            onIncrement={cart.incrementItem}
            onDecrement={cart.decrementItem}
            onRemove={cart.removeItem}
            onCheckout={() => setActiveOverlay('checkout')}
            onContinueShopping={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            favoritesCount={favorites.count}
            onSettingsClick={() => setActiveOverlay('settings')}
            onHistoryClick={() => setActiveOverlay('history')}
            onFavoritesClick={() => setActiveOverlay('favorites')}
            onPromotionsClick={() => setActiveOverlay('promotions')}
            onSupportClick={() => setActiveOverlay('support')}
            onAddressesClick={() => setActiveOverlay('addresses')}
            onPaymentClick={() => setActiveOverlay('payment')}
            onEditProfileClick={() => setActiveOverlay('editProfile')}
            onChangePhoto={() => setActiveOverlay('editProfile')}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cart.stats.count}
      />
    </div>
  );

  // Render overlays
  const renderOverlay = () => {
    switch (activeOverlay) {
      case 'settings':
        return (
          <SettingsOverlay
            onClose={() => setActiveOverlay(null)}
            onLogout={handleLogout}
          />
        );

      case 'notifications':
        return (
          <NotificationsOverlay
            notifications={notifications}
            onClose={() => setActiveOverlay(null)}
            onClear={clearNotifications}
            onMarkRead={markNotificationRead}
          />
        );

      case 'support':
        return <SupportOverlay onClose={() => setActiveOverlay(null)} />;

      case 'checkout':
        return (
          <CheckoutOverlay
            cartItems={cart.items}
            cartStats={cart.stats}
            onClose={() => setActiveOverlay(null)}
            onPay={handleCheckoutPay}
            onAddCard={() => setView(VIEWS.CARD_BIND)}
          />
        );

      case 'history':
        return (
          <HistoryOverlay
            onClose={() => setActiveOverlay(null)}
            onRepeatOrder={(orderId) => {
              // Mock: add items from order to cart
              setActiveOverlay(null);
              setActiveTab('cart');
            }}
            onStartShopping={() => {
              setActiveOverlay(null);
              setActiveTab('catalog');
            }}
            onTrackOrder={(order) => {
              setActiveOverlay('tracking');
            }}
          />
        );

      case 'promotions':
        return (
          <PromotionsOverlay
            onClose={() => setActiveOverlay(null)}
            onApplyPromo={(code) => {
              setActiveOverlay(null);
              setActiveTab('cart');
              // Promo code will be applied via CartTab
            }}
          />
        );

      case 'reviews':
        return (
          <ReviewsOverlay
            product={selectedProduct}
            onClose={() => setActiveOverlay(null)}
          />
        );

      case 'addresses':
        return (
          <AddressesOverlay
            onClose={() => setActiveOverlay(null)}
            onSelectAddress={(addr) => {
              setActiveOverlay(null);
              // Handle address selection
            }}
          />
        );

      case 'payment':
        return (
          <PaymentOverlay
            onClose={() => setActiveOverlay(null)}
            onAddCard={() => {
              setActiveOverlay(null);
              setView(VIEWS.CARD_BIND);
            }}
          />
        );

      case 'editProfile':
        return (
          <EditProfileOverlay
            user={user}
            onClose={() => setActiveOverlay(null)}
            onSave={(updatedUser) => {
              // In real app: update user state
              setActiveOverlay(null);
            }}
          />
        );


      case 'changePhoto':
        return (
          <EditProfileOverlay
            user={user}
            onClose={() => setActiveOverlay(null)}
            onSave={(updatedUser) => {
              setActiveOverlay(null);
            }}
          />
        );

      case 'tracking':
        return (
          <TrackingOverlay
            order={{ number: '1233' }}
            onClose={() => setActiveOverlay(null)}
            onCancel={() => {
              setActiveOverlay(null);
              // Handle order cancellation
            }}
          />
        );

      case 'favorites':
        return (
          <FavoritesOverlay
            favorites={favorites.favorites}
            onClose={() => setActiveOverlay(null)}
            onRemove={favorites.removeFavorite}
            onProductClick={(product) => {
              setActiveOverlay(null);
              handleProductClick(product);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-hidden selection:bg-acid">
      {renderView()}
      {renderOverlay()}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onViewReviews={() => setActiveOverlay('reviews')}
        />
      )}
    </div>
  );
}
