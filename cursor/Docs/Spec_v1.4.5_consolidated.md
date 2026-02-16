# Robin Food — Specification v1.4.5 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.4.5 | 16.02.2026 | Consolidated | Robin Food Product Team |

**Scope v1.4.5:** Полная спецификация продукта — существующие бизнес-правила (BR-PICK-4, BR-BNPL-6, BR-PAY-5) + 9 фич (Auth, Catalog, Search, Cart, Profile/Delete, Favorites, Addresses, Smart Alerts, Chat) + Order History & Rating. Глобальная Rate Limit Policy. Push-провайдер: FCM primary. **Патчи Snapshot v1.1:** consentAccepted (#1), register-push + push_token (#2), статусы ready/customer_arrived (#3), sbp payment_provider (#5). **Патч Snapshot v1.2:** NFR (latency/throughput/infra/cache/SLA), ссылки на webhook (Tinkoff), полный WS-контракт, Admin API, image upload, СБП QR-flow, CRON monitoring. **Патч Snapshot v1.3:** Dispute API alignment (lineIds, re-dispute), новая секция Localization Policy, обновление Version Matrix. **Патч Snapshot v1.4.5:** Обновление Version Matrix до актуальных версий всех зависимостей, новая секция API Versioning Policy (sec 2.16), уточнение Security NFR (IP whitelist → config-driven).

**Зависимости:** Data Model v1.4.10, API Contract v1.4.4, Integration Contracts v1.6.4, BNPL Integration v1.2.2, Settlement v1.2.2, Navigation v1.4.4.

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026), Patch Snapshot v1.3 (16.02.2026), Patch Snapshot v1.4.5 (16.02.2026).

---

## Changelog v1.4.4 → v1.4.5

| # | Изменение | Патч Snapshot v1.4.5 | Тип |
|---|-----------|---------------------|-----|
| 1 | Sec 13: Version Matrix — обновлены все зависимости до актуальных версий: Navigation v1.4.4, Integration Contracts v1.6.4, Settlement v1.2.2 | Snapshot решений 16.02.2026 | METADATA |
| 2 | NEW sec 2.16: API Versioning Policy — URL prefix `/apiv1/`, правила non-breaking / breaking changes, deprecation policy ≥ 3 месяцев | Snapshot решений 16.02.2026 | NEW SECTION |
| 3 | Sec 12.6: Security NFR — IP whitelists для внешних провайдеров управляются через env config, ссылка на runbook RF-NET-01 | Snapshot решений 16.02.2026 | ALTER SECURITY |

---

## Changelog v1.4.3 → v1.4.4

| # | Изменение | Патч Snapshot v1.3 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 3.2: Dispute API — Settlement v1.2.2 принят как source of truth: `lineIds` вместо `orderIds`, re-dispute разрешён, удалён `disputeId`. API Contract v1.4.3 sec 11.1 → v1.4.4 sec 11.1 | Patch Bundle Fix #1 | ALTER SETTLEMENT |
| 2 | NEW sec 14: Localization Policy — MVP `ru-RU`, форматы цен/дат/времени, подготовка к post-MVP i18n | Patch Bundle Fix #9 | NEW SECTION |
| 3 | Sec 4 header: Data Model v1.4.9 → v1.4.10 (Version Matrix fix) | Patch Bundle Fix #3 | ALTER REF |
| 4 | Sec 13: Version Matrix — API Contract v1.4.4, Data Model v1.4.10, Spec v1.4.4 | Patch Bundle meta | METADATA |
| 5 | Все cross-refs: API Contract v1.4.3 → v1.4.4 | Patch Bundle meta | ALTER REF |

---

## Changelog v1.4.2 → v1.4.3

| # | Изменение | Патч Snapshot v1.2 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 2.1: ссылка на Admin API (invite + list users) — API Contract v1.4.4 sec 14 | Патч #3 | ADD REF |
| 2 | Sec 2.6: Partner API +image upload (sec 2.9) +image delete (sec 2.10) | Патч #4 | ALTER FEATURE |
| 3 | Sec 3.1: СБП QR-flow → SBPPaymentSheet (Navigation v1.4.4) | Патч #5 | ALTER PAYMENT |
| 4 | Sec 3.2: webhook-based payment confirmation + checkout `qrCodeUrl` | Патч #1, #5 | ALTER PAYMENT |
| 5 | Sec 4 header: Data Model v1.4.8 → v1.4.10 (+idx_pay_tx_provider_ref, +VM fix) | Патч #7 | ALTER REF |
| 6 | Sec 4.8: полный WS-контракт — auth, heartbeat, reconnect, close codes, offline queue | Патч #2 | ALTER WS |
| 7 | Sec 11: ссылка на unified CRON monitoring (IC v1.6.3 sec 8.6) | Патч #6 | ADD REF |
| 8 | NEW sec 12: Non-Functional Requirements — latency, throughput, infra, cache, SLA, security | Патч #8 | NEW SECTION |
| 9 | Sec 13: Version Matrix обновлена | Патч v1.2 meta | METADATA |

---

## Changelog v1.4.1 → v1.4.2

| # | Изменение | Патч Snapshot v1.1 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 2.1: `consentAccepted` — условно обязательное поле при регистрации (152-ФЗ) + `400 CONSENT_REQUIRED` | Патч #1 | ALTER AUTH |
| 2 | Sec 2.1: `POST /auth/register-push` — регистрация push-токена устройства | Патч #2 | NEW ENDPOINT |
| 3 | Sec 2.2, 2.12, 2.13, 6: Активные заказы включают `ready`, `customer_arrived` (BR-STATUS-3, BR-DEL-1, BR-CART-1) | Патч #3 | ALTER LIFECYCLE |
| 4 | Sec 2.11: Chat lifecycle расширен на `ready`, `customer_arrived` (BR-CHAT-1, BR-STATUS-1) | Патч #3 | ALTER LIFECYCLE |
| 5 | Sec 3.1: `sbp` добавлен в payment_provider enum | Патч #5 | ALTER ENUM |
| 6 | Sec 3.2: Order lifecycle — `picking → ready → customer_arrived → completed`. Capture при `picking→ready` | Патч #3 | ALTER LIFECYCLE |
| 7 | Sec 4.4: customer_order — status enum +2, paymentProvider +`sbp`, +`ready_at`, +`customer_arrived_at` | Патч #3, #5 | ALTER ENTITY |
| 8 | Sec 4.8, 8.2: Push triggers для `ready`, `customer_arrived`, `completed` | Патч #3 | ALTER PUSH |
| 9 | Sec 5: US-PICKUP-1 (новая user story — flow выдачи заказа) | Патч #3 | NEW USER STORY |
| 10 | Sec 6: +BR-STATUS-1, BR-STATUS-2, BR-STATUS-3; обновлены BR-DEL-1, BR-CHAT-1, BR-CART-1 | Патч #3 | NEW/ALTER BR |
| 11 | Sec 8.2: Push token хранится в `refresh_token.push_token` (Data Model v1.4.10) | Патч #2 | ALTER INFRA |
| 12 | Sec 13: Version Matrix обновлена | Патч v1.1 meta | METADATA |

---

## Changelog v1.4.0 → v1.4.1

| # | Изменение | Патч Snapshot | Тип |
|---|-----------|--------------|-----|
| 1 | NEW: Order History — `GET /orders` (sec 2.13) + Order Rating — `POST /orders/:id/rate` (sec 2.14) | Патч #1 | NEW FEATURE |
| 2 | Sec 2.1: `INVALIDCODE` → `INVALIDOTP`. Единый неймспейс OTP-ошибок | Патч #2 | FIX ERROR CODE |
| 3 | Sec 2.1: ссылка на глобальную Rate Limit Policy (API Contract Appendix E) | Патч #7 | ADD REF |
| 4 | Sec 4.7: добавлена сущность `order_rating` | Патч #1 | NEW ENTITY |
| 5 | Sec 5: US-HISTORY-1 (история заказов), US-RATING-1 (оценка заказа) | Патч #1 | NEW USER STORY |
| 6 | Sec 6: BR-RATE-1, BR-RATE-2 — бизнес-правила рейтинга | Патч #1 | NEW BR |
| 7 | Sec 8.2: Push Provider → FCM primary + SMS fallback; RuStore Push post-MVP | Патч #5a | RESOLVED |
| 8 | Sec 11: Settlement Job + Auto-Approve → единый Settlement Pipeline (sequential) | Патч #6 | FIX CRON |
| 9 | Sec 11: OTP/Token Cleanup — каноничные TTL (revoked 7d, verified 7d) | Патч #4 | FIX CRON |
| 10 | Sec 13: Version Matrix → Integration Contracts v1.6.1, BNPL v1.2.1 | Патч #8 | METADATA |

---

## Changelog v1.3.3 → v1.4.0

| # | Изменение | Snapshot § | Тип |
|---|-----------|-----------|-----|
| 1 | Rename `order` → `customer_order`, `user` → `app_user` во всех ссылках | §1.2 | RENAME |
| 2 | Удалены ссылки на `bnpl_status` | §1.3 | DROP |
| 3 | NEW: Auth — OTP flow, JWT RS256, refresh rotation, picker invite | §2 | NEW FEATURE |
| 4 | NEW: Catalog — категории, карточка товара (КБЖУ), Partner API | §3 | NEW FEATURE |
| 5 | NEW: Search — unified fulltext + trigram fallback | §4 | NEW FEATURE |
| 6 | NEW: Cart — server-side, multistore checkout (заменяет POST /orders) | §5 | NEW FEATURE |
| 7 | NEW: Profile / Delete Account — soft delete, grace 30 дней, 152-ФЗ | §6 | NEW FEATURE |
| 8 | NEW: Favorites — полиморфная (product + store), isFavorite inline | §7 | NEW FEATURE |
| 9 | NEW: Addresses — до 5 адресов, Yandex Geocoding client-side | §8 | NEW FEATURE |
| 10 | NEW: Smart Alerts — push-only, 3 триггера, CRON 30 мин | §9 | NEW FEATURE |
| 11 | NEW: Chat — order-scoped, text-only, WS + REST | §10 | NEW FEATURE |
| 12 | WS events: добавлены `chat.message`, `chat.read` | §10.3 | NEW WS |
| 13 | CRON: +3 новых job (Account Deletion, Smart Alerts, OTP Cleanup) | §13 | NEW CRON |
| 14 | User stories: +9 новых (US-AUTH, US-SEARCH, US-CART, US-PROFILE, US-FAV, US-ADDR, US-ALERT, US-CHAT, US-CATALOG) | — | NEW US |

---

## 1. Общий обзор

Robin Food — мобильное приложение-агрегатор доставки продуктов из розничных магазинов (grocery delivery). MVP для российского рынка.

**Ключевые участники:**
- **Покупатель (customer)** — заказывает продукты через приложение.
- **Пикер (picker)** — собирает заказы в магазинах.
- **Партнёр (partner)** — розничная сеть (владелец магазинов).
- **Robin Food** — платформа-агрегатор.

---

## 2. Core Features

### 2.1 Аутентификация (NEW v1.4.0, UPDATED v1.4.3)

Единый OTP-flow по номеру телефона для всех ролей.

**Покупатель:**
1. Ввод телефона → `POST /auth/send-otp` → SMS через SMSC.ru.
2. Ввод 6-значного кода → `POST /auth/verify-otp`.
3. Если телефон не зарегистрирован → авто-создание `app_user(role='customer', status='active')`.
4. Возвращаются `accessToken` (JWT RS256, 1 час) + `refreshToken` (30 дней).

**Picker / Partner:**
- Тот же OTP-flow, но self-register невозможен.
- Admin предсоздаёт `app_user(phone, role='picker', status='invited')`.
- При verify-otp: `status='invited'` → `status='active'`.
- Без предрегистрации → `403 NOT_INVITED`.

**Admin API (NEW v1.4.3 — Патч #3):**
Admin создаёт invited-записи через REST API (API Contract v1.4.4, sec 14):
- `POST /api/v1/admin/users/invite` — создание app_user(status='invited') с указанием role (picker|partner) и phone.
- `GET /api/v1/admin/users` — список с фильтрами role, status, q (поиск), cursor pagination.
- MVP shortcut: CLI-скрипт `./scripts/invite-user.sh` (curl + service JWT).
- Post-MVP: React Admin UI.

**Ключевые параметры:**

| Параметр | Значение |
|----------|----------|
| JWT Algorithm | RS256 |
| Access TTL | 1 час |
| Refresh TTL | 30 дней |
| Refresh rotation | Да (старый отзывается) |
| Max устройств | 3 (FIFO-вытеснение старейшего) |
| OTP длина | 6 цифр |
| OTP TTL | 2 мин |
| Max попыток | 3 → status='blocked' |
| OTP expired | `410 OTP_EXPIRED` *(v1.4.1: было 403, стало 410 Gone — Патч #3)* |
| Captcha | Нет в MVP (Яндекс SmartCaptcha post-MVP) |

**OTP Error namespace (v1.4.1 — Патч #2):**

| Ошибка | HTTP | Описание |
|--------|------|----------|
| `INVALID_OTP` | 400 | Неверный код *(было `INVALIDCODE` в v1.4.0)* |
| `OTP_BLOCKED` | 403 | 3+ неудачных попытки |
| `OTP_EXPIRED` | 410 | Код истёк *(v1.4.1: было 403 → 410 Gone)* |
| `CONSENT_REQUIRED` | 400 | Согласие на ПД не получено *(NEW v1.4.2 — Патч #1)* |

**Rate limits:** Auth + глобальные лимиты — см. API Contract v1.4.4, Appendix E — Rate Limit Policy.

| Scope | Limit |
|-------|-------|
| Auth — per phone | 1 req/60s, 5/day |
| Auth — per IP | 10 req/min, 30/day |
| Write — per user | 30 req/min |
| Read — per user | 120 req/min |
| Partner API — per partner | 60 req/min |
| Global — per IP | 300 req/min |

**BR-AUTH-1 (согласие ПД, UPDATED v1.4.2 — Патч #1):** При регистрации (первый verify-otp) клиент отправляет `consentAccepted: true`. Без согласия → `400 CONSENT_REQUIRED` с `details: { field: "consentAccepted", law: "152-ФЗ" }`. Для существующих пользователей поле игнорируется.

**Push Token Registration (NEW v1.4.2 — Патч #2):**
- `POST /auth/register-push` — регистрация push-токена устройства (FCM / APNs / RuStore).
- Push token хранится в `refresh_token.push_token` (Data Model v1.4.10, Table 10).
- Вызывается при каждом app launch и при `onTokenRefresh` callback.
- При невалидном токене — автоматический SMS fallback через SMSC.ru.

---

### 2.2 Мультимагазинная корзина (UPDATED v1.4.2)

Покупатель может заказать товары из разных магазинов в одной сессии, каждый магазин = подзаказ (`customer_order`).

**Лимиты MVP:**
- Максимум 3 параллельных активных заказа на покупателя.
- Активные статусы: `pending`, `confirmed`, `picking`, `ready`, `customer_arrived`.

---

### 2.3 Server-Side Cart (NEW v1.4.0)

Корзина хранится на сервере, одна на покупателя (`cart.customer_id UNIQUE`).

**Принципы:**
- Цена не хранится в корзине — всегда актуальная из `product.current_price`.
- При `GET /cart` возвращаются warnings: `ITEM_UNAVAILABLE`, `PRICE_CHANGED`.
- Группировка по `store_id`.
- `POST /cart/checkout` создаёт N `customer_order` по магазинам, лимит active+new ≤ 3, BNPL проверяется per sub-order, hold 15 минут, после checkout корзина очищается.

---

### 2.4 Hold 15 минут

После создания заказа:
1. Платёж hold-ится (Tinkoff / SBP / BNPL authorize).
2. Таймер 15 минут.
3. Если за это время заказ не перешёл в `confirmed` → auto-cancel + refund.

**Background job:**
```text
CRON: every 1 minute
SELECT FROM customer_order WHERE status='pending' AND created_at < NOW() - 15 min
→ cancel_payment() + status='cancelled' + WS/push notifications
```

---

### 2.5 Весовые товары

Товары с `quantity_unit = 'kg'` требуют взвешивания пикером.

**Поля:** `requested_quantity`, `actual_quantity`, `final_price = current_price * actual_quantity`.

**BR-PICK-4:** Заказ нельзя завершить сборку (`PUT /picker/orders/:id/complete`), если есть весовые товары без `actual_quantity`.

`PUT /picker/orders/:id/complete` переводит заказ в `ready` и запускает capture.

---

### 2.6 Каталог (UPDATED v1.4.3)

#### Покупательская часть

Сохраняется как в v1.4.2: карта магазинов, детали магазина, список товаров, карточка товара с КБЖУ и множественными фото.

#### Partner API (управление каталогом, UPDATED v1.4.3)

Партнёр управляет товарами своих магазинов:
- `POST /partner/stores/:id/products` — создание товара.
- `PUT /partner/products/:id` — partial update.
- `DELETE /partner/products/:id` — soft delete (`is_available=false`).
- `GET /partner/stores/:id/products` — список (включая неактивные).
- `POST /partner/products/:id/images` — загрузка изображения (multipart, max 5 MB, JPEG/PNG/WebP → server-side resize WebP → S3 → CDN; max 10 images per product).
- `DELETE /partner/products/:id/images/:imageId` — soft delete изображения (S3 объект сохраняется 30 дней).

**Image CDN URLs (NEW v1.4.3):**

| Вариант | Размер | Качество | URL pattern |
|---------|--------|----------|-------------|
| original | 1200px | q80 | `cdn.robinfood.ru/products/{productId}/{imageId}.webp` |
| thumb | 300px | q70 | `…/{imageId}_thumb.webp` |
| micro | 100px | q60 | `…/{imageId}_micro.webp` |

---

### 2.7 Поиск

Сохраняется как в v1.4.2: unified fulltext + trigram fallback, `GET /search`, `GET /search/suggest`.

---

### 2.8 Избранное

Полиморфная таблица (product + store), `UNIQUE(user_id, entity_type, entity_id)`, inline `isFavorite` в основных ответах.

---

### 2.9 Адреса

До 5 адресов на пользователя, `is_default` ровно один, Yandex Geocoding с клиента.

---

### 2.10 Smart Alerts

Триггеры `price_drop`, `back_in_stock`, `price_threshold`; расписание morning / evening / all_day; CRON 30 минут, max 20 alerts, debounce 24 часа.

---

### 2.11 Чат (UPDATED v1.4.2)

Order-scoped чат customer↔picker, text-only, REST+WS, доступен для записи при статусах `confirmed`, `picking`, `ready`, `customer_arrived`.

---

### 2.12 Профиль и удаление аккаунта

Soft delete с grace 30 дней, блокировка удаления при активных заказах (включая `ready`, `customer_arrived`), анонимизация PII.

---

### 2.13 История заказов

`GET /orders?status=active|completed|cancelled|all`, active = `pending`, `confirmed`, `picking`, `ready`, `customer_arrived`.

---

### 2.14 Оценка заказа

`POST /orders/:id/rate`, 1–5, optional comment, idempotent upsert.

---

### 2.15 Выдача заказа

Статусы `ready` и `customer_arrived`, `POST /orders/:id/arrived`, `POST /picker/orders/:id/confirm-pickup`, push-уведомления на ключевых переходах.

---
### 2.16 API Versioning Policy (NEW v1.4.5)

Политика версионирования публичного HTTP API Robin Food.

**Правила:**
- Публичный API версионируется через URL-префикс: `/apiv1/...`.
- **Non-breaking changes** (новые optional-поля, новые эндпоинты, новые enum-значения) разрешены внутри `v1` без смены префикса.
- **Breaking changes** (удаление полей, переименование полей, изменение семантики существующих эндпоинтов, удаление enum-значений) требуют нового major-префикса (`/apiv2/...`) и плана деприкации `v1`.

**Deprecation Policy:**
- Минимум **3 месяца** одновременной доступности `v1` и `v2` для партнёров.
- При деприкации: HTTP-заголовок `Deprecation: true` + `Sunset: <date>` на ответах deprecated-эндпоинтов.
- Партнёры уведомляются по email за 30 дней до деприкации.

**OpenAPI:**
- Схемы для каждого major-версии хранятся отдельно: `openapi-v1.yaml`, `openapi-v2.yaml`.
- CI-pipeline включает `oasdiff breaking` для детекции breaking changes (см. API Contract v1.4.4, Appendix F).

---


## 3. Payment Flow

### 3.1 Providers (UPDATED v1.4.3)

- **Tinkoff Acquiring** — банковские карты.
- **СБП** — система быстрых платежей, UX: SBPPaymentSheet (bottom sheet с QR-кодом + deep link).
- **BNPL** — Яндекс Сплит, Долями.

Apple Pay / Google Pay — не в MVP.

**Provider → Screen mapping (NEW v1.4.3 — Патч #5):**

| Provider | Checkout Field | Screen | UX Flow |
|----------|---------------|--------|---------|
| tinkoff | paymentUrl | PaymentWebView | WebView → redirect → callback |
| sbp | qrCodeUrl | SBPPaymentSheet | Bottom sheet QR → deep link |
| yandex_split | paymentUrl | PaymentWebView | WebView → BNPL form → callback |
| dolyame | paymentUrl | PaymentWebView | WebView → BNPL form → callback |

---

### 3.2 Lifecycle (UPDATED v1.4.4)

```text
POST /cart/checkout → N × Hold (15 min) → Picking → Capture + Ready → Customer Arrived → Completed
                          ↓                                  ↓               ↓
                     Auto-cancel if timeout            confirm-pickup   confirm-pickup
                                                      (skip arrived)
```

Capture происходит при переходе `picking → ready`.

**State Machine:**

```text
pending → confirmed → picking → ready → customer_arrived → completed
  ↓          ↓          ↓
cancelled  cancelled  cancelled
```

| Переход | Триггер | Кто инициирует |
|---------|---------|----------------|
| `pending → confirmed` | Подтверждение магазином (auto/manual) | System / Partner |
| `confirmed → picking` | `PUT /picker/orders/:id/accept` | Picker |
| `picking → ready` | `PUT /picker/orders/:id/complete` + capture | Picker |
| `ready → customer_arrived` | `POST /orders/:id/arrived` | Customer |
| `ready → completed` | `POST /picker/orders/:id/confirm-pickup` (skip arrived) | Picker |
| `customer_arrived → completed` | `POST /picker/orders/:id/confirm-pickup` | Picker |
| `pending → cancelled` | Auto-cancel (hold expired) / `POST /orders/:id/cancel` | System / Customer |
| `confirmed → cancelled` | Admin/system | System |
| `picking → cancelled` | BNPL below min (BR-BNPL-6) | System |

`ready` и `customer_arrived` не могут быть отменены — capture уже произведён.

**Hold vs Capture:**
- Hold по `total_amount` (на базе `requested_quantity`).
- Capture по финальной сумме (учёт `actual_quantity`) при `picking → ready`.

**Payment Confirmation — Webhook (NEW v1.4.3 — Патч #1):**
- Incoming webhook: `POST /api/v1/webhooks/tinkoff` (без JWT, IP whitelist + HMAC).
- Idempotency по (PaymentId, Status).
- `AUTHORIZED|CONFIRMED` → payment_transaction.status='success', customer_order.status='confirmed', WS+push.
- `REJECTED` → payment_transaction.status='failed', заказ cancelled+refunded, WS.
- Retry: 10 попыток (10s → 24h).
- СБП: после подтверждения в банковском приложении → Status=AUTHORIZED.

**Checkout Response — qrCodeUrl (NEW v1.4.3 — Патч #5):**

| Field | Type | Description |
|-------|------|-------------|
| paymentUrl | string\|null | Redirect URL (tinkoff, BNPL). Null if sbp |
| qrCodeUrl | string\|null | СБП QR deep link. Null if not sbp |

**Dispute API — Settlement (UPDATED v1.4.4 — Patch Bundle Fix #1):**

Партнёр может оспорить конкретные строки settlement-периода. Source of truth — Settlement v1.2.2 sec 8.

- Endpoint: `POST /api/v1/partner/settlements/:periodId/dispute` (API Contract v1.4.4, sec 11.1).
- Request body: `{ lineIds: [uuid], reason: string }` — ID строк из `settlement_line` для данного периода.
- Response: `{ periodId, status: "disputed", disputedLinesCount, totalDisputedLines }`.
- Re-dispute разрешён: партнёр может оспорить дополнительные строки в уже disputed period (`review` → `disputed`, `disputed` → `disputed`).
- При статусе не в `(review, disputed)` или после deadline → `409 PERIOD_NOT_DISPUTABLE`.
- Auto-Approve (Settlement v1.2.2 sec 9) проверяет наличие unresolved disputed lines перед авто-одобрением.
- Resolution — ручной процесс: Ops team проверяет, создаёт `settlement_adjustment(type='correction')`, переводит строки в `approved`.

---

## 4. Модель данных (ключевые сущности)

> Полная DDL-схема: Data Model v1.4.10 (v1.4.4: было v1.4.9 → v1.4.10, Version Matrix fix — Patch Bundle Fix #3). Здесь — бизнес-описание.

### 4.1 app_user

(без изменений, как в v1.4.2).

### 4.2 store

(без изменений).

### 4.3 product

(без изменений).

### 4.4 customer_order

(как в v1.4.2, с enum статусами и paymentProvider `sbp`).

### 4.5 customer_order.paymentStatus — семантика

(как в v1.4.2, BR-PAY-5).

### 4.6 order_item

(как в v1.4.2, GMV calculation).

### 4.7 Новые сущности v1.4.0–v1.4.2

(таблица сущностей otp_session, refresh_token, category, product_image, cart и др.).

### 4.8 WebSocket Events (UPDATED v1.4.3)

WS-события используют единый envelope `{ event, timestamp, idempotencyKey, payload }`, клиент дедуплицирует по `idempotencyKey`.

**Реестр событий:**

| Event | Триггер | customer | picker |
|-------|---------|----------|--------|
| `order.status_changed` | Смена customer_order.status | ✅ | ✅ (если назначен) |
| `order.cancelled` (BNPL) | finalAmount < provider.minAmount | ✅ (без items) | ✅ (с items) |
| `order.totals_updated` | Пересчёт после weigh/cancel/replace | ✅ | ❌ |
| `chat.message` | Новое сообщение | ✅ | ✅ |
| `chat.read` | Сообщения прочитаны | ✅ | ✅ |

**Push triggers для status transitions:** как в v1.4.2.

**Полный WS-контракт (EXPANDED v1.4.3 — Патч #2):** API Contract v1.4.4, sec 12.1.

| Аспект | Решение |
|--------|---------|
| Auth | accessToken в query param `token`, JWT RS256 валидация при handshake |
| Close codes | 1000, 1001, 4001 (unauthorized), 4003 (forbidden), 4008 (rate limited), 4029 (too many connections) |
| Heartbeat | Server ping 30s, client pong 10s, 2 missed → close (1001) |
| Reconnect | Backoff 1s→30s cap, ±500ms jitter, fresh token, foreground only |
| Rate limit | Max 3 WS per userId (FIFO), max 10 client→server msg/min |
| Offline queue | Redis, TTL 5 min, max 50 events, overflow → `sync_required` → REST |
| Envelope | `{ event, timestamp, idempotencyKey, payload }` — client dedup by idempotencyKey |

---

## 5. User Stories

(как в v1.4.2, включая US-PICKUP-1).

---

## 6. Business Rules

(как в v1.4.2, включая BR-STATUS-1..3, BR-DEL-1..4, BR-PICK-4, BR-BNPL-6, BR-RATE-1..2, BR-PAY-5).

---

## 7. Favorites

(как в v1.4.2).

---

## 8. Infrastructure & Push

(как в v1.4.2, с push_token в `refresh_token.push_token`).

---

## 9. Smart Alerts

(как в v1.4.2).

---

## 10. Chat

(как в v1.4.2, WS events `chat.message`, `chat.read`).

---

## 11. CRON Jobs (UPDATED v1.4.3)

Содержит Settlement Pipeline, Account Deletion, Smart Alerts, OTP Cleanup, Hold Auto-Cancel.

**Unified CRON Monitoring (NEW v1.4.3 — Патч #6):**
Все CRON jobs обёрнуты в единый `cron_health_wrapper` (Integration Contracts v1.6.4, sec 8.6).

| Job | Schedule | Warn p95 | Crit | Stale Alert |
|-----|----------|----------|------|-------------|
| Hold Auto-Cancel | every 1 min | > 30s | > 55s | no run > 3 min |
| Settlement Pipeline | daily 03:00 | > 5 min | > 15 min | no run > 25h |
| Account Deletion | daily 04:00 | > 2 min | > 10 min | no run > 25h |
| Smart Alerts | every 30 min | > 60s | > 120s | no run > 35 min |
| OTP Cleanup | every 1 hour | > 30s | > 60s | no run > 65 min |

Alert channels: Sentry, Ops Telegram/Slack, Prometheus+Grafana.

Dead Man's Switch: heartbeat `POST monitoring.robinfood.ru/heartbeat/{job}`; отсутствие → Stale Alert.

---

## 12. Non-Functional Requirements (NEW v1.4.3 — Патч #8)

### 12.1 Latency Targets (p95)

| Endpoint Category | Target p95 | Max p99 |
|-------------------|-----------|---------|
| Auth (send-otp, verify) | 500ms | 1500ms |
| Catalog reads | 150ms | 400ms |
| Search (fulltext) | 300ms | 800ms |
| Cart operations | 200ms | 500ms |
| Checkout | 2000ms | 5000ms |
| Order status reads | 150ms | 400ms |
| WebSocket event delivery | 200ms | 500ms |
| Webhook processing | 100ms | 300ms |

### 12.2 Throughput (MVP launch)

| Metric | Expected | Burst |
|--------|----------|-------|
| DAU | 5,000 | 15,000 |
| Concurrent WS | 500 | 2,000 |
| RPS (reads) | 100 | 500 |
| RPS (writes) | 20 | 100 |
| Orders/day | 1,000 | 3,000 |
| Push notifications/h | 2,000 | 10,000 |

### 12.3 Infrastructure (MVP)

| Component | Config |
|-----------|--------|
| DB | PostgreSQL 16, 4 vCPU / 16 GB RAM |
| Connection pool | PgBouncer, transaction mode, 50 conn |
| App servers | 2× (HA), 2 vCPU / 4 GB |
| Redis | 1× instance, 2 GB |
| S3 | Yandex Object Storage, standard |
| CDN | Yandex CDN, PoP Moscow |

### 12.4 Cache Strategy

| Data | Cache Layer | TTL | Invalidation |
|------|------------|-----|--------------|
| Product list/detail | Redis | 5 min | Partner update → bust |
| Store list | Redis | 10 min | Partner update → bust |
| Search suggest | Redis | 2 min | TTL-only |
| Category list | Redis | 30 min | Admin update → bust |
| User profile | No cache | — | Mutable, low RPS |
| Cart | No cache | — | Server-side, consistent |
| CDN images | CDN edge | 1 year | Immutable URLs |

### 12.5 Availability & Recovery

| Metric | Target |
|--------|--------|
| Uptime | 99.5% monthly |
| RTO | 30 min |
| RPO | 5 min |
| DB backup | Daily snapshot + WAL streaming |

### 12.6 Security NFR

- TLS 1.2+ обязателен.
- PII encrypted at rest (pgcrypto / application-level).
- Logs: PII masked (phone → +7***4567).
- OWASP Top 10 checklist pre-launch.
- IP whitelists для внешних провайдеров (Tinkoff webhook и др.) управляются через переменные окружения (например, `TINKOFF_WEBHOOK_IP_RANGES`). Источником правды является инфраструктурный runbook `RF-NET-01`. Спецификация намеренно не дублирует конкретные CIDR-диапазоны.

---

## 13. Version Matrix (UPDATED v1.4.5)

| Документ | Версия | Min Compatible | Изменения v1.4.5 |
|----------|--------|----------------|-----------------|
| Spec | v1.4.5 | v1.4.3 | +sec 2.16 API Versioning Policy, VM update, Security NFR IP whitelist |
| API Contract | v1.4.4 | v1.4.3 | Без изменений (Fix sec 11.1 Dispute — в v1.4.4) |
| Data Model | v1.4.10 | v1.4.9 | Без изменений |
| Navigation | v1.4.4 | v1.4.3 | Без изменений |
| Integration Contracts | v1.6.4 | v1.6.3 | Без изменений |
| BNPL Integration | v1.2.2 | v1.2.2 | Без изменений |
| Settlement | v1.2.2 | v1.2.1 | Без изменений |

---

## 14. Localization Policy (NEW v1.4.4 — Patch Bundle Fix #9)

### 14.1 MVP Scope

- Единственный язык: **русский (ru-RU)**.
- Все UI-строки, push-уведомления, email, SMS, PDF-отчёты — на русском.
- API error messages (`{ code, message }`) — текст `message` на русском.
- Error codes (`UPPER_SNAKE_CASE`) — language-agnostic, не переводятся.

### 14.2 Подготовка к Post-MVP i18n

- UI-строки хранить в resource-файлах (iOS: `Localizable.strings`, Android: `strings.xml`), **не hardcode**.
- API: заголовок `Accept-Language` — парсится, но игнорируется в MVP. Post-MVP — маршрутизация по нему.
- Push notification body — из серверных шаблонов (хранятся в БД или config), не зашито в код.
- Дата/время — ISO 8601 в API, локализованный формат только на клиенте.

### 14.3 Форматы отображения

| Элемент | Формат | Пример |
|---------|--------|--------|
| Цена | `{amount/100} ₽` | 467,04 ₽ |
| Вес | `{value} кг` / `{count} шт` | 0,48 кг / 2 шт |
| Дата (UI полная) | `dd.MM.yyyy` | 16.02.2026 |
| Дата (UI краткая) | `dd MMM` | 16 фев |
| Время | `HH:mm` (24-часовой) | 15:30 |
| Телефон | `+7 (XXX) XXX-XX-XX` | +7 (999) 123-45-67 |
| Timezone (CRON, бизнес) | MSK (`Europe/Moscow`) | — |
| Timezone (API, DB) | UTC (ISO 8601 с `Z` или `+00:00`) | 2026-02-16T12:30:00Z |

### 14.4 Разделители

- Десятичный разделитель в UI: запятая (`,`) — `467,04 ₽`.
- Разделитель тысяч в UI: неразрывный пробел — `1 234,56 ₽`.
- В API: точка (`.`) — `46704` (копейки, integer) или `467.04` (если decimal).

---
