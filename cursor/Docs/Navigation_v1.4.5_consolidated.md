# Robin Food — Navigation v1.4.5 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.4.5 | 16.02.2026 | Consolidated | Robin Food Product Team |

**Scope v1.4.5:** Полная навигационная карта Buyer App (24 экрана) и Picker App (5 экранов) с учётом 8 новых фич из Snapshot v1.0 + Order History & Rating alignment + статусы ready/customer_arrived + flow выдачи заказа + SBPPaymentSheet (QR-flow СБП). **Патч v1.4.4:** Localization formats reference (Spec v1.4.4 sec 14), обновление cross-references. **Патч v1.4.5:** Version Matrix выровнена до IC v1.6.4, кросс-ссылки на Spec/API/DM/Settlement проверены.

**Зависимости:** Spec v1.4.4, API Contract v1.4.4, Data Model v1.4.10, Integration Contracts v1.6.4, BNPL Integration v1.2.2, Settlement v1.2.2

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026), Patch Snapshot v1.3 (16.02.2026), Snapshot решений (16.02.2026)

---

## Changelog v1.4.4 → v1.4.5

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Sec 10: Version Matrix — Integration Contracts v1.6.3 → **v1.6.4** (min v1.6.3). Все остальные зависимости подтверждены актуальными | §1.4 Version Matrix | METADATA |
| 2 | Кросс-ссылки на Spec v1.4.4, API Contract v1.4.4, Data Model v1.4.10, Settlement v1.2.2 — проверены, без расхождений | §1.4 Cross-ref audit | VERIFIED |

---

## Changelog v1.4.3 → v1.4.4

| # | Изменение | Patch Bundle Fix | Тип |
|---|-----------|-----------------|-----|
| 1 | Sec 3.4, 3.5: Price/date/weight display — ссылка на Spec v1.4.4 sec 14.3 (Localization formats) | Fix #9 | ADD REF |
| 2 | Sec 6: A11y — accessibilityLabel для сумм использует локализованный формат (`{amount} рублей`, Spec v1.4.4 sec 14) | Fix #9 | ALTER A11Y |
| 3 | All cross-refs: Spec v1.4.3 → v1.4.4, API Contract v1.4.3 → v1.4.4, DM v1.4.9 → v1.4.10, Settlement v1.2.1 → v1.2.2 | meta | ALTER REF |
| 4 | Sec 10: Version Matrix обновлена | meta | METADATA |

---

## Changelog v1.4.2 → v1.4.3

| # | Изменение | Патч Snapshot v1.2 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 1.1: NEW screen `SBPPaymentSheet` (#24) — bottom sheet с QR-кодом для оплаты через СБП | Патч #5 | NEW SCREEN |
| 2 | Sec 3.4: Provider → Screen mapping table (tinkoff → PaymentWebView, sbp → SBPPaymentSheet, BNPL → PaymentWebView) | Патч #5 | NEW TABLE |
| 3 | Sec 3.4: Checkout flow ветвление — `if sbp → SBPPaymentSheet`, `else → PaymentWebView` | Патч #5 | ALTER FLOW |
| 4 | Sec 3.4: SBPPaymentSheet — полное описание UX (QR, deep link, timer, WS states) | Патч #5 | NEW FLOW |
| 5 | Sec 6: A11y — SBPPaymentSheet: QR aria-label, кнопка «Открыть банк» — primary focus | Патч #5 | ALTER A11Y |
| 6 | Sec 10: Version Matrix обновлена (Spec v1.4.3, AC v1.4.3, DM v1.4.9, IC v1.6.3, Nav v1.4.3) | Патч v1.2 meta | METADATA |

---

## Changelog v1.4.1 → v1.4.2

| # | Изменение | Патч Snapshot v1.1 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 3.1: AuthOTPScreen — добавлена ошибка `CONSENT_REQUIRED` (400) для новых пользователей | Патч #1 | ADD ERROR HANDLING |
| 2 | Sec 3.5: OrderTrackingScreen — progress bar расширен: +`ready`, `customer_arrived`. Кнопка «Я на месте» при `status=ready` | Патч #3 | ALTER FLOW |
| 3 | Sec 3.5: OrderTrackingScreen — Chat tab доступен для записи в `ready`, `customer_arrived` | Патч #3 | ALTER LIFECYCLE |
| 4 | Sec 3.5: OrderHistoryScreen — фильтр «Активные» включает `ready`, `customer_arrived` | Патч #3 | ALTER FILTER |
| 5 | Sec 3.4: PaymentMethodScreen — добавлен СБП (`sbp`) | Патч #5 | ALTER ENUM |
| 6 | Sec 3.8: Picker Flow — `complete` → status `ready` (было `completed`); новый action `confirm-pickup` | Патч #3 | ALTER FLOW |
| 7 | Sec 3.8: Picker Chat — доступен для записи в `ready`, `customer_arrived` | Патч #3 | ALTER LIFECYCLE |
| 8 | Sec 4: Deep link `robinfood://order/{orderId}?action=arrived` | Патч #3 | NEW DEEP LINK |
| 9 | Sec 9: Push routing — новые push types: `order.ready`, `customer_arrived`, `order.completed` | Патч #3 | ALTER ROUTING |
| 10 | Sec 10: Version Matrix обновлена | Патч v1.1 meta | METADATA |

---

## Changelog v1.4.0 → v1.4.1

| # | Изменение | Патч Snapshot | Тип |
|---|-----------|--------------|-----|
| 1 | Sec 3.1: `Error: INVALID_CODE` → `Error: INVALID_OTP` | Патч #2 | FIX ERROR CODE |
| 2 | Sec 3.1: добавлена обработка `Error: OTP_EXPIRED` (410) → «OTP истёк. Запросить заново?» | Патч #3 | ADD ERROR HANDLING |
| 3 | Sec 3.5: Rating flow выровнен с API — единая шкала 1–5 + комментарий (было multi-criteria) | Патч #1 | FIX RATING FLOW |
| 4 | Sec 3.5: OrderHistoryScreen привязан к `GET /api/v1/orders` (sec 10.8 API Contract) | Патч #1 | ADD API REF |
| 5 | Sec 4: добавлен deep link `robinfood://orders` → OrderHistoryScreen | Патч #1 | NEW DEEP LINK |
| 6 | Sec 10: Version Matrix → Integration Contracts v1.6.1, BNPL v1.2.1, Settlement v1.2.1 | Патч #8 | METADATA |

---

## Changelog v1.3.1 → v1.4.0

| # | Изменение | Тип | Snapshot § |
|---|-----------|-----|-----------|
| 1 | +AuthPhoneScreen, +AuthOTPScreen — OTP flow | NEW SCREEN | §2 |
| 2 | +ProductDetailScreen — КБЖУ, описание, multi-photo, ★ | NEW SCREEN | §3 |
| 3 | +SearchScreen, +SearchResultsScreen — unified search | NEW SCREEN | §4 |
| 4 | +AddressEditScreen — создание/редактирование адреса | NEW SCREEN | §8 |
| 5 | +SmartAlertsScreen, +AlertDetailScreen — управление алертами | NEW SCREEN | §9 |
| 6 | FavoritesScreen — scope расширен (product + store) | UPDATED | §7 |
| 7 | ProfileScreen — scope расширен (delete account) | UPDATED | §6 |
| 8 | AddressScreen — scope расширен (CRUD, default) | UPDATED | §8 |
| 9 | OrderTrackingScreen — добавлен ChatView tab | UPDATED | §10 |
| 10 | SettingsScreen — добавлен DeleteAccountFlow | UPDATED | §6 |
| 11 | PickerOrderDetailScreen — добавлен ChatView tab | UPDATED | §10 |
| 12 | +Deep link: `robinfood://product/{productId}` | NEW DEEP LINK | §3 |
| 13 | +Deep link: `robinfood://order/{orderId}?tab=chat` | NEW DEEP LINK | §10 |
| 14 | Tab bar: +Search tab, Favorites переименовано | UPDATED | §4, §7 |

---

## 1. Screen Registry

### 1.1 Buyer App — 24 экрана (UPDATED v1.4.3: +1)

| # | Screen ID | Название | Версия | Описание |
|---|-----------|----------|--------|----------|
| 1 | `AuthPhoneScreen` | Ввод телефона | NEW v1.4.0 | Ввод номера + согласие ПД (152-ФЗ) |
| 2 | `AuthOTPScreen` | Ввод OTP | NEW v1.4.0, **UPD v1.4.2** | 6-значный код, 2 мин TTL, 3 попытки, resend. Ошибки: `INVALID_OTP`, `OTP_BLOCKED`, `OTP_EXPIRED` (410), `CONSENT_REQUIRED` (400) |
| 3 | `HomeScreen` | Главный экран | v1.3.1 | Карта магазинов / список, адрес, радиус |
| 4 | `StoreScreen` | Магазин | v1.3.1 | Детали магазина, категории, ★ избранное |
| 5 | `ProductListScreen` | Товары магазина | v1.3.1 | Список товаров, фильтры, сортировка, ★ |
| 6 | `ProductDetailScreen` | Карточка товара | NEW v1.4.0 | Фото (swipe), КБЖУ, бренд, описание, ★, корзина |
| 7 | `SearchScreen` | Поиск | NEW v1.4.0 | Поисковая строка, suggest (7, debounce 300ms) |
| 8 | `SearchResultsScreen` | Результаты поиска | NEW v1.4.0 | Секции: Products, Stores, Categories, ★ inline |
| 9 | `CartScreen` | Корзина | v1.3.1 → UPD | Server-side, группировка по магазинам, warnings |
| 10 | `PaymentMethodScreen` | Выбор оплаты | v1.3.1, **UPD v1.4.2** | Tinkoff / СБП / BNPL *(v1.4.2: +СБП)* |
| 11 | `OrderConfirmationScreen` | Подтверждение | v1.3.1 → UPD | N подзаказов, multistore summary |
| 12 | `PaymentWebView` | Оплата (WebView) | v1.3.1 | Tinkoff / BNPL redirect |
| 13 | `SBPPaymentSheet` | Оплата СБП | **NEW v1.4.3** | Bottom sheet: QR-код + deep link в банковское приложение + таймер 15 мин |
| 14 | `OrderTrackingScreen` | Статус заказа | v1.3.1 → **UPD v1.4.2** | Tabs: Статус / Состав / Чат. Progress: pending→confirmed→picking→ready→customer_arrived→completed. «Я на месте» при ready |
| 15 | `OrderDetailScreen` | Детали заказа | v1.3.1, **UPD v1.4.1** | Состав, суммы, `originalTotalAmount` strikethrough, отображение рейтинга |
| 16 | `OrderHistoryScreen` | История заказов | v1.3.1, **UPD v1.4.2** | Tabs: Активные (вкл. ready, customer_arrived) / Завершённые / Отменённые. API: `GET /orders` |
| 17 | `FavoritesScreen` | Избранное | v1.3.1 → UPD | Фильтр: Все / Товары / Магазины; batch delete |
| 18 | `ProfileScreen` | Профиль | v1.3.1 → UPD | fullName, телефон, статус удаления |
| 19 | `PaymentMethodsScreen` | Способы оплаты | v1.3.1 | CRUD карт |
| 20 | `AddressScreen` | Адреса | v1.3.1 → UPD | Список (max 5), default badge, CRUD |
| 21 | `AddressEditScreen` | Ред. адреса | NEW v1.4.0 | Yandex Geocoding suggest, label, is_default |
| 22 | `SettingsScreen` | Настройки | v1.3.1 → **UPD v1.4.2** | Уведомления, тема, Delete Account flow (active orders вкл. ready/customer_arrived) |
| 23 | `SmartAlertsScreen` | Smart Alerts | NEW v1.4.0 | Список алертов (max 20), история срабатываний |
| 24 | `AlertDetailScreen` | Настройка алерта | NEW v1.4.0 | Триггер, расписание, порог, вкл/выкл |

### 1.2 Picker App — 5 экранов

| # | Screen ID | Название | Версия | Описание |
|---|-----------|----------|--------|----------|
| 1 | `PickerOrderListScreen` | Список заказов | v1.3.1, **UPD v1.4.2** | Tabs: Новые / В сборке / Готовые / Выдача / Завершённые *(v1.4.2: «Готовые» = ready, «Выдача» = customer_arrived)* |
| 2 | `PickerOrderDetailScreen` | Детали заказа | v1.3.1 → **UPD v1.4.2** | Товары, weigh, replace, ChatView tab, confirm-pickup |
| 3 | `PickerScanScreen` | Сканирование QR | v1.3.1 | Камера, валидация, fallback ручной ввод |
| 4 | `PickerHistoryScreen` | История | v1.3.1 | Выполненные заказы, KPI |
| 5 | `PickerProfileScreen` | Профиль пикера | v1.3.1 | Данные, магазин, delete account |

---

## 2. Tab Bar

### 2.1 Buyer App — Bottom Navigation (5 tabs)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  🏠 Home │ 🔍 Search│ 🛒 Cart  │  ★ Favs  │ 👤 Profile│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| Tab | Screen | Badge |
|-----|--------|-------|
| Home | `HomeScreen` | — |
| Search | `SearchScreen` **(NEW)** | — |
| Cart | `CartScreen` | Items count (red dot) |
| Favorites | `FavoritesScreen` | — |
| Profile | `ProfileScreen` | Red dot if deletion pending |

**Изменения v1.4.0:**
- **Search tab** добавлен (был только inline в HomeScreen) [Snapshot §4]
- **Favorites** переименовано из «Избранное товары» → «Избранное» (product + store)
- **Profile** badge при pending deletion request

### 2.2 Picker App — Bottom Navigation (3 tabs)

```
┌──────────────┬──────────────┬──────────────┐
│  📋 Orders   │  📊 History  │  👤 Profile  │
└──────────────┴──────────────┴──────────────┘
```

| Tab | Screen | Badge |
|-----|--------|-------|
| Orders | `PickerOrderListScreen` | New orders count |
| History | `PickerHistoryScreen` | — |
| Profile | `PickerProfileScreen` | — |

---

## 3. Navigation Flows

### 3.1 Auth Flow (NEW v1.4.0, UPDATED v1.4.2 — Патч #1)

```
App Launch
├── IF has valid accessToken → HomeScreen
├── IF has valid refreshToken → silent refresh → HomeScreen
└── ELSE → AuthPhoneScreen
    │
    AuthPhoneScreen
    ├── Input: phone (+7 mask)
    ├── Checkbox: согласие на обработку ПД ✓ (required, 152-ФЗ)
    ├── Action: «Получить код» → POST /auth/send-otp
    ├── Error: RATE_LIMITED → «Подождите {retryAfter} сек»
    └── Success → AuthOTPScreen
        │
        AuthOTPScreen
        ├── Input: 6-digit code (auto-submit on 6th digit)
        ├── Timer: 2 мин countdown → resend enabled
        ├── Action: POST /auth/verify-otp
        ├── Error: INVALID_OTP → «Неверный код» (attempts 3→blocked)  ← v1.4.1: было INVALID_CODE
        ├── Error: OTP_BLOCKED → «Код заблокирован. Запросите новый»
        ├── Error: OTP_EXPIRED (410) → «OTP истёк. Запросить заново?»  ← v1.4.1: добавлено
        │   └── Action: «Да» → POST /auth/send-otp (resend)
        ├── Error: CONSENT_REQUIRED (400) → «Необходимо согласие на обработку ПД»  ← NEW v1.4.2 Патч #1
        │   └── Action: redirect → AuthPhoneScreen (checkbox unchecked state)
        ├── Error: NOT_INVITED (picker) → «Обратитесь к администратору»
        ├── Success (isNewUser=true) → register push token → HomeScreen + onboarding tooltip
        └── Success (isNewUser=false) → register push token → HomeScreen
```

> **v1.4.2 (Патч #2):** После успешного auth вызывается `POST /auth/register-push` для привязки push-токена к сессии. Повторно вызывается при каждом app launch и `onTokenRefresh`.

**Picker Auth:**
```
AuthPhoneScreen → AuthOTPScreen → register push token → PickerOrderListScreen
├── Success (role=picker, status=invited→active) → register push token → PickerOrderListScreen
├── Error: NOT_INVITED → блокирующий экран
└── Error: ACCOUNT_DELETED → «Аккаунт удалён»
```

### 3.2 Home & Catalog Flow

```
HomeScreen (Карта магазинов)
├── Address bar (top) → tap → AddressScreen
│   └── Приоритет: GPS → selected address → default address
├── Store pin / list item → StoreScreen
│   ├── Info: адрес, часы, расстояние, ★ toggle
│   ├── Categories grid → ProductListScreen (filtered)
│   └── «Все товары» → ProductListScreen
│       ├── Filters: категория, сортировка (price↑↓, name↑)
│       ├── ★ toggle per item (inline isFavorite)
│       └── Tap item → ProductDetailScreen (NEW v1.4.0)
│           ├── Image carousel (swipe, multi-photo)
│           ├── Name, brand, description
│           ├── Price: current_price, discount badge
│           ├── КБЖУ: kcal / proteins / fats / carbs per 100g
│           ├── Country of origin, weight (netto)
│           ├── ★ Favorite toggle
│           ├── Quantity selector (+/− или weight input для kg)
│           ├── «В корзину» → POST /cart/items (upsert)
│           └── Deep link: robinfood://product/{productId}
├── Radius slider / Radar button → filter stores
└── Notification bell → OrderHistoryScreen (if order push)
```

### 3.3 Search Flow (NEW v1.4.0)

```
SearchScreen (tab)
├── Search bar (auto-focus on tab tap)
├── Typing ≥2 chars → GET /search/suggest (debounce 300ms)
│   └── Suggestions list (max 7)
│       ├── Tap suggestion → SearchResultsScreen (pre-filled)
│       └── Keyboard «Search» → SearchResultsScreen
├── Recent searches (local storage, max 10)
│   └── Tap → SearchResultsScreen
└── Popular categories (optional, from API)

SearchResultsScreen
├── Sections: Products | Stores | Categories
├── Each section: horizontal scroll preview + «Показать все»
├── Product card: image, name, price, store, ★ isFavorite
├── Store card: name, address, distance, ★ isFavorite
├── Category card: name, icon
├── Tap product → ProductDetailScreen
├── Tap store → StoreScreen
├── Tap category → ProductListScreen (filtered by category)
├── searchMethod badge: «fulltext» | «trigram» (debug, hidden in prod)
└── Empty state: «Ничего не найдено. Попробуйте другой запрос»
```

### 3.4 Cart & Checkout Flow (UPDATED v1.4.4)

> **Форматы отображения (v1.4.4):** Все цены, веса, даты на экранах Cart, Checkout, OrderTracking отображаются согласно Spec v1.4.4, sec 14.3 (Localization Policy): цена — `{amount/100} ₽` с запятой-разделителем (`467,04 ₽`), вес — `{value} кг` / `{count} шт`, дата — `dd.MM.yyyy`, время — `HH:mm` (24h), timezone бизнес — MSK.

```
CartScreen (tab)
├── IF empty → empty state + «Перейти к покупкам»
├── IF has items:
│   ├── Grouped by store (sub-sections):
│   │   ├── Store header: name, subtotal
│   │   └── Items: image, name, qty, price, +/−, delete
│   ├── Warnings (yellow banner per item):
│   │   ├── ITEM_UNAVAILABLE → «Товар недоступен» + strikethrough
│   │   └── PRICE_CHANGED → «Цена изменилась: {old} → {new}»
│   ├── Total summary: N магазинов, M товаров, общая сумма
│   ├── «Очистить корзину» → confirm dialog → DELETE /cart
│   └── «Оформить заказ» →
│       │
│       ├── CHECK: active_orders + new_suborders ≤ 3
│       │   └── IF exceeds → «Максимум 3 активных заказа» (BR-CART-1)
│       │   └── active = pending, confirmed, picking, ready, customer_arrived  ← v1.4.2: расширено
│       │
│       ├── PaymentMethodScreen (UPDATED v1.4.2 — Патч #5)
│       │   ├── Saved methods (Tinkoff cards)
│       │   ├── СБП (NEW v1.4.2)                                              ← Патч #5
│       │   ├── BNPL (Яндекс Сплит / Долями)
│       │   │   └── Per sub-order minAmount check
│       │   └── «Добавить карту» → Tinkoff binding
│       │
│       ├── OrderConfirmationScreen (UPDATED)
│       │   ├── Summary per store:
│       │   │   ├── Store name, items count, subtotal
│       │   │   └── Hold timer badge: «15 мин на подтверждение»
│       │   ├── Total across all stores
│       │   ├── Payment method
│       │   └── «Подтвердить и оплатить» → POST /cart/checkout
│       │       ├── Creates N customer_order (one per store)
│       │       ├── Hold 15 min per sub-order
│       │       ├── Cart cleared
│       │       │
│       │       ├── Provider → Screen routing (NEW v1.4.3 — Патч #5):
│       │       │   ├── IF paymentUrl != null (tinkoff, BNPL) → PaymentWebView
│       │       │   │   └── → OrderTrackingScreen (after callback)
│       │       │   └── IF qrCodeUrl != null (sbp) → SBPPaymentSheet (NEW v1.4.3)
│       │       │       └── → OrderTrackingScreen (after WS confirmation)
│       │       │
│       │       └── Error states:
│       │           ├── ACTIVE_ORDERS_LIMIT → bottom sheet с объяснением
│       │           ├── BNPL_BELOW_MIN → «Минимум {min} ₽ для рассрочки»
│       │           └── PAYMENT_FAILED → retry / change method
```

**Provider → Screen mapping (NEW v1.4.3 — Патч #5):**

| Provider | Checkout Field | Screen | UX Flow |
|----------|---------------|--------|---------|
| tinkoff | `paymentUrl` | `PaymentWebView` | WebView → redirect → callback |
| sbp | `qrCodeUrl` | `SBPPaymentSheet` | Bottom sheet QR → deep link → WS confirmation |
| yandex_split | `paymentUrl` | `PaymentWebView` | WebView → BNPL form → callback |
| dolyame | `paymentUrl` | `PaymentWebView` | WebView → BNPL form → callback |

**SBPPaymentSheet (NEW v1.4.3 — Патч #5):**

```
SBPPaymentSheet (bottom sheet, modal)
├── Trigger: checkout response contains qrCodeUrl (paymentMethod = 'sbp')
│
├── Content:
│   ├── QR-код (rendered from qrCodeUrl)
│   ├── Текст: «Отсканируйте QR-код или нажмите кнопку для оплаты через СБП»
│   ├── Кнопка «Открыть приложение банка» → deep link qrCodeUrl
│   │   └── IF device has bank app → opens bank app
│   │   └── IF no bank app → fallback: «Установите банковское приложение» или QR scan
│   └── Таймер 15 мин (holdExpiresAt countdown)
│
├── States:
│   ├── Ожидание → QR + таймер (default state)
│   ├── WS `order.status_changed(confirmed)` → dismiss sheet → OrderTrackingScreen
│   ├── Таймер истёк (hold expired) → dismiss sheet → toast «Время оплаты истекло» → CartScreen
│   └── Свернут пользователем → оплата ждёт в фоне (WS слушает)
│       └── WS confirmed → push notification → tap → OrderTrackingScreen
│
├── Actions:
│   ├── Drag down → dismiss (payment still pending in background)
│   ├── «Отменить» → POST /orders/{id}/cancel → CartScreen
│   └── Background → WS keeps listening
│
└── A11y (WCAG 2.1 AA):
    ├── QR image: accessibilityLabel = «QR-код для оплаты через СБП. Сумма: {amount} рублей»
    ├── Кнопка «Открыть банк»: primary focus, accessibilityHint = «Откроет приложение банка для оплаты»
    ├── Таймер: accessibilityLiveRegion, announced every minute
    └── Bottom sheet: accessibilityRole = «dialog»
```

### 3.5 Order Tracking & History Flow (UPDATED v1.4.2)

> **Форматы отображения (v1.4.4):** Цены на экранах OrderTracking, OrderDetail, OrderHistory отображаются в формате `{amount/100} ₽` (e.g. `467,04 ₽`), веса — `{value} кг`, даты — `dd.MM.yyyy`, время — `HH:mm`. Полная таблица: Spec v1.4.4, sec 14.3.

```
OrderTrackingScreen (UPDATED v1.4.2 — Патч #3)
├── Tab bar: Статус | Состав | Чат
│
├── [Tab: Статус]
│   ├── Progress bar: pending → confirmed → picking → ready → customer_arrived → completed
│   │                                                  ↑ NEW v1.4.2 ↑
│   ├── Store info: name, address, «Маршрут» → Яндекс.Карты
│   ├── Hold timer (if pending): countdown 15 min
│   │
│   ├── «Я на месте» button (NEW v1.4.2 — Патч #3):
│   │   ├── Visible: status = 'ready'
│   │   ├── Action: POST /orders/{id}/arrived
│   │   ├── Success: status → 'customer_arrived', button disappears
│   │   ├── Push → picker: «Покупатель на месте»
│   │   └── Deep link: robinfood://order/{orderId}?action=arrived
│   │
│   ├── Status-specific UI:
│   │   ├── pending: hold timer + «Отменить заказ»
│   │   ├── confirmed: «Ожидает пикера» + «Отменить заказ»
│   │   ├── picking: progress animation, picker name
│   │   ├── ready: «Заказ собран!» banner + «Я на месте» CTA         ← NEW v1.4.2
│   │   ├── customer_arrived: «Ожидаем выдачу» + spinner              ← NEW v1.4.2
│   │   ├── completed: success state → Rating bottom sheet
│   │   └── cancelled: reason banner + «В историю»
│   │
│   ├── «Отменить заказ» (if status ∈ {pending, confirmed})
│   │   └── NOT available in picking, ready, customer_arrived, completed  ← v1.4.2: уточнено
│   └── WS updates: order.status_changed → animate progress
│
├── [Tab: Состав]
│   ├── Items list with prices
│   ├── Strikethrough: originalTotalAmount → totalAmount (if differs)
│   ├── Weight items: «≈0.5 кг» → «0.48 кг» after weigh
│   └── WS updates: order.totals_updated → refresh prices
│
├── [Tab: Чат] (UPDATED v1.4.2 — Патч #3, BR-STATUS-1)
│   ├── IF status ∈ {confirmed, picking, ready, customer_arrived}: full chat  ← v1.4.2: +ready, customer_arrived
│   │   ├── Messages list (cursor pagination, ASC)
│   │   ├── Input: text field (1–1000 chars) + send button
│   │   ├── WS: chat.message → append message
│   │   ├── WS: chat.read → update read receipts ✓✓
│   │   └── Rate limit indicator (10 msg/min)
│   ├── IF status ∈ {completed, cancelled}: read-only
│   │   └── Messages list (scrollable, no input)
│   ├── IF status = pending: «Чат станет доступен после подтверждения»
│   └── Deep link: robinfood://order/{orderId}?tab=chat
│
└── Completion flow (UPDATED v1.4.1 — Патч #1):
    └── status=completed → Rating bottom sheet
        ├── ⭐ 1–5 единая оценка (star selector)
        ├── Комментарий (опционально, max 500 символов)
        ├── «Отправить» → POST /orders/{id}/rate
        ├── «Пропустить» → dismiss (можно оценить позже из OrderDetailScreen)
        └── Idempotent: повторная оценка обновляет существующую

OrderHistoryScreen (UPDATED v1.4.2 — Патч #3)
├── API: GET /api/v1/orders?status={filter}&cursor={cursor}
├── Filter tabs: Активные | Завершённые | Отменённые | Все
│   ├── «Активные» → status=active (pending|confirmed|picking|ready|customer_arrived)  ← v1.4.2: +ready, customer_arrived
│   ├── «Завершённые» → status=completed
│   ├── «Отменённые» → status=cancelled
│   └── «Все» → status=all (default)
├── Order card:
│   ├── storeName, status badge, totalAmount
│   │   └── Status badge colors:
│   │       ├── pending/confirmed/picking: 🔵 blue
│   │       ├── ready: 🟢 green «Готов»                                ← NEW v1.4.2
│   │       ├── customer_arrived: 🟢 green «Ожидает выдачи»            ← NEW v1.4.2
│   │       ├── completed: ⚪ gray
│   │       └── cancelled: 🔴 red
│   ├── itemsCount, createdAt
│   └── Tap →
│       ├── IF status ∈ {pending, confirmed, picking, ready, customer_arrived} → OrderTrackingScreen  ← v1.4.2: +ready, customer_arrived
│       └── IF status ∈ {completed, cancelled} → OrderDetailScreen
├── Cursor-based pagination (infinite scroll)
├── Deep link: robinfood://orders
└── Empty state: «Пока нет заказов»

OrderDetailScreen (UPDATED v1.4.1 — Патч #1)
├── Состав, суммы, originalTotalAmount strikethrough
├── IF completed AND has rating:
│   └── Отображается: ⭐ {rating} + комментарий
├── IF completed AND no rating:
│   └── CTA: «Оцените заказ» → Rating bottom sheet
└── Back → OrderHistoryScreen
```

### 3.6 Favorites Flow (UPDATED v1.4.0)

```
FavoritesScreen (tab)
├── Filter tabs: Все | Товары | Магазины
├── Product cards:
│   ├── Image, name, price, store name
│   ├── «В корзину» quick action
│   └── Swipe left → delete
├── Store cards:
│   ├── Name, address, distance
│   └── Tap → StoreScreen
├── Multi-select mode → batch delete (DELETE /favorites)
├── Empty state per type:
│   ├── Товары: «Добавьте товары в избранное ★»
│   └── Магазины: «Добавьте магазины в избранное ★»
└── Inline ★ sync: isFavorite updates across all screens
```

**★ Toggle — unified behavior:**
- Tap ★ on any screen → `POST /favorites` (idempotent upsert)
- Tap ★ again → `DELETE /favorites/{id}`
- Screens with ★: `StoreScreen`, `ProductListScreen`, `ProductDetailScreen`, `SearchResultsScreen`

### 3.7 Profile & Settings Flow (UPDATED v1.4.2)

```
ProfileScreen (tab)
├── User info: fullName (editable), phone (read-only)
├── Menu items:
│   ├── «Способы оплаты» → PaymentMethodsScreen
│   ├── «Адреса» → AddressScreen (UPDATED v1.4.0)
│   │   ├── Address list (max 5), default badge ⭐
│   │   ├── «Добавить адрес» → AddressEditScreen (NEW v1.4.0)
│   │   │   ├── Search input → Yandex Geocoding suggest (client-side)
│   │   │   ├── Map preview with pin
│   │   │   ├── Label: Дом / Работа / custom
│   │   │   ├── «Сделать основным» toggle (is_default)
│   │   │   └── «Сохранить» → POST /addresses
│   │   ├── Tap address → AddressEditScreen (edit mode) → PUT /addresses/{id}
│   │   ├── Swipe left → delete (auto-promote next if default)
│   │   └── Error: MAX_ADDRESSES (5) → «Удалите один из адресов»
│   ├── «Smart Alerts» → SmartAlertsScreen (NEW v1.4.0)
│   │   ├── Active alerts list (max 20)
│   │   │   ├── Card: product/category name, trigger icon, schedule badge
│   │   │   ├── Toggle: вкл/выкл per alert
│   │   │   ├── Tap → AlertDetailScreen (NEW v1.4.0)
│   │   │   │   ├── Entity: product или category
│   │   │   │   ├── Trigger: price_drop / back_in_stock / price_threshold
│   │   │   │   │   └── IF price_threshold → input: целевая цена
│   │   │   │   ├── Schedule: Утро / Вечер / Целый день
│   │   │   │   ├── History: последние срабатывания (GET /smart-alerts/{id}/history)
│   │   │   │   └── «Удалить» → DELETE /smart-alerts/{id}
│   │   │   └── Swipe left → delete
│   │   ├── «Создать алерт» → AlertDetailScreen (create mode)
│   │   │   └── Или из ProductDetailScreen: «🔔 Следить за ценой»
│   │   └── Error: MAX_ALERTS (20) → «Удалите один из алертов»
│   ├── «Настройки» → SettingsScreen (UPDATED v1.4.2)
│   │   ├── Push notifications toggles
│   │   ├── Theme (light/dark/system)
│   │   ├── «Удалить аккаунт» (UPDATED v1.4.2)
│   │   │   ├── IF has active orders → disabled + tooltip BR-DEL-1
│   │   │   │   └── active = pending, confirmed, picking, ready, customer_arrived  ← v1.4.2
│   │   │   ├── Tap → Confirmation dialog:
│   │   │   │   «Аккаунт будет удалён через 30 дней.
│   │   │   │    Вы можете отменить в любой момент.»
│   │   │   ├── Optional: reason input
│   │   │   ├── «Подтвердить» → POST /profile/delete
│   │   │   │   └── ProfileScreen shows: «Удаление: {scheduledAt}» + «Отменить»
│   │   │   └── «Отменить удаление» → POST /profile/delete/cancel
│   │   └── «Выйти» → POST /auth/logout → AuthPhoneScreen
│   └── «Заказы» → OrderHistoryScreen
└── Deletion pending banner (if applicable):
    └── Yellow bar: «Аккаунт будет удалён {date}» + [Отменить]
```

### 3.8 Picker Flow (UPDATED v1.4.2 — Патч #3)

```
Picker Auth:
AuthPhoneScreen → AuthOTPScreen → register push token → PickerOrderListScreen

PickerOrderListScreen (tab: Orders, UPDATED v1.4.2)
├── Tabs: Новые | В сборке | Готовые | Выдача | Завершённые
│   ├── «Новые» → status=confirmed (ожидают принятия)
│   ├── «В сборке» → status=picking (текущая сборка)
│   ├── «Готовые» → status=ready (собран, ожидает покупателя)          ← NEW v1.4.2
│   ├── «Выдача» → status=customer_arrived (покупатель на месте)       ← NEW v1.4.2
│   └── «Завершённые» → status=completed
├── Order card: #, store, items count, total, created_at
│   └── «Выдача» tab: green highlight 🟢 per card                     ← NEW v1.4.2
├── Tap → PickerOrderDetailScreen
│   ├── Tab bar: Товары | Чат
│   │
│   ├── [Tab: Товары]
│   │   ├── Items checklist
│   │   ├── Weight items: «Взвесить» → input actual_quantity
│   │   │   └── PUT /picker/orders/{id}/item/{itemId}/weigh
│   │   │   └── Warning: BNPL_BELOW_MIN (yellow badge)
│   │   ├── Unavailable: «Товар отсутствует» → replacement flow
│   │   │
│   │   ├── Actions by status:
│   │   │   ├── confirmed: «Принять» → PUT /picker/orders/{id}/accept
│   │   │   ├── picking: «Завершить сборку» → PUT /picker/orders/{id}/complete
│   │   │   │   ├── BR-PICK-4 guard: «Взвесьте все товары» (if unweighed)
│   │   │   │   ├── BR-BNPL-6: cancelled → alert with items for return
│   │   │   │   └── Success → status=ready, push to customer «Заказ собран»   ← v1.4.2: было completed
│   │   │   ├── ready: «Подтвердить выдачу» CTA                               ← NEW v1.4.2
│   │   │   │   └── POST /picker/orders/{id}/confirm-pickup
│   │   │   │       └── Success → status=completed, push «Заказ выдан»
│   │   │   └── customer_arrived: «Подтвердить выдачу» CTA (green)             ← NEW v1.4.2
│   │   │       └── POST /picker/orders/{id}/confirm-pickup
│   │   │           └── Success → status=completed, push «Заказ выдан»
│   │   │
│   │   └── QR Scan flow (status=ready/customer_arrived):
│   │       ├── «Сканировать QR» → PickerScanScreen
│   │       │   ├── Camera with frame
│   │       │   ├── Success → confirm pickup dialog
│   │       │   ├── Error 3x → manual lookup fallback
│   │       │   └── «Ввести вручную» → order number input
│   │       └── «Подтвердить выдачу» → POST /picker/orders/{id}/confirm-pickup
│   │
│   └── [Tab: Чат] (UPDATED v1.4.2 — Патч #3)
│       ├── Same as buyer ChatView (symmetric)
│       ├── Доступен для записи: confirmed, picking, ready, customer_arrived  ← v1.4.2: +ready, customer_arrived
│       ├── Read-only: completed, cancelled
│       ├── Push (app in background): «Покупатель написал»
│       └── Rate limit: 10 msg/min
│
├── Notification: customer «Я на месте» → green highlight 🟢 + sound alert   ← v1.4.2: уточнено
└── Batch mode (v1.2): select up to 3 → merged items view
```

---

## 4. Deep Links (UPDATED v1.4.2)

| Deep link | Destination | Версия | Fallback (not auth) |
|-----------|-------------|--------|---------------------|
| `robinfood://store/{storeId}` | StoreScreen | v1.3.1 | AuthPhoneScreen → redirect |
| `robinfood://order/{orderId}` | OrderTrackingScreen | v1.3.1 | AuthPhoneScreen → redirect |
| `robinfood://product/{productId}` | ProductDetailScreen | NEW v1.4.0 | AuthPhoneScreen → redirect |
| `robinfood://order/{orderId}?tab=chat` | OrderTrackingScreen → Chat tab | NEW v1.4.0 | AuthPhoneScreen → redirect |
| `robinfood://orders` | OrderHistoryScreen | NEW v1.4.1 | AuthPhoneScreen → redirect |
| `robinfood://order/{orderId}?action=arrived` | OrderTrackingScreen → trigger «Я на месте» | **NEW v1.4.2** | AuthPhoneScreen → redirect |

**Handling rules:**
- Не авторизован → сохранить deep link → AuthPhoneScreen → после auth redirect
- Объект не найден → «Страница не найдена» + кнопка «На главную»
- `?action=arrived` → если `status ≠ ready`, deep link открывает OrderTrackingScreen без trigger
- Picker deep links: не поддерживаются в MVP (только buyer app)

---

## 5. Offline Behavior

| Screen | Поведение | Описание |
|--------|-----------|----------|
| **Buyer (все)** | Blocking | Полноэкранный overlay «Нет подключения к интернету. Проверьте соединение» + retry button |
| **SBPPaymentSheet** | Blocking | QR-код не обновляется; при reconnect → WS проверяет текущий статус заказа *(NEW v1.4.3)* |
| **Picker (все)** | Local queue | Действия (weigh, replace, cancel, chat send) кэшируются локально |
| **Picker reconnect** | Auto-sync | Очередь воспроизводится в порядке FIFO. Конфликты → conflict resolution dialog |

---

## 6. Accessibility (A11y, UPDATED v1.4.4)

Все экраны соответствуют **WCAG 2.1/2.2 AA**:

- Touch targets ≥ 44×44 pt
- Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- All interactive elements: `accessibilityLabel` + `accessibilityHint`
- Focus order: logical top-to-bottom, left-to-right
- Screen reader announcements при WS-обновлениях (status change, new message)
- ★ Favorite toggle: `accessibilityRole="switch"`, state announced
- Chat messages: `accessibilityRole="text"`, sender + timestamp announced
- Rating stars: `accessibilityRole="adjustable"`, value announced (e.g. «3 из 5»)
- «Я на месте» button: `accessibilityLabel="Подтвердить прибытие"`, `accessibilityHint="Нажмите, чтобы сообщить пикеру"` *(NEW v1.4.2)*
- Status badges: `accessibilityLabel` включает human-readable status (e.g. «Готов к выдаче») *(NEW v1.4.2)*
- **SBPPaymentSheet** *(NEW v1.4.3)*:
  - QR image: `accessibilityLabel="QR-код для оплаты через СБП. Сумма: {amount} рублей"`
  - Кнопка «Открыть приложение банка»: primary focus, `accessibilityHint="Откроет приложение банка для оплаты"`
  - Таймер: `accessibilityLiveRegion`, announced every minute
  - Bottom sheet: `accessibilityRole="dialog"`
- **Localized amounts in a11y labels** *(NEW v1.4.4)*: Все `accessibilityLabel` со стоимостью используют формат `{amount} рублей` / `{amount} копеек` с правильным склонением (Spec v1.4.4, sec 14.3). Пример: `«Итого: четыреста шестьдесят семь рублей четыре копейки»` для screen reader.

---

## 7. Transition Animations (UPDATED v1.4.3)

| Transition | Type | Duration |
|------------|------|----------|
| Tab switch | Fade | 150ms |
| Push (→ detail) | Slide from right | 300ms (iOS native) |
| Modal (bottom sheet) | Slide from bottom | 250ms |
| ★ Toggle | Scale bounce | 200ms |
| Cart badge update | Scale pulse | 150ms |
| Chat message appear | Fade + slide up | 200ms |
| Progress bar (order status) | Animated fill | 500ms (ease-out) |
| Rating stars (select) | Scale bounce | 150ms |
| «Я на месте» → status change | Fade out button + confetti | 300ms *(NEW v1.4.2)* |
| Status badge color change | Cross-fade | 200ms *(NEW v1.4.2)* |
| SBPPaymentSheet appear | Slide from bottom (spring) | 300ms *(NEW v1.4.3)* |
| SBPPaymentSheet dismiss (success) | Fade out + scale down | 250ms *(NEW v1.4.3)* |
| SBP QR → bank app transition | System default | — *(NEW v1.4.3)* |

---

## 8. Error Screens & Empty States (UPDATED v1.4.3)

| Screen | Empty State | Error State |
|--------|-------------|-------------|
| HomeScreen | «Нет магазинов в этом районе. Измените адрес или радиус» | API error → retry banner |
| SearchResultsScreen | «Ничего не найдено. Попробуйте другой запрос» | — |
| CartScreen | «Корзина пуста. Начните покупки!» + CTA button | ITEM_UNAVAILABLE / PRICE_CHANGED warnings |
| FavoritesScreen | «Добавьте товары или магазины в избранное ★» | — |
| OrderHistoryScreen | «Пока нет заказов» | — |
| SmartAlertsScreen | «Настройте оповещения о скидках 🔔» | MAX_ALERTS → «Удалите один из алертов» |
| AddressScreen | «Добавьте адрес для удобного поиска магазинов» | MAX_ADDRESSES → «Удалите один из адресов» |
| Chat (pending) | «Чат станет доступен после подтверждения заказа» | — |
| Chat (ready/customer_arrived) | *(полный чат, не empty state)* | *(NEW v1.4.2)* |
| Chat (completed) | Read-only banner: «Заказ завершён. Чат доступен для просмотра» | — |
| SBPPaymentSheet | — | Таймер истёк → «Время оплаты истекло. Попробуйте снова» *(NEW v1.4.3)* |

---

## 9. Push Notification → Screen Routing (UPDATED v1.4.2)

| Push Type | Tap Action | Target Screen |
|-----------|------------|---------------|
| `order.status_changed` | Open order | OrderTrackingScreen (Status tab) |
| `order.ready` *(NEW v1.4.2)* | Open order | OrderTrackingScreen (Status tab) — «Я на месте» CTA visible |
| `customer_arrived` *(NEW v1.4.2)* | Open order | PickerOrderDetailScreen — green highlight |
| `order.completed` *(NEW v1.4.2)* | Open order | OrderTrackingScreen → Rating bottom sheet |
| `order.cancelled` (BNPL) | Open order | OrderTrackingScreen (Status tab) |
| `order.totals_updated` | Open order | OrderTrackingScreen (Состав tab) |
| `chat.message` | Open chat | OrderTrackingScreen (Chat tab) |
| `smart_alert.fired` | Open product | ProductDetailScreen |
| `hold_expired` | Open orders | OrderHistoryScreen |
| `deletion_reminder` | Open profile | ProfileScreen |
| `picker.new_order` | Open order | PickerOrderDetailScreen |
| `picker.customer_arrived` | Open order | PickerOrderDetailScreen (green 🟢) |
| `picker.chat_message` | Open chat | PickerOrderDetailScreen (Chat tab) |

---

## 10. Версионирование документов (UPDATED v1.4.5)

| Document | Version | Min Compatible |
|----------|---------|----------------|
| Navigation | **v1.4.5** | v1.4.4 |
| Spec | **v1.4.4** | v1.4.3 |
| API Contract | **v1.4.4** | v1.4.3 |
| Data Model | **v1.4.10** | v1.4.9 |
| Integration Contracts | **v1.6.4** | v1.6.3 |
| BNPL Integration | **v1.2.2** | v1.2.2 |
| Settlement | **v1.2.2** | v1.2.1 |

---

Navigation v1.4.5 (Consolidated) — 16.02.2026 — Robin Food Product Team
