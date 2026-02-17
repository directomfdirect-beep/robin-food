import React, { useState, useCallback, useMemo } from 'react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useStoreSelection } from '@/hooks/useStoreSelection';
import { DEFAULT_USER, VIEWS } from '@/data/constants';

// Screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SmsScreen,
  CardBindingScreen,
  SuccessScreen,
  HomeScreen,
  SearchScreen,
  SearchResultsScreen,
  CartScreen,
  FavoritesScreen,
  ProfileScreen,
  StoreScreen,
  ProductListScreen,
  ProductDetailScreen,
  PaymentMethodScreen,
  OrderConfirmationScreen,
  SBPPaymentSheet,
  OrderTrackingScreen,
  OrderHistoryScreen,
  OrderDetailScreen,
  SettingsScreen,
  PaymentMethodsScreen,
  AddressScreen,
  AddressEditScreen,
  SmartAlertsScreen,
  AlertDetailScreen,
} from '@/components/screens';

// Layout
import { BottomNav } from '@/components/layout';

// Modals (only bottom-sheet modals remain)
import { ShoppingModeModal, AutoPurchaseModal } from '@/components/modals';

// Overlays still used as lightweight sheets
import { NotificationsOverlay, SupportOverlay, PromotionsOverlay, EditProfileOverlay } from '@/components/overlays';

/**
 * Main Application Component — Navigation v1.4.5
 *
 * Navigation model:
 * - Auth flow: splash -> onboard -> login -> sms -> card_bind -> hub
 * - Hub: 5 tabs (home, search, cart, favorites, profile)
 * - Screen stack: push screens on top of tabs, back pops the stack
 */
export default function App() {
  // ───── Auth / View state ─────
  const [view, setView] = useState(VIEWS.SPLASH);
  const [activeTab, setActiveTab] = useState('home');
  const [phone, setPhone] = useState('');
  const [user] = useState(DEFAULT_USER);

  // ───── Screen stack (push screens from any tab) ─────
  const [screenStack, setScreenStack] = useState([]);

  const pushScreen = useCallback((screen) => {
    setScreenStack((prev) => [...prev, screen]);
  }, []);

  const popScreen = useCallback(() => {
    setScreenStack((prev) => prev.slice(0, -1));
  }, []);

  const popToRoot = useCallback(() => {
    setScreenStack([]);
  }, []);

  // ───── Lightweight overlay sheets ─────
  const [activeOverlay, setActiveOverlay] = useState(null);

  // ───── Notifications ─────
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [{ id: Date.now(), time: 'Только что', read: false, ...notification }, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  // ───── Shopping mode modal ─────
  const [showShoppingModeModal, setShowShoppingModeModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [pendingQuantity, setPendingQuantity] = useState(1);

  // ───── Auto-purchase subscription ─────
  const [showAutoSubscription, setShowAutoSubscription] = useState(false);
  const [checkoutCartSnapshot, setCheckoutCartSnapshot] = useState([]);

  // ───── Checkout flow ─────
  const [paymentMethod, setPaymentMethod] = useState(null);

  // ───── Custom hooks ─────
  const cart = useCart();
  const favorites = useFavorites([0, 5, 10]);
  const storeSelection = useStoreSelection();

  // ═══════════════════════════════════════════════════════
  //  AUTH HANDLERS
  // ═══════════════════════════════════════════════════════

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
  const handleSuccessContinue = () => { setView(VIEWS.HUB); setActiveTab('home'); };
  const handleLogout = () => { popToRoot(); setActiveOverlay(null); setView(VIEWS.LOGIN); };

  // ═══════════════════════════════════════════════════════
  //  RADAR + STORE NAVIGATION
  // ═══════════════════════════════════════════════════════

  const handleApplyRadar = useCallback(
    (center, radius) => {
      storeSelection.applyRadar(center, radius);
    },
    [storeSelection]
  );

  const handleSelectStore = useCallback(
    (storeId) => {
      const store = storeSelection.getStoreById(storeId);
      if (!store) return;
      const products = storeSelection.storeProducts[storeId] || [];
      pushScreen({ type: 'store', store, products, storeId });
    },
    [storeSelection, pushScreen]
  );

  const handleBrowseAll = useCallback(() => {
    pushScreen({ type: 'productList', storeId: null });
  }, [pushScreen]);

  // ═══════════════════════════════════════════════════════
  //  PRODUCT NAVIGATION
  // ═══════════════════════════════════════════════════════

  const handleProductClick = useCallback(
    (product) => {
      pushScreen({ type: 'productDetail', product });
    },
    [pushScreen]
  );

  const handleViewStoreFromProduct = useCallback(
    (storeId) => {
      const store = storeSelection.getStoreById(storeId);
      if (!store) return;
      const products = storeSelection.storeProducts[storeId] || [];
      pushScreen({ type: 'store', store, products, storeId });
    },
    [storeSelection, pushScreen]
  );

  // ═══════════════════════════════════════════════════════
  //  SEARCH
  // ═══════════════════════════════════════════════════════

  const handleSearch = useCallback(
    (query) => {
      pushScreen({ type: 'searchResults', query });
    },
    [pushScreen]
  );

  const handleCategorySelect = useCallback(
    (category) => {
      pushScreen({ type: 'searchResults', query: category });
    },
    [pushScreen]
  );

  // ═══════════════════════════════════════════════════════
  //  ADD TO CART (shopping mode logic)
  // ═══════════════════════════════════════════════════════

  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      const isCartEmpty = cart.items.length === 0;
      const hasRadar = storeSelection.radarApplied;
      const hasMode = storeSelection.shoppingMode !== null;

      if (isCartEmpty && hasRadar && !hasMode && product.storeId) {
        setPendingProduct(product);
        setPendingQuantity(quantity);
        setShowShoppingModeModal(true);
        return;
      }

      cart.addItem(product, quantity);
    },
    [cart, storeSelection]
  );

  const handleSingleStore = useCallback(() => {
    if (pendingProduct) {
      storeSelection.setMode('single', pendingProduct.storeId);
      cart.addItem(pendingProduct, pendingQuantity);
    }
    setShowShoppingModeModal(false);
    setPendingProduct(null);
    setPendingQuantity(1);
  }, [pendingProduct, pendingQuantity, storeSelection, cart]);

  const handleMultiStore = useCallback(() => {
    if (pendingProduct) {
      storeSelection.setMode('multi');
      cart.addItem(pendingProduct, pendingQuantity);
    }
    setShowShoppingModeModal(false);
    setPendingProduct(null);
    setPendingQuantity(1);
  }, [pendingProduct, pendingQuantity, storeSelection, cart]);

  const handleCloseShoppingMode = useCallback(() => {
    setShowShoppingModeModal(false);
    setPendingProduct(null);
    setPendingQuantity(1);
  }, []);

  // ═══════════════════════════════════════════════════════
  //  CHECKOUT FLOW: Cart -> PaymentMethod -> OrderConfirmation -> (SBP/Pay) -> OrderTracking
  // ═══════════════════════════════════════════════════════

  const handleStartCheckout = useCallback(() => {
    pushScreen({ type: 'paymentMethod' });
  }, [pushScreen]);

  const handleSelectPayment = useCallback(
    (method) => {
      setPaymentMethod(method);
      popScreen();
      pushScreen({ type: 'orderConfirmation', paymentMethod: method });
    },
    [popScreen, pushScreen]
  );

  const handleConfirmOrder = useCallback(() => {
    addNotification({
      type: 'order',
      title: 'Заказ оформлен!',
      message: `Заказ #${Math.floor(1000 + Math.random() * 9000)} успешно оформлен.`,
    });

    const snapshot = [...cart.items];
    const orderData = {
      number: `#${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      store: storeSelection.selectedStore || { name: 'Магнит', address: '' },
      items: snapshot,
      total: cart.stats.totalPrice,
    };

    setCheckoutCartSnapshot(snapshot);
    cart.clearCart();
    storeSelection.resetStoreSelection();
    popToRoot();

    if (paymentMethod === 'sbp') {
      pushScreen({ type: 'sbpPayment', amount: orderData.total, order: orderData });
    } else {
      setShowAutoSubscription(true);
      pushScreen({ type: 'orderTracking', order: orderData });
    }
  }, [cart, storeSelection, paymentMethod, addNotification, popToRoot, pushScreen]);

  const handleSBPSuccess = useCallback(
    (order) => {
      popScreen();
      pushScreen({ type: 'orderTracking', order });
      setShowAutoSubscription(true);
    },
    [popScreen, pushScreen]
  );

  const handleSubscriptionConfirm = () => {
    setShowAutoSubscription(false);
    setCheckoutCartSnapshot([]);
  };

  const handleSubscriptionSkip = () => {
    setShowAutoSubscription(false);
    setCheckoutCartSnapshot([]);
  };

  // ═══════════════════════════════════════════════════════
  //  PROFILE NAVIGATION
  // ═══════════════════════════════════════════════════════

  const handleProfileNav = useCallback(
    (dest) => {
      switch (dest) {
        case 'settings': pushScreen({ type: 'settings' }); break;
        case 'history': pushScreen({ type: 'orderHistory' }); break;
        case 'favorites': setActiveTab('favorites'); break;
        case 'addresses': pushScreen({ type: 'addresses' }); break;
        case 'payment': pushScreen({ type: 'paymentMethods' }); break;
        case 'smartAlerts': pushScreen({ type: 'smartAlerts' }); break;
        case 'promotions': setActiveOverlay('promotions'); break;
        case 'support': setActiveOverlay('support'); break;
        case 'editProfile': setActiveOverlay('editProfile'); break;
        default: break;
      }
    },
    [pushScreen]
  );

  // ═══════════════════════════════════════════════════════
  //  RENDER AUTH SCREENS
  // ═══════════════════════════════════════════════════════

  const renderAuth = () => {
    switch (view) {
      case VIEWS.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;
      case VIEWS.ONBOARD:
        return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
      case VIEWS.LOGIN:
        return <LoginScreen onSubmit={handleLoginSubmit} />;
      case VIEWS.SMS:
        return <SmsScreen phone={phone} onVerify={handleSmsVerify} />;
      case VIEWS.CARD_BIND:
        return <CardBindingScreen onBack={() => setView(VIEWS.SMS)} onSuccess={handleCardBindSuccess} onSkip={handleCardBindSkip} />;
      case VIEWS.SUCCESS:
        return <SuccessScreen onContinue={handleSuccessContinue} />;
      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════
  //  RENDER PUSH SCREEN (from stack)
  // ═══════════════════════════════════════════════════════

  const renderPushScreen = (screen) => {
    switch (screen.type) {
      case 'store':
        return (
          <StoreScreen
            store={screen.store}
            products={storeSelection.storeProducts[screen.storeId] || screen.products}
            favorites={favorites.favorites}
            onToggleFavorite={favorites.toggleFavorite}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onBack={popScreen}
            onViewAll={() => { popScreen(); handleBrowseAll(); }}
          />
        );

      case 'productList':
        return (
          <ProductListScreen
            favorites={favorites.favorites}
            onToggleFavorite={favorites.toggleFavorite}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            storeId={screen.storeId}
            shoppingMode={storeSelection.shoppingMode}
            selectedStore={storeSelection.selectedStore}
            storeProducts={storeSelection.storeProducts}
            availableProducts={storeSelection.availableProducts}
            radarApplied={storeSelection.radarApplied}
            storesInRadius={storeSelection.storesInRadius}
          />
        );

      case 'productDetail':
        return (
          <ProductDetailScreen
            product={screen.product}
            isFavorite={favorites.favorites.includes(screen.product?.id)}
            onToggleFavorite={favorites.toggleFavorite}
            onAddToCart={handleAddToCart}
            onBack={popScreen}
            onViewStore={handleViewStoreFromProduct}
          />
        );

      case 'searchResults':
        return (
          <SearchResultsScreen
            query={screen.query}
            availableProducts={storeSelection.radarApplied ? storeSelection.availableProducts : undefined}
            storesInRadius={storeSelection.storesInRadius}
            storeProducts={storeSelection.storeProducts}
            favorites={favorites.favorites}
            onToggleFavorite={favorites.toggleFavorite}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onStoreClick={handleSelectStore}
            onBack={popScreen}
          />
        );

      case 'paymentMethod':
        return (
          <PaymentMethodScreen
            onSelect={handleSelectPayment}
            onBack={popScreen}
            onAddCard={() => { popToRoot(); setView(VIEWS.CARD_BIND); }}
          />
        );

      case 'orderConfirmation':
        return (
          <OrderConfirmationScreen
            cartItems={cart.items}
            cartStats={cart.stats}
            paymentMethod={screen.paymentMethod || paymentMethod}
            shoppingMode={storeSelection.shoppingMode}
            onConfirm={handleConfirmOrder}
            onBack={popScreen}
            onChangePayment={() => { popScreen(); pushScreen({ type: 'paymentMethod' }); }}
          />
        );

      case 'sbpPayment':
        return (
          <SBPPaymentSheet
            amount={screen.amount}
            onSuccess={() => handleSBPSuccess(screen.order)}
            onCancel={popScreen}
            onClose={popScreen}
          />
        );

      case 'orderTracking':
        return (
          <OrderTrackingScreen
            order={screen.order}
            onBack={popScreen}
            onArrive={() => {}}
            onCancel={popScreen}
          />
        );

      case 'orderHistory':
        return (
          <OrderHistoryScreen
            onBack={popScreen}
            onOrderClick={(order) => {
              const isActive = ['pending', 'confirmed', 'picking', 'ready', 'customer_arrived'].includes(order.status);
              pushScreen({ type: isActive ? 'orderTracking' : 'orderDetail', order });
            }}
          />
        );

      case 'orderDetail':
        return (
          <OrderDetailScreen order={screen.order} onBack={popScreen} onRate={() => {}} />
        );

      case 'settings':
        return <SettingsScreen onBack={popScreen} onLogout={handleLogout} />;

      case 'paymentMethods':
        return <PaymentMethodsScreen onBack={popScreen} />;

      case 'addresses':
        return (
          <AddressScreen
            onBack={popScreen}
            onAdd={() => pushScreen({ type: 'addressEdit', address: null })}
            onEdit={(addr) => pushScreen({ type: 'addressEdit', address: addr })}
          />
        );

      case 'addressEdit':
        return (
          <AddressEditScreen
            address={screen.address}
            onSave={() => popScreen()}
            onBack={popScreen}
          />
        );

      case 'smartAlerts':
        return (
          <SmartAlertsScreen
            onBack={popScreen}
            onAlertClick={(alert) => pushScreen({ type: 'alertDetail', alert })}
            onAdd={() => pushScreen({ type: 'alertDetail', alert: null })}
          />
        );

      case 'alertDetail':
        return (
          <AlertDetailScreen
            alert={screen.alert}
            onSave={() => popScreen()}
            onBack={popScreen}
            onDelete={() => popScreen()}
          />
        );

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════
  //  RENDER HUB (5 tabs + screen stack)
  // ═══════════════════════════════════════════════════════

  const renderHub = () => {
    const topScreen = screenStack.length > 0 ? screenStack[screenStack.length - 1] : null;

    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Main content — either push screen or tab content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {topScreen ? (
            renderPushScreen(topScreen)
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  isActive={activeTab === 'home' && !activeOverlay && screenStack.length === 0}
                  onApplyRadar={handleApplyRadar}
                  onSelectStore={handleSelectStore}
                  onBrowseAll={handleBrowseAll}
                  storesInRadius={storeSelection.storesInRadius}
                  storeProducts={storeSelection.storeProducts}
                  radarApplied={storeSelection.radarApplied}
                />
              )}

              {activeTab === 'catalog' && (
                <ProductListScreen
                  favorites={favorites.favorites}
                  onToggleFavorite={favorites.toggleFavorite}
                  onProductClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                  shoppingMode={storeSelection.shoppingMode}
                  selectedStore={storeSelection.selectedStore}
                  storeProducts={storeSelection.storeProducts}
                  availableProducts={storeSelection.availableProducts}
                  radarApplied={storeSelection.radarApplied}
                  storesInRadius={storeSelection.storesInRadius}
                />
              )}

              {activeTab === 'cart' && (
                <CartScreen
                  items={cart.items}
                  stats={cart.stats}
                  onIncrement={cart.incrementItem}
                  onDecrement={cart.decrementItem}
                  onRemove={cart.removeItem}
                  onCheckout={handleStartCheckout}
                  onContinueShopping={() => { setActiveTab('home'); }}
                  shoppingMode={storeSelection.shoppingMode}
                />
              )}

              {activeTab === 'favorites' && (
                <FavoritesScreen
                  favorites={favorites.favorites}
                  onToggleFavorite={favorites.toggleFavorite}
                  onProductClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  favoritesCount={favorites.count}
                  onSettingsClick={() => handleProfileNav('settings')}
                  onHistoryClick={() => handleProfileNav('history')}
                  onFavoritesClick={() => handleProfileNav('favorites')}
                  onPromotionsClick={() => handleProfileNav('promotions')}
                  onSupportClick={() => handleProfileNav('support')}
                  onAddressesClick={() => handleProfileNav('addresses')}
                  onPaymentClick={() => handleProfileNav('payment')}
                  onEditProfileClick={() => handleProfileNav('editProfile')}
                  onChangePhoto={() => handleProfileNav('editProfile')}
                  onLogout={handleLogout}
                  onSmartAlertsClick={() => handleProfileNav('smartAlerts')}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom navigation — always visible in hub */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            popToRoot();
            setActiveTab(tab);
          }}
          cartCount={cart.stats.count}
        />
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  //  RENDER OVERLAYS (lightweight sheets that remain)
  // ═══════════════════════════════════════════════════════

  const renderOverlay = () => {
    switch (activeOverlay) {
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
      case 'promotions':
        return (
          <PromotionsOverlay
            onClose={() => setActiveOverlay(null)}
            onApplyPromo={() => { setActiveOverlay(null); setActiveTab('cart'); }}
          />
        );
      case 'editProfile':
        return (
          <EditProfileOverlay
            user={user}
            onClose={() => setActiveOverlay(null)}
            onSave={() => setActiveOverlay(null)}
          />
        );
      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════
  //  ROOT RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-hidden selection:bg-acid">
      {view === VIEWS.HUB ? renderHub() : renderAuth()}
      {renderOverlay()}

      {/* Shopping Mode Modal */}
      {showShoppingModeModal && pendingProduct && (
        <ShoppingModeModal
          store={pendingProduct.storeId ? storeSelection.getStoreById(pendingProduct.storeId) : null}
          onSingleStore={handleSingleStore}
          onMultiStore={handleMultiStore}
          onClose={handleCloseShoppingMode}
        />
      )}

      {/* Auto-purchase Subscription */}
      {showAutoSubscription && (
        <AutoPurchaseModal
          cartItems={checkoutCartSnapshot}
          onConfirm={handleSubscriptionConfirm}
          onSkip={handleSubscriptionSkip}
          onClose={handleSubscriptionSkip}
        />
      )}
    </div>
  );
}
