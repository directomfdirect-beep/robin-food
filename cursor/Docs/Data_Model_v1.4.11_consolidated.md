# Robin Food — Data Model v1.4.11 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.4.11 | 16.02.2026 | Consolidated | Robin Food Product & Engineering Team |

**Scope v1.4.11:** Полная DDL-схема БД — рефакторинг reserved words, удаление `bnpl_status`, добавление `disputed`, +13 новых таблиц (Auth, Catalog, Search, Cart, Profile, Favorites, Addresses, Smart Alerts, Chat, Rating), FTS-индексы. Каноничная CRON-логика cleanup + settlement pipeline. **Патчи Snapshot v1.1:** push_token в refresh_token (#2), статусы ready/customer_arrived (#3), sbp payment_provider (#5). **Патч Snapshot v1.2:** unique index `idx_pay_tx_provider_ref` на payment_transaction для idempotency webhook (#7). **Патч Snapshot v1.3 (Patch Bundle v1.0):** `total_disputed_lines` в settlement_period (Fix #1), обновление cross-references, fix Version Matrix. **Патч Snapshot v1.4.11:** `payout_ref` в settlement_period для формализации выплат (Settlement v1.2.2 sec 10), обновление Spec cross-ref до v1.4.5.

**Зависимости:** Spec v1.4.5, API Contract v1.4.4, Settlement v1.2.2, BNPL Integration v1.2.2, Integration Contracts v1.6.4, Navigation v1.4.4

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026), Patch Snapshot v1.3 (16.02.2026), Patch Snapshot v1.4.11 (16.02.2026)

---

## Changelog v1.4.10 → v1.4.11

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Table 20 `settlement_period` — добавлена колонка `payout_ref TEXT` для хранения идентификатора банковского перевода при payout (Settlement v1.2.2 sec 10, IC v1.6.4 sec 1.4) | Payout Execution | ADD COLUMN |
| 2 | Migration SQL v1.4.10 → v1.4.11 — `ALTER TABLE settlement_period ADD COLUMN payout_ref TEXT` (zero-downtime, nullable) | Payout Execution | MIGRATION |
| 3 | Version Matrix: Spec v1.4.4 → v1.4.5, Data Model self v1.4.10 → v1.4.11 | Snapshot решений | METADATA |

---

## Changelog v1.4.9 → v1.4.10

| # | Изменение | Patch Bundle Fix | Тип |
|---|-----------|-----------------|-----|
| 1 | Table 20 `settlement_period` — добавлена колонка `total_disputed_lines INTEGER NOT NULL DEFAULT 0` для поддержки Dispute API response field `totalDisputedLines` | Fix #1 | ADD COLUMN |
| 2 | Table 20 `settlement_period` — добавлен индекс `idx_settlement_disputed` для фильтрации периодов с disputed строками | Fix #1 | ADD INDEX |
| 3 | Table 23 `payment_transaction` — cross-ref в COMMENT обновлён API Contract v1.4.3 → v1.4.4 sec 13.1 | meta | ALTER COMMENT |
| 4 | Table 10 `refresh_token` — cross-ref обновлён API Contract v1.4.2 → v1.4.4 эндпоинт #54 | meta | ALTER COMMENT |
| 5 | Version Matrix: **FIX** — все зависимости выровнены с актуальными версиями (was v1.4.2/v1.4.8, now v1.4.4/v1.4.10) | meta | FIX METADATA |
| 6 | All cross-refs: Spec v1.4.3 → v1.4.4, AC v1.4.3 → v1.4.4, Settlement v1.2.1 → v1.2.2, IC v1.6.3 → v1.6.4, Nav v1.4.3 → v1.4.4 | meta | ALTER REF |

---

## Changelog v1.4.8 → v1.4.9

| # | Изменение | Решение Snapshot v1.2 | Тип |
|---|-----------|----------------------|-----|
| 1 | Table 23 `payment_transaction` — добавлен unique index `idx_pay_tx_provider_ref(provider, provider_ref)` для idempotency webhook Tinkoff/СБП | Патч #7 | ADD INDEX |
| 2 | Version Matrix: все зависимости обновлены (Spec/API/Nav → v1.4.3, IC → v1.6.3, DM → v1.4.9) | Патч v1.2 meta | METADATA |

---

## Changelog v1.4.7 → v1.4.8

| # | Изменение | Решение Snapshot v1.1 | Тип |
|---|-----------|----------------------|-----|
| 1 | `refresh_token` — добавлены `push_token`, `push_platform` + CHECK | Патч #2 | ADD COLUMN + CONSTRAINT |
| 2 | `customer_order.status` — добавлены `ready`, `customer_arrived` | Патч #3 | ALTER CHECK |
| 3 | `customer_order` — добавлены `ready_at`, `customer_arrived_at` | Патч #3 | ADD COLUMN |
| 4 | `customer_order.payment_provider` — добавлен `sbp` | Патч #5 | ALTER CHECK |
| 5 | Version Matrix: все зависимости обновлены (Spec/API/Nav → v1.4.2, IC → v1.6.2, BNPL → v1.2.2) | Патч v1.1 meta | METADATA |

---

## Changelog v1.4.6 → v1.4.7

| # | Изменение | Решение Snapshot | Тип |
|---|-----------|-----------------|-----|
| 1 | Новая таблица `order_rating` (Table 24) | Патч #1 | NEW TABLE |
| 2 | CRON: Settlement Job + Auto-Approve → единый Settlement Pipeline (sequential) | Патч #6 | CRON REFACTOR |
| 3 | CRON: OTP/Token Cleanup — каноничный SQL с TTL (revoked 7d, verified 7d, expired refresh) | Патч #4 | CRON UPDATE |
| 4 | Version Matrix: Integration Contracts min v1.5.1 → v1.6.1, BNPL min v1.2 → v1.2.1 | Патч #8 | METADATA |
| 5 | Зависимости: Spec/API/Nav → v1.4.1, Integration Contracts → v1.6.1 | Патч #8 | METADATA |

---

## Changelog v1.4.5 → v1.4.6

| # | Изменение | Решение Snapshot | Тип |
|---|-----------|-----------------|-----|
| 1 | `"order"` → `customer_order`, `"user"` → `app_user` | §1.2 | RENAME |
| 2 | Удалён `bnpl_status` из `customer_order` | §1.3 | DROP COLUMN |
| 3 | `settlement_period.status` — добавлен `disputed` | §1.1 | ALTER CHECK |
| 4 | `app_user` — добавлен `status` (для invite-flow picker/partner) | §2.4 | ADD COLUMN |
| 5 | Новая таблица `otp_session` | §2.1 | NEW TABLE |
| 6 | Новая таблица `refresh_token` | §2.1 | NEW TABLE |
| 7 | Новая таблица `category` | §3.1 | NEW TABLE |
| 8 | Новая таблица `product_image` | §3.1 | NEW TABLE |
| 9 | Расширение `product` — каталожные колонки + FTS | §3.2, §4.2 | ALTER TABLE |
| 10 | FTS-индексы на `product`, `store`, `category` | §4.2 | NEW INDEX |
| 11 | Новая таблица `cart` | §5.1 | NEW TABLE |
| 12 | Новая таблица `cart_item` | §5.1 | NEW TABLE |
| 13 | Новая таблица `deletion_request` | §6.1 | NEW TABLE |
| 14 | Новая таблица `favorite` | §7.1 | NEW TABLE |
| 15 | Новая таблица `address` | §8.1 | NEW TABLE |
| 16 | Новая таблица `smart_alert` | §9.1 | NEW TABLE |
| 17 | Новая таблица `smart_alert_log` | §9.1 | NEW TABLE |
| 18 | Новая таблица `chat_message` | §10.1 | NEW TABLE |
| 19 | Все индексы `idx_order_*` → `idx_custorder_*`, `idx_user_*` → `idx_appuser_*` | §1.2 | RENAME INDEX |
| 20 | Все FK `REFERENCES "order"(id)` → `REFERENCES customer_order(id)` | §1.2 | ALTER FK |
| 21 | Все FK `REFERENCES "user"(id)` → `REFERENCES app_user(id)` | §1.2 | ALTER FK |

---

## Table 1. app_user

> Переименована из `"user"` (§1.2). Добавлен `status` для invite-flow (§2.4).

```sql
CREATE TABLE app_user (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) NOT NULL UNIQUE,
    role            VARCHAR(20) NOT NULL,
    full_name       VARCHAR(255),
    status          VARCHAR(20) NOT NULL DEFAULT 'active',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT appuser_role_check CHECK (role IN ('customer', 'picker', 'partner', 'admin')),
    CONSTRAINT appuser_status_check CHECK (status IN ('invited', 'active', 'deleted'))
);

COMMENT ON COLUMN app_user.status
    IS 'invited = предсоздан admin (picker/partner), ожидает OTP-верификации; '
       'active = штатный; deleted = soft-deleted (grace 30 дней, затем анонимизация).';

CREATE INDEX idx_appuser_phone ON app_user(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_appuser_role ON app_user(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_appuser_status ON app_user(status) WHERE deleted_at IS NULL;
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 2. customer_order ← ALTERED v1.4.8

> Переименована из `"order"` (§1.2). Удалён `bnpl_status` (§1.3).
> **v1.4.8:** Добавлены статусы `ready`, `customer_arrived` (Патч #3). Добавлен `sbp` в payment_provider (Патч #5). Новые timestamps: `ready_at`, `customer_arrived_at`.

```sql
CREATE TABLE customer_order (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id             UUID NOT NULL REFERENCES app_user(id),
    store_id                UUID NOT NULL REFERENCES store(id),
    picker_id               UUID REFERENCES app_user(id),

    status                  VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_provider        VARCHAR(50) NOT NULL,

    total_amount            INTEGER NOT NULL DEFAULT 0,
    original_total_amount   INTEGER NOT NULL DEFAULT 0,

    bnpl_external_id        VARCHAR(255),
    -- bnpl_status УДАЛЁН (§1.3): статусы BNPL отслеживаются через payment_transaction.type

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at            TIMESTAMPTZ,
    picked_at               TIMESTAMPTZ,
    ready_at                TIMESTAMPTZ,              -- NEW v1.4.8 (Патч #3)
    customer_arrived_at     TIMESTAMPTZ,              -- NEW v1.4.8 (Патч #3)
    completed_at            TIMESTAMPTZ,
    cancelled_at            TIMESTAMPTZ,

    CONSTRAINT custorder_status_check
        CHECK (status IN ('pending', 'confirmed', 'picking',
                          'ready', 'customer_arrived',
                          'completed', 'cancelled')),
    CONSTRAINT custorder_payment_status_check
        CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    CONSTRAINT custorder_payment_provider_check
        CHECK (payment_provider IN ('tinkoff', 'sbp', 'yandex_split', 'dolyame'))
);

COMMENT ON COLUMN customer_order.total_amount
    IS 'Текущая сумма заказа (копейки). Пересчитывается при weigh/replace/cancel.';

COMMENT ON COLUMN customer_order.original_total_amount
    IS 'Snapshot of totalAmount at order creation (kopecks). Immutable after POST /orders. '
       'Used for: (1) BNPL schedule sync — if finalAmount ≠ originalTotalAmount → resync; '
       '(2) UI strikethrough in OrderDetailScreen when totalAmount changes after weighing/replacement.';

COMMENT ON COLUMN customer_order.payment_status
    IS 'pending = awaiting payment; paid = paid (includes partial refund orders); refunded = full refund.';

COMMENT ON COLUMN customer_order.ready_at
    IS 'Timestamp перехода picking → ready (Патч #3). Capture payment происходит на этом переходе.';

COMMENT ON COLUMN customer_order.customer_arrived_at
    IS 'Timestamp перехода ready → customer_arrived (Патч #3). Покупатель нажал «Я на месте».';

CREATE INDEX idx_custorder_customer_status ON customer_order(customer_id, status);
CREATE INDEX idx_custorder_picker_status ON customer_order(picker_id, status) WHERE picker_id IS NOT NULL;
CREATE INDEX idx_custorder_store_completed ON customer_order(store_id, completed_at) WHERE status = 'completed';
CREATE INDEX idx_custorder_payment_status ON customer_order(payment_status, status);
```

**Ключевые изменения v1.4.8 (Snapshot v1.1):**
- `custorder_status_check` расширен: +`ready`, +`customer_arrived` (Патч #3)
- Новые колонки: `ready_at`, `customer_arrived_at` (Патч #3)
- `custorder_payment_provider_check` расширен: +`sbp` (Патч #5)

**State machine (v1.4.8):**

```
pending → confirmed → picking → ready → customer_arrived → completed
  ↓          ↓          ↓
cancelled  cancelled  cancelled
```

> `ready`, `customer_arrived` нельзя cancel (capture уже произведён при picking → ready).

---

## Table 3. order_item

```sql
CREATE TABLE order_item (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
    product_id              UUID NOT NULL REFERENCES product(id),

    current_price           INTEGER NOT NULL,
    final_price             INTEGER NOT NULL,

    requested_quantity      NUMERIC(10,3) NOT NULL,
    actual_quantity         NUMERIC(10,3),
    quantity_unit           VARCHAR(10) NOT NULL,

    status                  VARCHAR(20) NOT NULL DEFAULT 'active',
    replacement_for_item_id UUID REFERENCES order_item(id),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orderitem_quantity_unit_check CHECK (quantity_unit IN ('kg', 'pcs')),
    CONSTRAINT orderitem_status_check CHECK (status IN ('active', 'replaced', 'cancelled')),
    CONSTRAINT orderitem_actual_quantity_check
        CHECK (quantity_unit = 'pcs' OR actual_quantity IS NULL OR actual_quantity > 0)
);

COMMENT ON COLUMN order_item.actual_quantity
    IS 'Взвешенное количество для весовых товаров. NULL если ещё не взвешено.';

COMMENT ON COLUMN order_item.final_price
    IS 'Для весовых (kg): final_price = current_price * actual_quantity. '
       'Для штучных (pcs): final_price = current_price.';

CREATE INDEX idx_orderitem_order ON order_item(order_id, status);
CREATE INDEX idx_orderitem_product ON order_item(product_id);
```

Без изменений в v1.4.8 / v1.4.9 / v1.4.10.

---

## Table 4. partner

```sql
CREATE TABLE partner (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    legal_name      VARCHAR(500) NOT NULL,
    inn             VARCHAR(12) NOT NULL UNIQUE,

    contact_email   VARCHAR(255) NOT NULL,
    contact_phone   VARCHAR(20) NOT NULL,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partner_inn ON partner(inn);
```

Без изменений в v1.4.6–v1.4.11.

---

## Table 5. store

```sql
CREATE TABLE store (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id      UUID NOT NULL REFERENCES partner(id),
    name            VARCHAR(255) NOT NULL,
    address         TEXT NOT NULL,

    lat             NUMERIC(10,7) NOT NULL,
    lon             NUMERIC(10,7) NOT NULL,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_store_partner ON store(partner_id);
CREATE INDEX idx_store_location ON store USING gist(ll_to_earth(lat, lon));
CREATE INDEX idx_store_fts ON store USING gin(
    to_tsvector('russian', name || ' ' || address)
);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 6. category

> Новая таблица (§3.1).

```sql
CREATE TABLE category (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    image_url       TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_category_active ON category(sort_order) WHERE is_active = TRUE;
CREATE INDEX idx_category_fts ON category USING gin(
    to_tsvector('russian', name)
);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 7. product

> Расширена каталожными колонками (§3.2). Добавлен FTS-индекс (§4.2).

```sql
CREATE TABLE product (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES store(id),
    category_id     UUID REFERENCES category(id),
    name            VARCHAR(255) NOT NULL,

    current_price   INTEGER NOT NULL,
    quantity_unit   VARCHAR(10) NOT NULL,

    description     TEXT,
    brand           VARCHAR(255),
    weight_value    NUMERIC(10,3),
    weight_unit     VARCHAR(10),
    country_origin  VARCHAR(100),

    kcal            NUMERIC(7,2),
    proteins        NUMERIC(7,2),
    fats            NUMERIC(7,2),
    carbs           NUMERIC(7,2),

    image_url       TEXT,
    is_available    BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT product_quantity_unit_check CHECK (quantity_unit IN ('kg', 'pcs'))
);

COMMENT ON COLUMN product.weight_value IS 'Масса нетто для отображения (например 0.5 кг, 200 г). Не влияет на pricing.';
COMMENT ON COLUMN product.kcal IS 'Калорийность на 100г. Опционально.';

CREATE INDEX idx_product_store ON product(store_id, is_available);
CREATE INDEX idx_product_category ON product(category_id) WHERE is_available = TRUE;
CREATE INDEX idx_product_fts ON product USING gin(
    to_tsvector('russian',
        coalesce(name, '') || ' ' ||
        coalesce(brand, '') || ' ' ||
        coalesce(description, '')
    )
);
CREATE INDEX idx_product_trigram ON product USING gin(name gin_trgm_ops);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 8. product_image

> Новая таблица (§3.1).

```sql
CREATE TABLE product_image (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    image_url       TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_productimage_product ON product_image(product_id, sort_order);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 9. otp_session

> Новая таблица (§2.1). Auth OTP flow.

```sql
CREATE TABLE otp_session (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) NOT NULL,
    code            VARCHAR(6) NOT NULL,
    attempts        INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    verified_at     TIMESTAMPTZ,

    CONSTRAINT otpsession_status_check
        CHECK (status IN ('pending', 'verified', 'expired', 'blocked'))
);

COMMENT ON COLUMN otp_session.expires_at IS 'created_at + 2 min. Проверяется при verify-otp.';
COMMENT ON COLUMN otp_session.attempts IS 'Max 3. При превышении → status = blocked.';

CREATE INDEX idx_otpsession_phone_status ON otp_session(phone, status, created_at);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 10. refresh_token ← ALTERED v1.4.8

> Новая таблица (§2.1). JWT refresh token storage.
> **v1.4.8:** Добавлены `push_token`, `push_platform` для push-маршрутизации (Патч #2).

```sql
CREATE TABLE refresh_token (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    token_hash      VARCHAR(64) NOT NULL,
    device_info     TEXT,

    push_token      TEXT,                          -- NEW v1.4.8 (Патч #2)
    push_platform   VARCHAR(10),                   -- NEW v1.4.8 (Патч #2)

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,

    CONSTRAINT refreshtoken_hash_unique UNIQUE (token_hash),
    CONSTRAINT refreshtoken_push_platform_check
        CHECK (push_platform IS NULL
            OR push_platform IN ('fcm', 'apns', 'rustore'))
);

COMMENT ON COLUMN refresh_token.token_hash IS 'SHA-256 hash. Оригинальный токен не хранится.';
COMMENT ON COLUMN refresh_token.device_info IS 'User-Agent / device model для UI «Активные сессии».';
COMMENT ON COLUMN refresh_token.push_token
    IS 'FCM/APNs/RuStore device token. Обновляется POST /auth/register-push (API Contract v1.4.4, эндпоинт #54). '
       'NULL = push unavailable → SMS fallback.';
COMMENT ON COLUMN refresh_token.push_platform
    IS 'fcm (MVP primary), apns (Apple Push), rustore (post-MVP).';

CREATE INDEX idx_refreshtoken_user ON refresh_token(user_id, revoked_at);
CREATE INDEX idx_refreshtoken_expires ON refresh_token(expires_at) WHERE revoked_at IS NULL;
```

**Ключевые изменения v1.4.8 (Патч #2):**
- Новые колонки: `push_token` (TEXT), `push_platform` (VARCHAR(10))
- Новый CHECK: `refreshtoken_push_platform_check` — `fcm` | `apns` | `rustore` | NULL
- Push token обновляется через `POST /auth/register-push` (API Contract v1.4.4, эндпоинт #54)

---

## Table 11. cart

> Новая таблица (§5.1). Server-side корзина, one-per-customer.

```sql
CREATE TABLE cart (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 12. cart_item

> Новая таблица (§5.1). Цена НЕ хранится — всегда актуальная из `product.current_price`.

```sql
CREATE TABLE cart_item (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id         UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES product(id),
    store_id        UUID NOT NULL REFERENCES store(id),
    quantity        NUMERIC(10,3) NOT NULL DEFAULT 1,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cartitem_unique UNIQUE (cart_id, product_id),
    CONSTRAINT cartitem_quantity_positive CHECK (quantity > 0)
);

COMMENT ON COLUMN cart_item.store_id
    IS 'Денормализация store_id из product для быстрой группировки по магазинам при checkout.';

CREATE INDEX idx_cartitem_cart ON cart_item(cart_id);
CREATE INDEX idx_cartitem_store ON cart_item(cart_id, store_id);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 13. deletion_request

> Новая таблица (§6.1). Soft delete, grace 30 дней.

```sql
CREATE TABLE deletion_request (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user(id),
    reason          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',

    requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_at    TIMESTAMPTZ NOT NULL,
    executed_at     TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,

    CONSTRAINT deletionreq_status_check
        CHECK (status IN ('pending', 'executed', 'cancelled'))
);

COMMENT ON COLUMN deletion_request.scheduled_at IS 'requested_at + 30 days. CRON daily 04:00 MSK исполняет.';

CREATE UNIQUE INDEX idx_deletionreq_user_pending
    ON deletion_request(user_id) WHERE status = 'pending';
CREATE INDEX idx_deletionreq_scheduled
    ON deletion_request(scheduled_at) WHERE status = 'pending';
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 14. favorite

> Новая таблица (§7.1). Полиморфная: product + store.

```sql
CREATE TABLE favorite (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    entity_type     VARCHAR(20) NOT NULL,
    entity_id       UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT favorite_entity_type_check CHECK (entity_type IN ('product', 'store')),
    CONSTRAINT favorite_unique UNIQUE (user_id, entity_type, entity_id)
);

CREATE INDEX idx_favorite_user_type ON favorite(user_id, entity_type, created_at DESC);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 15. address

> Новая таблица (§8.1). До 5 адресов на пользователя (app-level).

```sql
CREATE TABLE address (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    label           VARCHAR(100),
    address         TEXT NOT NULL,
    lat             NUMERIC(10,7) NOT NULL,
    lon             NUMERIC(10,7) NOT NULL,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN address.label IS 'Пользовательская метка: «Дом», «Работа» и т.д.';
COMMENT ON COLUMN address.is_default IS 'Ровно один true на пользователя. Auto-promote при удалении.';

CREATE INDEX idx_address_user ON address(user_id);
CREATE UNIQUE INDEX idx_address_user_default
    ON address(user_id) WHERE is_default = TRUE;
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 16. smart_alert

> Новая таблица (§9.1). Push-only, 3 триггера, max 20 active per user.

```sql
CREATE TABLE smart_alert (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,

    trigger_type    VARCHAR(30) NOT NULL,
    entity_type     VARCHAR(20) NOT NULL,
    entity_id       UUID NOT NULL,

    schedule        VARCHAR(20) NOT NULL DEFAULT 'all_day',
    threshold       NUMERIC(10,2),
    reference_price INTEGER,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_fired_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT smartalert_trigger_check
        CHECK (trigger_type IN ('price_drop', 'back_in_stock', 'price_threshold')),
    CONSTRAINT smartalert_entity_check
        CHECK (entity_type IN ('product', 'category')),
    CONSTRAINT smartalert_schedule_check
        CHECK (schedule IN ('morning', 'evening', 'all_day'))
);

COMMENT ON COLUMN smart_alert.threshold IS 'Для price_threshold: целевая цена в копейках.';
COMMENT ON COLUMN smart_alert.reference_price IS 'Для price_drop: цена на момент создания alert. Drop ≥5% → fire.';
COMMENT ON COLUMN smart_alert.schedule IS 'morning = 08–12 MSK, evening = 17–21 MSK, all_day = 08–21 MSK.';

CREATE INDEX idx_smartalert_user ON smart_alert(user_id, is_active);
CREATE INDEX idx_smartalert_entity ON smart_alert(entity_type, entity_id) WHERE is_active = TRUE;
CREATE INDEX idx_smartalert_cron ON smart_alert(trigger_type, is_active, last_fired_at)
    WHERE is_active = TRUE;
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 17. smart_alert_log

> Новая таблица (§9.1). История срабатываний.

```sql
CREATE TABLE smart_alert_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id        UUID NOT NULL REFERENCES smart_alert(id) ON DELETE CASCADE,
    fired_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payload         JSONB NOT NULL DEFAULT '{}'
);

COMMENT ON COLUMN smart_alert_log.payload IS 'Содержит: old_price, new_price, product_id, store_id и т.д.';

CREATE INDEX idx_smartalertlog_alert ON smart_alert_log(alert_id, fired_at DESC);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 18. chat_message

> Новая таблица (§10.1). Order-scoped, text-only, WS + REST.

```sql
CREATE TABLE chat_message (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES customer_order(id),
    sender_id       UUID NOT NULL REFERENCES app_user(id),
    sender_role     VARCHAR(20) NOT NULL,
    body            VARCHAR(1000) NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at         TIMESTAMPTZ,

    CONSTRAINT chatmsg_sender_role_check CHECK (sender_role IN ('customer', 'picker')),
    CONSTRAINT chatmsg_body_nonempty CHECK (length(body) > 0)
);

CREATE INDEX idx_chatmsg_order ON chat_message(order_id, created_at);
CREATE INDEX idx_chatmsg_unread ON chat_message(order_id, sender_role)
    WHERE read_at IS NULL;
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 19. partner_tariff

```sql
CREATE TABLE partner_tariff (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id          UUID NOT NULL REFERENCES partner(id),

    commission_percent  NUMERIC(5,2) NOT NULL,

    effective_from      DATE NOT NULL,
    effective_to        DATE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tariff_commission_range CHECK (commission_percent >= 0 AND commission_percent <= 100),
    CONSTRAINT tariff_dates_order CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE INDEX idx_tariff_partner_dates ON partner_tariff(partner_id, effective_from, effective_to);
```

Без изменений в v1.4.6–v1.4.11.

---

## Table 20. settlement_period ← ALTERED v1.4.11

> Добавлен `disputed` в CHECK constraint (§1.1).
> **v1.4.10:** Добавлена колонка `total_disputed_lines` для поддержки Dispute API (Settlement v1.2.2, sec 8.1). Добавлен индекс `idx_settlement_disputed` для фильтрации периодов с disputed строками.
> **v1.4.11:** Добавлена колонка `payout_ref` для хранения идентификатора банковского перевода при payout (Settlement v1.2.2 sec 10, IC v1.6.4 sec 1.4).

```sql
CREATE TABLE settlement_period (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id          UUID NOT NULL REFERENCES partner(id),

    period_start        DATE NOT NULL,
    period_end          DATE NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'calculating',

    total_gmv           NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_commission    NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_payout        NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_disputed_lines INTEGER NOT NULL DEFAULT 0,       -- NEW v1.4.10 (Fix #1)

    review_deadline     DATE,
    report_url          TEXT,
    payout_ref          TEXT,                            -- NEW v1.4.11 (Payout Execution)

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT settlement_status_check
        CHECK (status IN ('calculating', 'review', 'disputed', 'approved', 'paid')),
    CONSTRAINT settlement_dates_order CHECK (period_end > period_start)
);

COMMENT ON COLUMN settlement_period.total_disputed_lines
    IS 'Кол-во settlement_line со status=disputed в данном периоде. '
       'Обновляется при PUT /partner/settlements/:periodId/dispute. '
       'Используется в Dispute API response (Settlement v1.2.2 sec 8.1).';

COMMENT ON COLUMN settlement_period.payout_ref
    IS 'Идентификатор банковского перевода (transferId). Заполняется при переходе approved → paid. '
       'NULL до исполнения payout. См. Settlement v1.2.2 sec 10, IC v1.6.4 sec 1.4.';

CREATE UNIQUE INDEX idx_settlement_partner_period
    ON settlement_period(partner_id, period_start, period_end);

-- NEW v1.4.10 (Fix #1): для фильтрации/мониторинга периодов с disputed строками
CREATE INDEX idx_settlement_disputed
    ON settlement_period(status, total_disputed_lines)
    WHERE total_disputed_lines > 0;
```

**Ключевые изменения v1.4.10 (Patch Bundle v1.0, Fix #1):**
- Новая колонка: `total_disputed_lines` (INTEGER NOT NULL DEFAULT 0) — кеш-счётчик disputed строк для Dispute API response
- Новый индекс: `idx_settlement_disputed` — partial index для периодов с >0 disputed строк
- Обновляется при `PUT /partner/settlements/:periodId/dispute` — `UPDATE settlement_period SET total_disputed_lines = (SELECT COUNT(*) FROM settlement_line WHERE period_id = :periodId AND status = 'disputed')`

**Ключевые изменения v1.4.11 (Snapshot решений 16.02.2026):**
- Новая колонка: `payout_ref` (TEXT, nullable) — идентификатор банковского перевода, заполняется при `executepayout()` (Settlement v1.2.2 sec 10)
- Zero-downtime migration: `ALTER TABLE settlement_period ADD COLUMN payout_ref TEXT;` — nullable, без DEFAULT, мгновенно

**Migration SQL v1.4.10 → v1.4.11:**

```sql
-- Zero-downtime: ADD COLUMN nullable TEXT — metadata-only operation in PostgreSQL
ALTER TABLE settlement_period ADD COLUMN payout_ref TEXT;

COMMENT ON COLUMN settlement_period.payout_ref
    IS 'Bank transfer reference (transferId). Set on approved → paid transition. '
       'NULL until payout execution. See Settlement v1.2.2 sec 10, IC v1.6.4 sec 1.4.';
```

---

## Table 21. settlement_line

```sql
CREATE TABLE settlement_line (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id           UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
    order_id            UUID NOT NULL REFERENCES customer_order(id),

    gmv                 NUMERIC(12,2) NOT NULL,
    commission_pct      NUMERIC(5,2) NOT NULL,
    commission_amt      NUMERIC(12,2) NOT NULL,
    payout_amt          NUMERIC(12,2) NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'pending',

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT settleline_status_check CHECK (status IN ('pending', 'disputed', 'approved'))
);

CREATE INDEX idx_settleline_period ON settlement_line(period_id, status);
CREATE INDEX idx_settleline_order ON settlement_line(order_id);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 22. settlement_adjustment

```sql
CREATE TABLE settlement_adjustment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id       UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
    order_id        UUID REFERENCES customer_order(id),

    type            VARCHAR(20) NOT NULL,
    amount          NUMERIC(12,2) NOT NULL,
    reason          TEXT NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT settleadj_type_check CHECK (type IN ('refund', 'correction', 'penalty', 'bonus'))
);

CREATE INDEX idx_settleadj_period ON settlement_adjustment(period_id);
```

Без изменений в v1.4.7–v1.4.11.

---

## Table 23. payment_transaction ← INDEX v1.4.9

```sql
CREATE TABLE payment_transaction (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES customer_order(id),

    type            VARCHAR(50) NOT NULL,
    provider        VARCHAR(50) NOT NULL,
    provider_ref    VARCHAR(255) NOT NULL,

    amount          INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT paytx_type_check CHECK (type IN ('hold', 'capture', 'refund', 'cancel',
                                                 'bnpl_authorize', 'bnpl_commit', 'bnpl_cancel')),
    CONSTRAINT paytx_status_check CHECK (status IN ('pending', 'success', 'failed'))
);

CREATE INDEX idx_paytx_order ON payment_transaction(order_id, created_at);
CREATE INDEX idx_paytx_provider ON payment_transaction(provider, created_at);

-- NEW v1.4.9 (Патч #7): idempotency для Tinkoff webhook (API Contract v1.4.4 sec 13.1)
CREATE UNIQUE INDEX idx_pay_tx_provider_ref
    ON payment_transaction(provider, provider_ref);
```

**Ключевые изменения v1.4.9 (Patch Snapshot v1.2, Патч #7):**
- Новый unique index `idx_pay_tx_provider_ref(provider, provider_ref)` — гарантирует idempotency при обработке webhook-нотификаций от Tinkoff (карта + СБП). Дублирование по `(PaymentId, Status)` → no-op на уровне приложения, unique index — защита на уровне БД.
- См. API Contract v1.4.4, sec 13.1 (`POST /api/v1/webhooks/tinkoff`).

---

## Table 24. order_rating

> Новая таблица (Патч #1, v1.4.7). Оценка заказа покупателем. Шкала 1–5, idempotent upsert.

```sql
CREATE TABLE order_rating (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES customer_order(id),
    customer_id     UUID NOT NULL REFERENCES app_user(id),

    rating          SMALLINT NOT NULL,
    comment         VARCHAR(500),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orderrating_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT orderrating_order_unique UNIQUE (order_id)
);

COMMENT ON COLUMN order_rating.rating IS 'Шкала 1–5. Ставится после status = completed.';
COMMENT ON COLUMN order_rating.updated_at IS 'Обновляется при повторном upsert (idempotent).';

CREATE INDEX idx_orderrating_order ON order_rating(order_id);
CREATE INDEX idx_orderrating_customer ON order_rating(customer_id, created_at DESC);
```

Без изменений в v1.4.8–v1.4.11.

---

## Required Extensions

```sql
-- FTS trigram fallback (§4.2)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Geo distance (store search)
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
-- earthdistance depends on cube
```

---

## Table Summary

| # | Таблица | Статус v1.4.10 | Snapshot § / Патч |
|---|---------|----------------|-------------------|
| 1 | `app_user` | RENAMED + ALTERED | §1.2, §2.4 |
| 2 | `customer_order` | **ALTERED v1.4.8** | §1.2, §1.3, **Патч #3, #5** |
| 3 | `order_item` | FK UPDATED | §1.2 |
| 4 | `partner` | — | — |
| 5 | `store` | FTS INDEX | §4.2 |
| 6 | `category` | NEW (v1.4.6) | §3.1 |
| 7 | `product` | ALTERED + FTS | §3.2, §4.2 |
| 8 | `product_image` | NEW (v1.4.6) | §3.1 |
| 9 | `otp_session` | NEW (v1.4.6) | §2.1 |
| 10 | `refresh_token` | **ALTERED v1.4.8** | §2.1, **Патч #2** |
| 11 | `cart` | NEW (v1.4.6) | §5.1 |
| 12 | `cart_item` | NEW (v1.4.6) | §5.1 |
| 13 | `deletion_request` | NEW (v1.4.6) | §6.1 |
| 14 | `favorite` | NEW (v1.4.6) | §7.1 |
| 15 | `address` | NEW (v1.4.6) | §8.1 |
| 16 | `smart_alert` | NEW (v1.4.6) | §9.1 |
| 17 | `smart_alert_log` | NEW (v1.4.6) | §9.1 |
| 18 | `chat_message` | NEW (v1.4.6) | §10.1 |
| 19 | `partner_tariff` | — | — |
| 20 | `settlement_period` | **ALTERED v1.4.11** | §1.1, **Fix #1**, **Payout** |
| 21 | `settlement_line` | FK UPDATED | §1.2 |
| 22 | `settlement_adjustment` | FK UPDATED | §1.2 |
| 23 | `payment_transaction` | **INDEX v1.4.9** | §1.2, **Патч #7** |
| 24 | `order_rating` | NEW (v1.4.7) | Патч #1 |

**Итого: 24 таблицы. 4 таблицы изменены в v1.4.8–v1.4.11: `customer_order` (v1.4.8), `refresh_token` (v1.4.8), `payment_transaction` (v1.4.9 — index), `settlement_period` (v1.4.10 — disputed column + index; v1.4.11 — payout_ref column).**

---

## CRON Jobs (полный реестр)

| Job | Schedule | Описание | Связанные таблицы |
|-----|----------|----------|-------------------|
| Hold Auto-Cancel | Every 1 min | Отмена pending заказов >15 мин | `customer_order` |
| Settlement Pipeline | Daily 03:00 MSK | **Step 1:** расчёт периодов, GMV, комиссий, adjustments, PDF, email → `review`. **Step 2:** auto-approve периодов с истёкшим `review_deadline` (disputed lines = 0 → `approved`; >0 → alert ops). **Step 3:** health check + alert при total_time > 5 min. Sequential execution. | `settlement_period`, `settlement_line` |
| Account Deletion | Daily 04:00 MSK | Исполнение удалений с grace >30 дней | `deletion_request`, `app_user`, `refresh_token`, `cart` |
| Smart Alerts Engine | Every 30 min | Проверка триггеров + отправка push | `smart_alert`, `smart_alert_log`, `product` |
| OTP/Token Cleanup | Every 1 hour | Каноничный SQL (Патч #4): (1) OTP expired (кроме verified) старше 24ч → DELETE; (2) OTP verified старше 7 дней → DELETE; (3) Refresh revoked старше 7 дней → DELETE; (4) Refresh naturally expired → DELETE | `otp_session`, `refresh_token` |

### Каноничный SQL — OTP/Token Cleanup (Патч #4)

```sql
-- 1. OTP: удаляем expired (кроме verified) старше 24ч
DELETE FROM otp_session
 WHERE expires_at < NOW() - INTERVAL '24 hours'
   AND status != 'verified';

-- 2. OTP: удаляем verified старше 7 дней
DELETE FROM otp_session
 WHERE status = 'verified'
   AND verified_at < NOW() - INTERVAL '7 days';

-- 3. Refresh: удаляем отозванные старше 7 дней
DELETE FROM refresh_token
 WHERE revoked_at IS NOT NULL
   AND revoked_at < NOW() - INTERVAL '7 days';

-- 4. Refresh: удаляем натурально истёкшие
DELETE FROM refresh_token
 WHERE expires_at < NOW();
```

---

## Document Version Matrix (UPDATED v1.4.11)

> **v1.4.10 FIX:** В v1.4.9 Version Matrix содержала устаревшие ссылки. Исправлено.
> **v1.4.11:** Spec обновлён до v1.4.5, Data Model self → v1.4.11.

| Document | Version | Min Compatible |
|----------|---------|----------------|
| Data Model | **v1.4.11** | v1.4.10 |
| Spec | **v1.4.5** | v1.4.3 |
| API Contract | **v1.4.4** | v1.4.3 |
| Navigation | **v1.4.4** | v1.4.3 |
| Integration Contracts | **v1.6.4** | v1.6.3 |
| BNPL Integration | **v1.2.2** | v1.2.2 |
| Settlement | **v1.2.2** | v1.2.1 |

---

Data Model v1.4.11 (Consolidated) — 16.02.2026 — Robin Food Product & Engineering Team
