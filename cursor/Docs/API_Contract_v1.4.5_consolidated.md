# Robin Food — API Contract v1.4.5 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.4.5 | 16.02.2026 | Consolidated | Robin Food Product Engineering Team |

**Scope v1.4.4:** Полная версия API Contract — существующие контракты (orders, picker, settlement) + 8 новых доменов (Auth, Catalog, Search, Cart, Profile, Favorites, Addresses, Smart Alerts, Chat) + Order History & Rating. Глобальная Rate Limit Policy. **Патчи Snapshot v1.1:** consentAccepted (#1), register-push (#2), статусы ready/customer_arrived (#3), sbp payment_provider (#5). **Патчи Snapshot v1.2:** webhook Tinkoff (#1), WS full contract (#2), Admin API (#3), image upload (#4), СБП QR-flow (#5). **Patch Bundle v1.0:** Fix #1 Dispute API alignment (lineIds), Fix #4 OpenAPI ref. **Patch Snapshot v1.4.5:** Version Matrix sync (IC v1.6.4, Settlement v1.2.2, Nav v1.4.4), Appendix F Versioning Policy ref.

**Зависимости:** Spec v1.4.4, Data Model v1.4.10, Settlement v1.2.2, BNPL Integration v1.2.2, Integration Contracts v1.6.4, Navigation v1.4.4

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026), Patch Bundle v1.0 (16.02.2026), Snapshot решений (16.02.2026)

---

## Changelog v1.4.4 → v1.4.5

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Document Version Matrix — полная синхронизация: API Contract self **v1.4.3→v1.4.4**, Spec **v1.4.3→v1.4.4**, Data Model **v1.4.9→v1.4.10**, Navigation **v1.4.3→v1.4.4**, Integration Contracts **v1.6.3→v1.6.4**, Settlement **v1.2.1→v1.2.2** | §1.2 Version Matrix | METADATA |
| 2 | Dependencies header — Settlement v1.2.1→**v1.2.2**, IC v1.6.3→**v1.6.4**, Navigation v1.4.3→**v1.4.4** | §1.2 Cross-ref sync | METADATA |
| 3 | Appendix F — добавлен блок «Versioning»: ссылка на Spec v1.4.5 sec 2.16 API Versioning Policy (URL prefix, breaking-change rules, deprecation) | §4.2 API Versioning | ADD REF |

---

## Changelog v1.4.3 → v1.4.4

| # | Изменение | Patch Bundle v1.0 | Тип |
|---|-----------|-------------------|-----|
| 1 | REWRITTEN sec 11.1: `POST /partner/settlements/:periodId/dispute` — request body `orderIds` → `lineIds` (line-level granularity), response aligned with Settlement v1.2.1 (`periodId`, `status`, `disputedLinesCount`, `totalDisputedLines`), re-dispute разрешён, error `PERIOD_ALREADY_DISPUTED` → `PERIOD_NOT_DISPUTABLE`, новые ошибки `INVALID_LINE_IDS`, `PERIOD_NOT_FOUND` | Fix #1 | REWRITE ENDPOINT |
| 2 | NEW: Appendix F — OpenAPI Reference (`openapi.yaml` v1.4.4, 61 endpoint, codegen + mock + autotests) | Fix #4 | NEW APPENDIX |
| 3 | Version Matrix: Spec → v1.4.4, Data Model → v1.4.10; API Contract self → v1.4.4 | Fix #1, #3 | METADATA |
| 4 | Appendix A: note — Localization Policy ref → Spec v1.4.4 sec 14 | Fix #9 | ADD REF |

---

## Changelog v1.4.2 → v1.4.3

| # | Изменение | Патч Snapshot v1.2 | Тип |
|---|-----------|-------------------|-----|
| 1 | NEW sec 13.1: `POST /api/v1/webhooks/tinkoff` — incoming payment notification (Tinkoff + СБП). IP whitelist, HMAC, idempotency, processing logic | Патч #1 | NEW ENDPOINT |
| 2 | EXPANDED sec 12.1: Full WebSocket connection contract — auth (JWT query param), heartbeat (30s ping/10s pong), reconnect (backoff 1–30s), custom close codes (4001/4003/4008/4029), rate limit (3 conn/user, 10 msg/min), offline queue (Redis 5min/50 events), message envelope (idempotencyKey) | Патч #2 | EXPANDED |
| 3 | NEW sec 14: Admin API — `POST /admin/users/invite` (14.1), `GET /admin/users` (14.2), CLI script (14.3) | Патч #3 | NEW SECTION |
| 4 | NEW sec 2.9: `POST /partner/products/:id/images` — multipart upload (JPEG/PNG/WebP, max 5MB), server-side resize → S3 | Патч #4 | NEW ENDPOINT |
| 5 | NEW sec 2.10: `DELETE /partner/products/:id/images/:imageId` — soft delete image | Патч #4 | NEW ENDPOINT |
| 6 | UPDATED sec 4.6: checkout response — добавлено поле `qrCodeUrl` (string\|null) для СБП flow | Патч #5 | ALTER RESPONSE |
| 7 | Appendix D: +5 эндпоинтов (#58–#62), итого 61 | Патч #1, #3, #4 | UPDATE SUMMARY |
| 8 | Version Matrix: все зависимости обновлены (Spec/Nav → v1.4.3, DM → v1.4.9, IC → v1.6.3) | Патч v1.2 meta | METADATA |

---

## Changelog v1.4.1 → v1.4.2

| # | Изменение | Патч Snapshot v1.1 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 1.2: `consentAccepted` в request body verify-otp + ошибка `400 CONSENT_REQUIRED` + processing step 4.5 | Патч #1 | NEW FIELD + ERROR |
| 2 | NEW: `POST /api/v1/auth/register-push` — регистрация push-токена (sec 1.6) | Патч #2 | NEW ENDPOINT |
| 3 | Sec 10.7: `PUT /picker/orders/:id/complete` → status `ready` (было `completed`) | Патч #3 | ALTER SEMANTICS |
| 4 | NEW: `POST /api/v1/orders/:id/arrived` — покупатель на месте (sec 10.10) | Патч #3 | NEW ENDPOINT |
| 5 | NEW: `POST /api/v1/picker/orders/:id/confirm-pickup` — подтверждение выдачи (sec 10.11) | Патч #3 | NEW ENDPOINT |
| 6 | Sec 10.1: GET /orders/:id — добавлены `readyAt`, `customerArrivedAt`; status enum расширен | Патч #3 | ALTER RESPONSE |
| 7 | Sec 10.4, 10.8: status enum расширен на `ready`, `customer_arrived` | Патч #3 | ALTER RESPONSE |
| 8 | Sec 9.1/9.2: Chat lifecycle расширен на `ready`, `customer_arrived` | Патч #3 | ALTER LIFECYCLE |
| 9 | Sec 4.6: `paymentMethod` enum расширен на `sbp`; active orders включают `ready`, `customer_arrived` | Патч #3, #5 | ALTER ENUM |
| 10 | Sec 5.3: active orders проверка включает `ready`, `customer_arrived` | Патч #3 | ALTER LOGIC |
| 11 | Sec 12.2: WS `order.statuschanged` — `newStatus` включает `ready`, `customer_arrived` | Патч #3 | ALTER WS |
| 12 | Все response schemas с `paymentProvider` — enum расширен на `sbp` | Патч #5 | ALTER ENUM |
| 13 | Appendix D: +3 эндпоинта (#54–#56), итого 56 | Патч #2, #3 | UPDATE SUMMARY |
| 14 | Version Matrix: все зависимости обновлены | Патч v1.1 meta | METADATA |

---

## Changelog v1.4.0 → v1.4.1

| # | Изменение | Патч Snapshot | Тип |
|---|-----------|--------------|-----|
| 1 | NEW: `GET /api/v1/orders` — список заказов покупателя (sec 10.8) | Патч #1 | NEW ENDPOINT |
| 2 | NEW: `POST /api/v1/orders/:id/rate` — оценка заказа (sec 10.9) | Патч #1 | NEW ENDPOINT |
| 3 | Sec 1.2: `403 OTP_EXPIRED` → `410 OTP_EXPIRED` | Патч #3 | FIX HTTP STATUS |
| 4 | Appendix B: добавлен `410 Gone` | Патч #3 | ADD STATUS |
| 5 | Appendix C: OTP/Token Cleanup — каноничный SQL (revoked 7d, verified 7d, expired refresh) | Патч #4 | FIX CRON |
| 6 | Appendix D: добавлены эндпоинты #52, #53 | Патч #1 | UPDATE SUMMARY |
| 7 | NEW: Appendix E — Rate Limit Policy (глобальная) | Патч #7 | NEW APPENDIX |
| 8 | Sec 1.1: ссылка на Appendix E | Патч #7 | ADD REF |
| 9 | Version Matrix: Integration Contracts min → v1.6.1, BNPL min → v1.2.1 | Патч #8 | METADATA |

---

## Changelog v1.3.3 → v1.4.0

| # | Изменение | Snapshot § | Тип |
|---|-----------|-----------|-----|
| 1 | Все SQL-ссылки `"order"` → `customer_order`, `"user"` → `app_user` в Processing Logic | §1.2 | RENAME |
| 2 | Удалены ссылки на `bnplStatus` из response schemas | §1.3 | DROP FIELD |
| 3 | NEW: Auth API — 5 эндпоинтов (send-otp, verify-otp, refresh, logout, logout-all) | §2 | NEW SECTION |
| 4 | NEW: Catalog API — 4 покупательских + 4 партнёрских эндпоинта | §3 | NEW SECTION |
| 5 | NEW: Search API — 2 эндпоинта (search, suggest) | §4 | NEW SECTION |
| 6 | NEW: Cart API — 6 эндпоинтов (CRUD + checkout) | §5 | NEW SECTION |
| 7 | NEW: Profile API — 4 эндпоинта (get, update, delete, cancel-delete) | §6 | NEW SECTION |
| 8 | NEW: Favorites API — 4 эндпоинта (list, add, delete, batch-delete) | §7 | NEW SECTION |
| 9 | NEW: Addresses API — 4 эндпоинта (list, create, update, delete) | §8 | NEW SECTION |
| 10 | NEW: Smart Alerts API — 5 эндпоинтов (CRUD + history) | §9 | NEW SECTION |
| 11 | NEW: Chat API — 3 REST-эндпоинта + 2 WS events | §10 | NEW SECTION |
| 12 | `isFavorite` boolean добавлен в ответы stores, products, search | §7.3 | ALTER RESPONSE |
| 13 | WS events: добавлены `chat.message`, `chat.read` | §10.3 | NEW WS EVENTS |
| 14 | Hold Auto-Cancel: SQL обновлён `customer_order` | §1.2 | FIX |

---

## Section 1. Auth API

### 1.1 POST /api/v1/auth/send-otp

Отправка OTP-кода по SMS (SMSC.ru).

**Request:**
```
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone": "+79991234567"
}
```

**Response 200:**
```json
{
  "otpSessionId": "uuid",
  "expiresAt": "2026-02-15T00:32:00Z",
  "retryAfter": 60
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `otpSessionId` | uuid | ID сессии OTP |
| `expiresAt` | string | ISO 8601. Время истечения кода (created_at + 2 мин) |
| `retryAfter` | integer | Секунды до разрешения повторной отправки (60 сек) |

**Rate limits:** см. Appendix E — Rate Limit Policy (Auth scope).

**Errors:**
- 429 `RATE_LIMITED` — превышен лимит отправки OTP

**429 RATE_LIMITED:**
```json
{
  "code": "RATE_LIMITED",
  "message": "Слишком частые запросы. Повторите через 45 сек",
  "details": {
    "retryAfter": 45,
    "scope": "phone"
  }
}
```

---

### 1.2 POST /api/v1/auth/verify-otp ← ALTERED v1.4.2

Верификация OTP-кода. При первом входе — авто-регистрация customer.

> **v1.4.2 (Патч #1):** Добавлено поле `consentAccepted` в request body. Обязательно при регистрации нового пользователя (152-ФЗ). Новая ошибка `400 CONSENT_REQUIRED`. Новый шаг 4.5 в Processing Logic.

**Request:**
```
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "otpSessionId": "uuid",
  "code": "482916",
  "consentAccepted": true
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `otpSessionId` | uuid | да | ID сессии OTP |
| `code` | string | да | 6-значный OTP-код |
| `consentAccepted` | boolean | Условно | **NEW v1.4.2.** Обязательно при `isNewUser = true`. Игнорируется для существующих пользователей. 152-ФЗ |

**Response 200 (существующий пользователь):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "phone": "+79991234567",
    "role": "customer",
    "fullName": "Иван Петров",
    "isNewUser": false
  }
}
```

**Response 200 (новый пользователь — авто-регистрация):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "phone": "+79991234567",
    "role": "customer",
    "fullName": null,
    "isNewUser": true
  }
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `accessToken` | string | JWT RS256, TTL 1 час |
| `refreshToken` | string | Opaque token, TTL 30 дней |
| `expiresIn` | integer | Секунды до истечения access token (3600) |
| `user.isNewUser` | boolean | `true` при авто-регистрации, для onboarding flow |

**Processing Logic:**
```
1. Validate otp_session.status = 'pending'
2. Validate otp_session.expires_at > NOW()
3. Compare code → IF mismatch:
     attempts += 1
     IF attempts >= 3 → status = 'blocked' → 403 OTP_BLOCKED
     ELSE → 400 INVALID_OTP
4. otp_session.status = 'verified'
4.5 IF app_user NOT EXISTS (new customer):                ← NEW v1.4.2 (Патч #1)
      IF consentAccepted != true → 400 CONSENT_REQUIRED
5. Find or create app_user by phone:
     IF NOT EXISTS → INSERT app_user(phone, role='customer', status='active')
     IF EXISTS AND status='invited' → status='active' (picker/partner onboard)
     IF EXISTS AND status='deleted' → 403 ACCOUNT_DELETED
6. FIFO device check: count refresh_tokens WHERE user_id AND revoked_at IS NULL
     IF count >= 3 → revoke oldest
7. Create refresh_token(user_id, token_hash=SHA256(token), device_info)
8. Issue JWT access token (RS256, claims: userId, role, iat, exp)
9. Return tokens + user
```

**Errors:**
- 400 `INVALID_OTP` — неверный код
- 400 `CONSENT_REQUIRED` — согласие на ПД не получено *(NEW v1.4.2, Патч #1)*
- 403 `OTP_BLOCKED` — 3+ неудачных попытки
- 410 `OTP_EXPIRED` — срок действия кода истёк *(v1.4.1: было 403, стало 410 Gone — Патч #3)*
- 403 `NOT_INVITED` — телефон не предрегистрирован (для picker/partner)
- 403 `ACCOUNT_DELETED` — аккаунт в процессе удаления

**400 CONSENT_REQUIRED:** *(NEW v1.4.2)*
```json
{
  "code": "CONSENT_REQUIRED",
  "message": "Необходимо согласие на обработку персональных данных",
  "details": { "field": "consentAccepted", "law": "152-ФЗ" }
}
```

---

### 1.3 POST /api/v1/auth/refresh

Ротация access + refresh токенов.

**Request:**
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "bmV3IHJlZnJlc2ggdG9r...",
  "expiresIn": 3600
}
```

**Processing Logic:**
```
1. Find refresh_token by SHA256(input_token)
2. Validate: revoked_at IS NULL AND expires_at > NOW()
3. Revoke current token (revoked_at = NOW())
4. Issue new refresh_token + new access_token
5. Return pair
```

**Errors:**
- 401 `INVALID_TOKEN` — токен не найден, отозван или истёк

---

### 1.4 POST /api/v1/auth/logout

Отзыв одного refresh token (текущее устройство).

**Request:**
```
POST /api/v1/auth/logout
Authorization: Bearer <token>
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response 204:** No Content

---

### 1.5 POST /api/v1/auth/logout-all

Отзыв всех refresh tokens пользователя (все устройства).

**Request:**
```
POST /api/v1/auth/logout-all
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "revokedCount": 3
}
```

---

### 1.6 POST /api/v1/auth/register-push ← NEW v1.4.2

> Новый эндпоинт (Патч #2). Регистрация push-токена устройства. Привязка к текущей сессии (refresh_token).

**Request:**
```
POST /api/v1/auth/register-push
Authorization: Bearer <token>
Content-Type: application/json

{
  "pushToken": "fcm-device-token-...",
  "platform": "fcm"
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `pushToken` | string | да | Device push token от FCM / APNs / RuStore |
| `platform` | string | да | `fcm` \| `apns` \| `rustore` |

**Response 204:** No Content

**Processing Logic:**
```
1. Resolve current session: access token → user_id + token_hash
2. Find refresh_token WHERE user_id AND revoked_at IS NULL
   AND token_hash = current session hash
3. UPDATE refresh_token
   SET push_token = :pushToken, push_platform = :platform
4. Return 204
```

**Вызов с клиента:** При каждом app launch + при обновлении FCM token (callback `onTokenRefresh`).

**Errors:**
- 401 `UNAUTHORIZED` — невалидный access token
- 400 `VALIDATION_ERROR` — невалидный platform

---
## Section 2. Catalog API

### 2.1 GET /api/v1/stores

Список магазинов по геолокации. Покупатель.

**Request:**
```
GET /api/v1/stores?lat=55.7558&lon=37.6173&radius=3000&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `lat` | number | да | Широта |
| `lon` | number | да | Долгота |
| `radius` | integer | нет | Радиус в метрах (default 3000, max 10000) |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "stores": [
    {
      "id": "uuid",
      "name": "Пятёрочка №1234",
      "address": "ул. Ленина, 42",
      "lat": 55.7560,
      "lon": 37.6180,
      "distance": 250,
      "productCount": 47,
      "isFavorite": false
    }
  ],
  "nextCursor": "xyz"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `distance` | integer | Метры от точки запроса |
| `productCount` | integer | Количество доступных товаров |
| `isFavorite` | boolean | Флаг избранного (§7.3) |

---

### 2.2 GET /api/v1/stores/:id

Детали магазина + категории.

**Request:**
```
GET /api/v1/stores/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Пятёрочка №1234",
  "address": "ул. Ленина, 42",
  "lat": 55.7560,
  "lon": 37.6180,
  "partnerName": "X5 Group",
  "isFavorite": true,
  "categories": [
    {
      "id": "uuid",
      "name": "Молочные продукты",
      "imageUrl": "https://...",
      "productCount": 12
    }
  ]
}
```

**Errors:**
- 404 `STORE_NOT_FOUND`

---

### 2.3 GET /api/v1/stores/:id/products

Товары магазина с фильтрацией и сортировкой. Cursor-based pagination.

**Request:**
```
GET /api/v1/stores/:id/products?categoryId=uuid&sort=price_asc&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `categoryId` | uuid | нет | Фильтр по категории |
| `sort` | string | нет | `price_asc`, `price_desc`, `name_asc` (default `name_asc`) |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Молоко 3.2%",
      "brand": "Простоквашино",
      "currentPrice": 8900,
      "quantityUnit": "pcs",
      "weightValue": 0.93,
      "weightUnit": "l",
      "imageUrl": "https://...",
      "isFavorite": false
    }
  ],
  "nextCursor": "xyz"
}
```

**Errors:**
- 404 `STORE_NOT_FOUND`

---

### 2.4 GET /api/v1/products/:id

Полная карточка товара: фото, КБЖУ, описание.

**Request:**
```
GET /api/v1/products/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "storeId": "uuid",
  "storeName": "Пятёрочка №1234",
  "categoryId": "uuid",
  "categoryName": "Молочные продукты",
  "name": "Молоко 3.2%",
  "brand": "Простоквашино",
  "description": "Молоко пастеризованное 3.2% жирности",
  "currentPrice": 8900,
  "quantityUnit": "pcs",
  "weightValue": 0.93,
  "weightUnit": "l",
  "countryOrigin": "Россия",
  "kcal": 58.0,
  "proteins": 2.9,
  "fats": 3.2,
  "carbs": 4.7,
  "images": [
    { "id": "uuid", "imageUrl": "https://...", "sortOrder": 0 },
    { "id": "uuid", "imageUrl": "https://...", "sortOrder": 1 }
  ],
  "isAvailable": true,
  "isFavorite": true
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `kcal`, `proteins`, `fats`, `carbs` | number \| null | КБЖУ на 100г. null если не указано |
| `images` | array | Упорядоченные фотографии товара |
| `isFavorite` | boolean | Флаг избранного (§7.3) |

**Errors:**
- 404 `PRODUCT_NOT_FOUND`

---

### 2.5 POST /api/v1/partner/stores/:id/products

Создание товара партнёром.

**Request:**
```
POST /api/v1/partner/stores/:id/products
Authorization: Bearer <partner-token>
Content-Type: application/json

{
  "name": "Яблоки Голден",
  "categoryId": "uuid",
  "currentPrice": 19800,
  "quantityUnit": "kg",
  "description": "Яблоки сорта Голден Делишес",
  "brand": null,
  "weightValue": null,
  "weightUnit": null,
  "countryOrigin": "Россия",
  "kcal": 52.0,
  "proteins": 0.3,
  "fats": 0.2,
  "carbs": 13.8,
  "imageUrl": "https://..."
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "Яблоки Голден",
  "currentPrice": 19800,
  "quantityUnit": "kg",
  "isAvailable": true,
  "createdAt": "2026-02-15T00:30:00Z"
}
```

**Errors:**
- 403 `FORBIDDEN` — магазин не принадлежит партнёру
- 404 `STORE_NOT_FOUND`
- 400 `VALIDATION_ERROR`

---

### 2.6 PUT /api/v1/partner/products/:id

Обновление товара (partial update).

**Request:**
```
PUT /api/v1/partner/products/:id
Authorization: Bearer <partner-token>
Content-Type: application/json

{
  "currentPrice": 17500,
  "isAvailable": true
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Яблоки Голден",
  "currentPrice": 17500,
  "isAvailable": true,
  "updatedAt": "2026-02-15T00:35:00Z"
}
```

**Errors:**
- 403 `FORBIDDEN` — товар не принадлежит партнёру
- 404 `PRODUCT_NOT_FOUND`

---

### 2.7 DELETE /api/v1/partner/products/:id

Soft delete — `is_available = false`.

**Request:**
```
DELETE /api/v1/partner/products/:id
Authorization: Bearer <partner-token>
```

**Response 204:** No Content

**Errors:**
- 403 `FORBIDDEN`
- 404 `PRODUCT_NOT_FOUND`

---

### 2.8 GET /api/v1/partner/stores/:id/products

Список товаров партнёра (включая неактивные).

**Request:**
```
GET /api/v1/partner/stores/:id/products?includeUnavailable=true&cursor=abc
Authorization: Bearer <partner-token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `includeUnavailable` | boolean | нет | Включить `is_available=false` (default `true` для партнёра) |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Яблоки Голден",
      "currentPrice": 19800,
      "quantityUnit": "kg",
      "isAvailable": true,
      "imageUrl": "https://...",
      "updatedAt": "2026-02-15T00:30:00Z"
    }
  ],
  "nextCursor": "xyz"
}
```


---

### 2.9 POST /api/v1/partner/products/:id/images ← NEW v1.4.3

> Новый эндпоинт (Patch Snapshot v1.2, Патч #4). Загрузка изображения товара. Multipart upload, server-side resize → WebP → S3 → CDN.

**Request:**
```
POST /api/v1/partner/products/:id/images
Authorization: Bearer <partner-token>
Content-Type: multipart/form-data

file:      binary (JPEG, PNG, WebP, max 5 MB)
sortOrder: int (0-9, optional, default 0)
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `file` | binary | да | Изображение (JPEG, PNG, WebP). Max 5 MB |
| `sortOrder` | integer | нет | Порядок отображения (0–9). Default 0 |

**Response 201:**
```json
{
  "id": "uuid",
  "imageUrl":  "https://cdn.robinfood.ru/products/{productId}/{imageId}.webp",
  "thumbUrl":  "https://cdn.robinfood.ru/products/{productId}/{imageId}_thumb.webp",
  "microUrl":  "https://cdn.robinfood.ru/products/{productId}/{imageId}_micro.webp",
  "sortOrder": 0,
  "createdAt": "2026-02-15T00:30:00Z"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `imageUrl` | string | Original (1200px, q80 WebP) |
| `thumbUrl` | string | Thumbnail (300px, q70 WebP) |
| `microUrl` | string | Micro (100px, q60 WebP) |

**Processing Logic:**
```
1. Validate product belongs to partner's store
2. Validate file ≤ 5 MB, format ∈ (JPEG, PNG, WebP)
3. Count images for product; IF ≥ 10 → 409 MAX_IMAGES_REACHED
4. Resize:
     original → 1200px max side, quality 80, WebP
     thumb    → 300px max side, quality 70, WebP
     micro    → 100px max side, quality 60, WebP
5. Upload 3 variants to S3 (Yandex Object Storage, ru-central1)
6. INSERT product_image(product_id, image_url, thumb_url, micro_url, sort_order)
7. Bust Redis cache for product (TTL invalidation)
8. Return image record
```

**Errors:**
- 400 `VALIDATION_ERROR` — invalid file format or size
- 403 `FORBIDDEN` — product не принадлежит партнёру
- 404 `PRODUCT_NOT_FOUND`
- 409 `MAX_IMAGES_REACHED` — лимит 10 изображений на товар
- 503 `IMAGE_UPLOAD_FAILED` — S3 upload error (retry client-side)

**409 MAX_IMAGES_REACHED:**
```json
{
  "code": "MAX_IMAGES_REACHED",
  "message": "Максимум 10 изображений на товар",
  "details": {
    "currentCount": 10,
    "maxAllowed": 10
  }
}
```

---

### 2.10 DELETE /api/v1/partner/products/:id/images/:imageId ← NEW v1.4.3

> Новый эндпоинт (Patch Snapshot v1.2, Патч #4). Soft delete изображения товара. S3-объект сохраняется 30 дней.

**Request:**
```
DELETE /api/v1/partner/products/:id/images/:imageId
Authorization: Bearer <partner-token>
```

**Response 204:** No Content

**Processing Logic:**
```
1. Validate product belongs to partner's store
2. Validate image belongs to product
3. Soft delete: product_image.deleted_at = NOW()
4. S3 object retained 30 days (lifecycle policy)
5. Bust Redis cache for product
6. Return 204
```

**Errors:**
- 403 `FORBIDDEN`
- 404 `PRODUCT_NOT_FOUND` / `IMAGE_NOT_FOUND`

---

## Section 3. Search API

### 3.1 GET /api/v1/search

Глобальный поиск: товары, магазины, категории. Fulltext (`tsvector` + GIN, словарь `russian`) с trigram fallback (`pg_trgm`) при <3 fulltext-результатах.

**Request:**
```
GET /api/v1/search?q=молоко&type=all&lat=55.7558&lon=37.6173&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `q` | string | да | Поисковый запрос (min 2 символа) |
| `type` | string | нет | `all` (default), `product`, `store`, `category` |
| `lat` | number | нет | Широта для ранжирования по расстоянию |
| `lon` | number | нет | Долгота |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "results": {
    "products": [
      {
        "id": "uuid",
        "name": "Молоко 3.2%",
        "brand": "Простоквашино",
        "currentPrice": 8900,
        "quantityUnit": "pcs",
        "storeId": "uuid",
        "storeName": "Пятёрочка №1234",
        "imageUrl": "https://...",
        "isFavorite": false
      }
    ],
    "stores": [
      {
        "id": "uuid",
        "name": "Молочный мир",
        "address": "ул. Пушкина, 10",
        "distance": 800,
        "isFavorite": true
      }
    ],
    "categories": [
      {
        "id": "uuid",
        "name": "Молочные продукты",
        "imageUrl": "https://..."
      }
    ]
  },
  "totalCounts": {
    "products": 24,
    "stores": 3,
    "categories": 1
  },
  "nextCursor": "xyz",
  "searchMethod": "fulltext"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `searchMethod` | string | `fulltext` или `trigram` (fallback) |
| `totalCounts` | object | Количество результатов по типам |
| `isFavorite` | boolean | Флаг избранного (§7.3) |

**Errors:**
- 400 `QUERY_TOO_SHORT` — `q` < 2 символов

---

### 3.2 GET /api/v1/search/suggest

Автокомплит. Клиент вызывает с debounce 300ms.

**Request:**
```
GET /api/v1/search/suggest?q=мол
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "suggestions": [
    { "text": "Молоко", "type": "product", "count": 24 },
    { "text": "Молочные продукты", "type": "category", "count": 1 },
    { "text": "Молочный мир", "type": "store", "count": 1 }
  ]
}
```

Max 7 suggestions. Порядок: exact prefix → fuzzy. Типы перемешаны по релевантности.

---

## Section 4. Cart API

### 4.1 GET /api/v1/cart

Корзина текущего пользователя с группировкой по магазинам. Цены берутся из `product.current_price` (не хранятся в корзине).

**Request:**
```
GET /api/v1/cart
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "storeGroups": [
    {
      "storeId": "uuid",
      "storeName": "Пятёрочка №1234",
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "productName": "Молоко 3.2%",
          "currentPrice": 8900,
          "quantity": 2,
          "quantityUnit": "pcs",
          "imageUrl": "https://...",
          "isAvailable": true
        }
      ],
      "subtotal": 17800,
      "warnings": []
    },
    {
      "storeId": "uuid",
      "storeName": "Магнит №567",
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "productName": "Яблоки Голден",
          "currentPrice": 19800,
          "quantity": 0.5,
          "quantityUnit": "kg",
          "imageUrl": "https://...",
          "isAvailable": true
        }
      ],
      "subtotal": 9900,
      "warnings": []
    }
  ],
  "totalAmount": 27700,
  "totalItems": 2,
  "updatedAt": "2026-02-15T00:30:00Z"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `storeGroups` | array | Группы по магазинам. При checkout каждая → отдельный `customer_order` |
| `subtotal` | integer | Сумма по магазину (копейки) |
| `warnings` | array | Предупреждения: unavailable items, price changes |
| `totalAmount` | integer | Общая сумма (копейки) |

**Warnings format:**
```json
{
  "code": "ITEM_UNAVAILABLE",
  "itemId": "uuid",
  "productName": "Хлеб Бородинский",
  "message": "Товар больше недоступен"
}
```

Warning codes: `ITEM_UNAVAILABLE`, `PRICE_CHANGED`.

---

### 4.2 POST /api/v1/cart/items

Добавление товара в корзину (upsert — если уже есть, увеличивает количество).

**Request:**
```
POST /api/v1/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "quantity": 1
}
```

**Response 200:**
```json
{
  "itemId": "uuid",
  "productId": "uuid",
  "quantity": 1,
  "storeId": "uuid",
  "addedAt": "2026-02-15T00:30:00Z"
}
```

**Processing Logic:**
```
1. Validate product.is_available = true
2. Resolve store_id from product.store_id
3. Upsert: IF EXISTS(cart_id, product_id) → quantity += input.quantity
           ELSE → INSERT
4. Auto-create cart IF NOT EXISTS for customer
5. Return item
```

**Errors:**
- 404 `PRODUCT_NOT_FOUND`
- 409 `PRODUCT_UNAVAILABLE` — товар недоступен

---

### 4.3 PUT /api/v1/cart/items/:id

Изменение количества товара в корзине.

**Request:**
```
PUT /api/v1/cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response 200:**
```json
{
  "itemId": "uuid",
  "quantity": 3
}
```

**Errors:**
- 404 `CART_ITEM_NOT_FOUND`
- 400 `INVALID_QUANTITY` — quantity ≤ 0

---

### 4.4 DELETE /api/v1/cart/items/:id

Удаление товара из корзины.

**Request:**
```
DELETE /api/v1/cart/items/:id
Authorization: Bearer <token>
```

**Response 204:** No Content

---

### 4.5 DELETE /api/v1/cart

Очистка корзины целиком.

**Request:**
```
DELETE /api/v1/cart
Authorization: Bearer <token>
```

**Response 204:** No Content

---

### 4.6 POST /api/v1/cart/checkout ← ALTERED v1.4.2

Мультимагазинный checkout. Группирует cart_items по `store_id`, создаёт N `customer_order`.

> **v1.4.2 (Патч #5):** `paymentMethod` enum расширен на `sbp`. **(Патч #3):** Активные заказы включают статусы `ready`, `customer_arrived`.

**Request:**
```
POST /api/v1/cart/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "tinkoff"
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `paymentMethod` | string | да | `tinkoff` \| `sbp` \| `yandex_split` \| `dolyame` *(v1.4.2: +`sbp`)* |

**Response 201 (tinkoff / BNPL):**
```json
{
  "orders": [
    {
      "orderId": "uuid",
      "storeId": "uuid",
      "storeName": "Пятёрочка №1234",
      "totalAmount": 17800,
      "originalTotalAmount": 17800,
      "paymentUrl": "https://securepay.tinkoff.ru/...",
      "qrCodeUrl": null,
      "holdExpiresAt": "2026-02-15T00:45:00Z"
    }
  ],
  "totalOrders": 1
}
```

**Response 201 (sbp) — NEW v1.4.3, Патч #5:**
```json
{
  "orders": [
    {
      "orderId": "uuid",
      "storeId": "uuid",
      "storeName": "Пятёрочка №1234",
      "totalAmount": 17800,
      "originalTotalAmount": 17800,
      "paymentUrl": null,
      "qrCodeUrl": "https://qr.nspk.ru/...",
      "holdExpiresAt": "2026-02-15T00:45:00Z"
    }
  ],
  "totalOrders": 1
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `paymentUrl` | string\|null | Redirect URL (tinkoff, BNPL). `null` если sbp |
| `qrCodeUrl` | string\|null | СБП QR deep link. `null` если не sbp **(NEW v1.4.3, Патч #5)** |
| `holdExpiresAt` | string | ISO 8601. Время истечения hold (created_at + 15 мин) |

**Processing Logic:**
```
1. Validate cart is not empty
2. Validate all items: product.is_available = true
3. Check active orders limit:
     current active (status IN 'pending','confirmed','picking','ready','customer_arrived') + new groups ≤ 3
     ← v1.4.2: ready, customer_arrived добавлены в активные (Патч #3, BR-STATUS-3)
4. Group cart_items by store_id → N groups
5. FOR EACH group:
     a. Create customer_order(status='pending', payment_provider=input)
     b. Create order_items from cart_items
     c. Calculate totalAmount, set originalTotalAmount = totalAmount
     d. IF BNPL: validate totalAmount ≥ provider.minAmount per sub-order
     e. Init payment hold (Tinkoff / SBP / BNPL authorize)
     f. Start 15-min hold timer
6. Clear cart (DELETE all cart_items)
7. Return orders
```

**Errors:**
- 400 `CART_EMPTY`
- 409 `MAX_ACTIVE_ORDERS` — active orders + new > 3
- 409 `ITEMS_UNAVAILABLE` — один или несколько товаров недоступны
- 409 `BNPL_BELOW_MIN` — сумма sub-order ниже минимума BNPL-провайдера

**409 MAX_ACTIVE_ORDERS:**
```json
{
  "code": "MAX_ACTIVE_ORDERS",
  "message": "Превышен лимит: максимум 3 активных заказа",
  "details": {
    "currentActive": 2,
    "newOrders": 2,
    "maxAllowed": 3
  }
}
```

---

## Section 5. Profile API

### 5.1 GET /api/v1/profile

Профиль текущего пользователя + статус удаления.

**Request:**
```
GET /api/v1/profile
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "phone": "+79991234567",
  "role": "customer",
  "fullName": "Иван Петров",
  "createdAt": "2026-01-15T10:00:00Z",
  "deletionRequest": null
}
```

**Response 200 (с активным запросом на удаление):**
```json
{
  "id": "uuid",
  "phone": "+79991234567",
  "role": "customer",
  "fullName": "Иван Петров",
  "createdAt": "2026-01-15T10:00:00Z",
  "deletionRequest": {
    "id": "uuid",
    "status": "pending",
    "requestedAt": "2026-02-10T12:00:00Z",
    "scheduledAt": "2026-03-12T12:00:00Z"
  }
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `deletionRequest` | object \| null | Активный запрос на удаление. `null` если нет |
| `deletionRequest.scheduledAt` | string | Дата исполнения (requested_at + 30 дней) |

---

### 5.2 PUT /api/v1/profile

Редактирование профиля. В MVP только `fullName`.

**Request:**
```
PUT /api/v1/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Иван Иванович Петров"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "fullName": "Иван Иванович Петров"
}
```

**Errors:**
- 400 `VALIDATION_ERROR` — fullName > 255 символов

---

### 5.3 POST /api/v1/profile/delete ← ALTERED v1.4.2

Запрос на удаление аккаунта. Grace period 30 дней.

> **v1.4.2 (Патч #3):** Проверка активных заказов включает статусы `ready`, `customer_arrived`.

**Request:**
```
POST /api/v1/profile/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Не пользуюсь приложением"
}
```

**Response 200:**
```json
{
  "deletionRequestId": "uuid",
  "status": "pending",
  "scheduledAt": "2026-03-17T00:32:00Z",
  "message": "Аккаунт будет удалён через 30 дней. Вы можете отменить в настройках."
}
```

**Processing Logic:**
```
1. Validate no active orders:
     status IN ('pending','confirmed','picking','ready','customer_arrived')
     ← v1.4.2: ready, customer_arrived добавлены (Патч #3, BR-STATUS-3)
2. Validate no existing pending deletion_request
3. Create deletion_request(scheduled_at = NOW() + 30 days)
4. Return confirmation
-- CRON daily 04:00 MSK executes:
--   app_user.phone → 'deleted_{uuid}'
--   app_user.full_name → NULL
--   app_user.deleted_at = NOW()
--   app_user.status = 'deleted'
--   Revoke all refresh_tokens
--   Clear cart
--   IF picker: переназначить активные заказы
```

**Errors:**
- 409 `ACTIVE_ORDERS_EXIST` — есть незавершённые заказы
- 409 `DELETION_ALREADY_REQUESTED`
- 403 `PARTNER_DELETE_BLOCKED` — партнёры удаляются только через ops-команду

**409 ACTIVE_ORDERS_EXIST:**
```json
{
  "code": "ACTIVE_ORDERS_EXIST",
  "message": "Нельзя удалить аккаунт при активных заказах",
  "details": {
    "activeOrderIds": ["uuid", "uuid"],
    "count": 2
  }
}
```

---

### 5.4 POST /api/v1/profile/delete/cancel

Отмена запроса на удаление.

**Request:**
```
POST /api/v1/profile/delete/cancel
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "status": "cancelled",
  "message": "Запрос на удаление отменён"
}
```

**Errors:**
- 404 `NO_PENDING_DELETION` — нет активного запроса

---

## Section 6. Favorites API

### 6.1 GET /api/v1/favorites

Список избранного. Cursor-based, фильтр по типу.

**Request:**
```
GET /api/v1/favorites?type=product&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `type` | string | нет | `product`, `store`. По умолчанию — все |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "entityType": "product",
      "entityId": "uuid",
      "createdAt": "2026-02-14T18:00:00Z",
      "entity": {
        "name": "Молоко 3.2%",
        "currentPrice": 8900,
        "imageUrl": "https://...",
        "storeName": "Пятёрочка №1234",
        "isAvailable": true
      }
    }
  ],
  "nextCursor": "xyz"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `entity` | object | Hydrated entity — product или store details |

---

### 6.2 POST /api/v1/favorites

Добавление в избранное. Idempotent upsert.

**Request:**
```
POST /api/v1/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "entityType": "product",
  "entityId": "uuid"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "entityType": "product",
  "entityId": "uuid",
  "createdAt": "2026-02-15T00:30:00Z"
}
```

Idempotent: повторный вызов возвращает существующую запись (200, не 409).

**Errors:**
- 404 `ENTITY_NOT_FOUND` — product/store не существует
- 400 `INVALID_ENTITY_TYPE`

---

### 6.3 DELETE /api/v1/favorites/:id

Удаление из избранного.

**Request:**
```
DELETE /api/v1/favorites/:id
Authorization: Bearer <token>
```

**Response 204:** No Content

---

### 6.4 DELETE /api/v1/favorites

Batch удаление.

**Request:**
```
DELETE /api/v1/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["uuid", "uuid", "uuid"]
}
```

**Response 200:**
```json
{
  "deletedCount": 3
}
```

---

## Section 7. Addresses API

### 7.1 GET /api/v1/addresses

Список адресов пользователя. Без пагинации (max 5).

**Request:**
```
GET /api/v1/addresses
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "addresses": [
    {
      "id": "uuid",
      "label": "Дом",
      "address": "ул. Ленина, 42, кв. 15",
      "lat": 55.7558,
      "lon": 37.6173,
      "isDefault": true,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

### 7.2 POST /api/v1/addresses

Создание адреса.

**Request:**
```
POST /api/v1/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Работа",
  "address": "ул. Пушкина, 10, офис 501",
  "lat": 55.7600,
  "lon": 37.6200,
  "isDefault": false
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "label": "Работа",
  "address": "ул. Пушкина, 10, офис 501",
  "lat": 55.7600,
  "lon": 37.6200,
  "isDefault": false,
  "createdAt": "2026-02-15T00:30:00Z"
}
```

**Processing Logic:**
```
1. Count existing addresses for user
2. IF count >= 5 → 409 MAX_ADDRESSES_REACHED
3. IF isDefault = true → set all other isDefault = false
4. IF count = 0 → force isDefault = true (first address)
5. Geocoding выполняется на клиенте (Yandex Geocoding API)
6. Insert address
```

**Errors:**
- 409 `MAX_ADDRESSES_REACHED` — лимит 5 адресов
- 400 `VALIDATION_ERROR`

---

### 7.3 PUT /api/v1/addresses/:id

Обновление адреса.

**Request:**
```
PUT /api/v1/addresses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Офис",
  "isDefault": true
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "label": "Офис",
  "address": "ул. Пушкина, 10, офис 501",
  "lat": 55.7600,
  "lon": 37.6200,
  "isDefault": true
}
```

**Errors:**
- 404 `ADDRESS_NOT_FOUND`

---

### 7.4 DELETE /api/v1/addresses/:id

Удаление адреса. При удалении default — auto-promote самый старый оставшийся.

**Request:**
```
DELETE /api/v1/addresses/:id
Authorization: Bearer <token>
```

**Response 204:** No Content

**Side effects:**
- IF deleted address was `isDefault = true` AND remaining > 0:
  - Promote oldest remaining → `isDefault = true`

**Errors:**
- 404 `ADDRESS_NOT_FOUND`

---

## Section 8. Smart Alerts API

### 8.1 GET /api/v1/smart-alerts

Список Smart Alerts пользователя. Cursor-based.

**Request:**
```
GET /api/v1/smart-alerts?isActive=true&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `isActive` | boolean | нет | Фильтр по активности |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "alerts": [
    {
      "id": "uuid",
      "triggerType": "price_drop",
      "entityType": "product",
      "entityId": "uuid",
      "entityName": "Молоко 3.2%",
      "schedule": "morning",
      "referencePrice": 8900,
      "threshold": null,
      "isActive": true,
      "lastFiredAt": "2026-02-14T09:30:00Z",
      "createdAt": "2026-02-10T12:00:00Z"
    }
  ],
  "nextCursor": "xyz"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `triggerType` | string | `price_drop`, `back_in_stock`, `price_threshold` |
| `schedule` | string | `morning` (08–12), `evening` (17–21), `all_day` (08–21) MSK |
| `referencePrice` | integer \| null | Цена при создании alert (для `price_drop`, копейки) |
| `threshold` | integer \| null | Целевая цена (для `price_threshold`, копейки) |

---

### 8.2 POST /api/v1/smart-alerts

Создание Smart Alert. Push-only, без автосписаний.

**Request:**
```
POST /api/v1/smart-alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "triggerType": "price_drop",
  "entityType": "product",
  "entityId": "uuid",
  "schedule": "morning"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "triggerType": "price_drop",
  "entityType": "product",
  "entityId": "uuid",
  "schedule": "morning",
  "referencePrice": 8900,
  "isActive": true,
  "createdAt": "2026-02-15T00:30:00Z"
}
```

**Processing Logic:**
```
1. Count active alerts for user
2. IF count >= 20 → 409 MAX_ALERTS_REACHED
3. IF triggerType = 'price_drop':
     referencePrice = product.current_price (snapshot)
4. IF triggerType = 'price_threshold':
     REQUIRE threshold in request body
5. Insert smart_alert
```

**Errors:**
- 409 `MAX_ALERTS_REACHED` — лимит 20 активных alert'ов
- 404 `ENTITY_NOT_FOUND`
- 400 `THRESHOLD_REQUIRED` — threshold обязателен для `price_threshold`
- 400 `VALIDATION_ERROR`

---

### 8.3 PUT /api/v1/smart-alerts/:id

Обновление / пауза Smart Alert.

**Request:**
```
PUT /api/v1/smart-alerts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "schedule": "all_day",
  "isActive": false
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "schedule": "all_day",
  "isActive": false
}
```

**Errors:**
- 404 `ALERT_NOT_FOUND`

---

### 8.4 DELETE /api/v1/smart-alerts/:id

Удаление Smart Alert.

**Request:**
```
DELETE /api/v1/smart-alerts/:id
Authorization: Bearer <token>
```

**Response 204:** No Content

---

### 8.5 GET /api/v1/smart-alerts/:id/history

История срабатываний alert'а. Cursor-based.

**Request:**
```
GET /api/v1/smart-alerts/:id/history?cursor=abc
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "firedAt": "2026-02-14T09:30:00Z",
      "payload": {
        "oldPrice": 8900,
        "newPrice": 7500,
        "productId": "uuid",
        "storeId": "uuid"
      }
    }
  ],
  "nextCursor": "xyz"
}
```

---
## Section 9. Chat API

### 9.1 GET /api/v1/orders/:id/chat ← ALTERED v1.4.2

Список сообщений чата заказа. Cursor-based, ASC.

> **v1.4.2 (Патч #3):** Lifecycle расширен — chat доступен на запись в статусах `ready` и `customer_arrived`.

**Request:**
```
GET /api/v1/orders/:id/chat?cursor=abc
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "senderRole": "picker",
      "body": "Яблоки Голден закончились. Заменить на Гала?",
      "createdAt": "2026-02-14T18:12:00Z",
      "readAt": "2026-02-14T18:12:30Z"
    },
    {
      "id": "uuid",
      "senderId": "uuid",
      "senderRole": "customer",
      "body": "Да, заменяйте",
      "createdAt": "2026-02-14T18:13:00Z",
      "readAt": null
    }
  ],
  "nextCursor": "xyz"
}
```

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`

**Lifecycle (v1.4.2):**
- Chat write: `order.status IN ('confirmed', 'picking', 'ready', 'customer_arrived')` *(v1.4.2: +`ready`, `customer_arrived` — Патч #3, BR-STATUS-1)*
- Chat read-only: `order.status IN ('completed', 'cancelled')`

---

### 9.2 POST /api/v1/orders/:id/chat ← ALTERED v1.4.2

Отправка сообщения в чат. Customer или picker.

> **v1.4.2 (Патч #3):** Запись разрешена в статусах `ready` и `customer_arrived`.

**Request:**
```
POST /api/v1/orders/:id/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "body": "Замена подходит, спасибо!"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "senderId": "uuid",
  "senderRole": "customer",
  "body": "Замена подходит, спасибо!",
  "createdAt": "2026-02-14T18:14:00Z"
}
```

**Processing Logic:**
```
1. Validate order exists AND user is participant (customer or assigned picker)
2. Validate order.status IN ('confirmed', 'picking', 'ready', 'customer_arrived')
   ← v1.4.2: ready, customer_arrived добавлены (Патч #3, BR-STATUS-1)
3. Insert chat_message
4. WS → counterparty: chat.message event
5. Return message
```

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`
- 409 `CHAT_CLOSED` — заказ завершён/отменён

---

### 9.3 POST /api/v1/orders/:id/chat/read

Пометка сообщений как прочитанных. Все непрочитанные сообщения от counterparty.

**Request:**
```
POST /api/v1/orders/:id/chat/read
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "readCount": 3
}
```

**Side effects:**
- WS → counterparty: `chat.read` event

---

## Section 10. Orders API (updated from v1.3.3)

### 10.1 GET /api/v1/orders/:id ← ALTERED v1.4.2

Детали заказа. Обновлённая schema. SQL-ссылки `customer_order`, `app_user`.

> **v1.4.2 (Патч #3):** Добавлены `readyAt`, `customerArrivedAt`. Status enum расширен. **(Патч #5):** `paymentProvider` enum включает `sbp`.

**Request:**
```
GET /api/v1/orders/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "status": "ready",
  "totalAmount": 55964,
  "originalTotalAmount": 54580,
  "customerId": "uuid",
  "storeId": "uuid",
  "storeName": "Пятёрочка №1234",
  "pickerId": "uuid",
  "pickerName": "А. Сидоров",
  "paymentProvider": "tinkoff",
  "paymentStatus": "paid",
  "createdAt": "2026-02-14T18:00:00Z",
  "pickedAt": "2026-02-14T18:15:00Z",
  "readyAt": "2026-02-14T18:30:00Z",
  "customerArrivedAt": null,
  "completedAt": null,
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Яблоки Голден",
      "currentPrice": 19800,
      "finalPrice": 19800,
      "requestedQuantity": 0.5,
      "actualQuantity": 0.48,
      "quantityUnit": "kg",
      "status": "active",
      "imageUrl": "https://..."
    }
  ]
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `status` | string | `pending`, `confirmed`, `picking`, `ready`, `customer_arrived`, `completed`, `cancelled` *(v1.4.2: +`ready`, `customer_arrived`)* |
| `paymentProvider` | string | `tinkoff` \| `sbp` \| `yandex_split` \| `dolyame` *(v1.4.2: +`sbp`)* |
| `readyAt` | string \| null | ISO 8601. Время готовности заказа *(NEW v1.4.2)* |
| `customerArrivedAt` | string \| null | ISO 8601. Время прибытия покупателя *(NEW v1.4.2)* |
| `completedAt` | string \| null | ISO 8601. Время завершения (выдачи) |

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`

---

### 10.2 POST /api/v1/orders

Создание заказа напрямую (из Section 4.6 `POST /cart/checkout`). Не вызывается клиентом — внутренний redirect.

---

### 10.3 POST /api/v1/orders/:id/cancel

Отмена заказа покупателем. Только `status = 'pending'`.

**Request:**
```
POST /api/v1/orders/:id/cancel
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "orderId": "uuid",
  "status": "cancelled",
  "refundStatus": "initiated"
}
```

**Processing Logic:**
```
1. Validate customer_order.status = 'pending'
2. Cancel payment hold (Tinkoff / BNPL)
3. customer_order.status = 'cancelled'
4. customer_order.payment_status = 'refunded'
5. WS → customer: order.statuschanged
6. Return
```

**Errors:**
- 409 `ORDER_NOT_CANCELLABLE` — статус не `pending`
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`

---

### 10.4 GET /api/v1/picker/orders ← ALTERED v1.4.2

Список заказов для пикера. Cursor-based.

> **v1.4.2 (Патч #3):** Status enum расширен на `ready`, `customer_arrived` для фильтрации.

**Request:**
```
GET /api/v1/picker/orders?status=confirmed&cursor=xyz
Authorization: Bearer <picker-token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `status` | string | нет | Фильтр: `confirmed`, `picking`, `ready`, `customer_arrived`, `completed`, `cancelled` *(v1.4.2: +`ready`, `customer_arrived`)* |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "storeId": "uuid",
      "storeName": "Пятёрочка №1234",
      "totalAmount": 54580,
      "itemsCount": 5,
      "status": "confirmed",
      "createdAt": "2026-02-14T18:00:00Z"
    }
  ],
  "nextCursor": "abc123"
}
```

---

### 10.5 PUT /api/v1/picker/orders/:id/accept

Принятие заказа пикером. `confirmed → picking`.

**Request:**
```
PUT /api/v1/picker/orders/:id/accept
Authorization: Bearer <picker-token>
```

**Response 200:**
```json
{
  "orderId": "uuid",
  "status": "picking",
  "acceptedAt": "2026-02-14T18:10:00Z"
}
```

**Side effects:**
- `customer_order.status` → `picking`
- `customer_order.picker_id` = current picker
- WS → customer: `order.statuschanged`

---

### 10.6 PUT /api/v1/picker/orders/:id/item/:itemId/weigh

Взвешивание весового товара. Пересчёт цены и суммы заказа.

**Request:**
```
PUT /api/v1/picker/orders/:id/item/:itemId/weigh
Authorization: Bearer <picker-token>
Content-Type: application/json

{
  "actualQuantity": 0.480
}
```

**Response 200:**
```json
{
  "itemId": "uuid",
  "actualQuantity": 0.480,
  "newPrice": 9504,
  "orderTotal": 46580,
  "warning": {
    "code": "BNPL_BELOW_MIN",
    "currentTotal": 46580,
    "minAmount": 50000,
    "provider": "dolyame"
  }
}
```

**Processing Logic:**
```
1. Validate customer_order.status = 'picking'
2. Validate customer_order.picker_id = current picker
3. Validate item.quantity_unit = 'kg'
4. Calculate finalPrice = currentPrice × actualQuantity
5. Update item.actual_quantity, item.final_price
6. Recalc customer_order.total_amount (weighted-aware)
7. Persist changes
8. Send WS → customer: order.totals_updated
9. BNPL warning check:
     IF customer_order.payment_provider IN ('yandex_split', 'dolyame'):
       provider = get_provider(customer_order.payment_provider)
       IF customer_order.total_amount < provider.minAmount:
         response.warning = { code, currentTotal, minAmount, provider }
       ELSE: response.warning = null
     ELSE: response.warning = null
10. Return response
```

**Errors:**
- 404 `ORDER_NOT_FOUND` / `ITEM_NOT_FOUND`
- 403 `FORBIDDEN`
- 409 `ORDER_NOT_IN_PICKING`
- 400 `INVALID_QUANTITY` — actualQuantity ≤ 0 или > requestedQuantity × 1.5

---

### 10.7 PUT /api/v1/picker/orders/:id/complete ← ALTERED v1.4.2

Завершение сборки пикером.

> **v1.4.2 (Патч #3):** Статус переходит в `ready` (было `completed`). `ready_at = NOW()`. Capture payment происходит здесь. Для финальной выдачи — используйте `POST /picker/orders/:id/confirm-pickup` (sec 10.11).

**Request:**
```
PUT /api/v1/picker/orders/:id/complete
Authorization: Bearer <picker-token>
```

**Response 200 (success):**
```json
{
  "status": "ready",
  "orderId": "uuid",
  "totalAmount": 54320
}
```

**Response 200 (BNPL cancel):**
```json
{
  "status": "cancelled",
  "reason": "BNPL_BELOW_MIN",
  "finalAmount": 46580,
  "minAmount": 50000,
  "provider": "dolyame",
  "items": [
    { "name": "Яблоки Голден", "quantity": 0.48, "unit": "kg" },
    { "name": "Молоко 3.2%", "quantity": 2, "unit": "pcs" }
  ]
}
```

**Processing Logic:**
```
1. Validate customer_order.status = 'picking'
2. Validate customer_order.picker_id = current picker
3a. Server-side weigh guard (BR-PICK-4):
      unweighed items WHERE quantity_unit='kg'
        AND status IN ('active','replaced') AND actual_quantity IS NULL
      IF count > 0 → 422 UNWEIGHED_ITEMS_EXIST
3b. BNPL minAmount check (BR-BNPL-6):
      IF customer_order.payment_provider IN ('yandex_split', 'dolyame'):
        finalAmount = calc_order_gmv(order)
        provider = get_provider(customer_order.payment_provider)
        IF finalAmount < provider.minAmount:
          provider.cancel_payment(customer_order.bnpl_external_id)
          customer_order.status = 'cancelled'
          customer_order.payment_status = 'refunded'
          persist(customer_order)
          billableItems = items WHERE status IN ('active', 'replaced')
          WS → picker: order.cancelled { orderId, reason, finalAmount, minAmount, provider, items }
          WS → customer: order.cancelled { orderId, reason, finalAmount, minAmount, provider }
          Push → customer
          RETURN 200 { status='cancelled', reason, finalAmount, minAmount, provider, items }
4. Proceed with capture:
     - Tinkoff: POST /v2/Confirm
     - BNPL: provider.capture_payment
5. customer_order.status = 'ready'                     ← CHANGED v1.4.2 (было 'completed')
6. customer_order.ready_at = NOW()                      ← NEW v1.4.2
7. WS → customer: order.statuschanged { newStatus: 'ready' }
8. Push → customer: «Ваш заказ собран и ожидает вас»    ← NEW v1.4.2
```

**Errors:**
- 409 `ORDER_NOT_IN_PICKING`
- 403 `FORBIDDEN`
- 422 `UNWEIGHED_ITEMS_EXIST`

**422 UNWEIGHED_ITEMS_EXIST:**
```json
{
  "code": "UNWEIGHED_ITEMS_EXIST",
  "message": "Есть невзвешенные весовые товары",
  "details": {
    "unweighedItemIds": ["uuid", "uuid"],
    "unweighedCount": 2
  }
}
```

---

### 10.8 GET /api/v1/orders ← ALTERED v1.4.2

Список заказов покупателя. Cursor-based pagination.

> **v1.4.2 (Патч #3):** `active` filter включает `ready`, `customer_arrived`. **(Патч #5):** `paymentProvider` включает `sbp`.

**Request:**
```
GET /api/v1/orders?status=active&cursor=abc
Authorization: Bearer <token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `status` | string | нет | `active` (`pending`,`confirmed`,`picking`,`ready`,`customer_arrived`), `completed`, `cancelled`, `all` (default `all`) *(v1.4.2: active расширен)* |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "storeId": "uuid",
      "storeName": "Пятёрочка №1234",
      "status": "ready",
      "paymentStatus": "paid",
      "paymentProvider": "tinkoff",
      "totalAmount": 55964,
      "originalTotalAmount": 54580,
      "itemsCount": 3,
      "createdAt": "2026-02-14T18:00:00Z",
      "completedAt": null
    }
  ],
  "nextCursor": "abc123"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `status` | string | `pending` \| `confirmed` \| `picking` \| `ready` \| `customer_arrived` \| `completed` \| `cancelled` *(v1.4.2: +`ready`, `customer_arrived`)* |
| `paymentProvider` | string | `tinkoff` \| `sbp` \| `yandex_split` \| `dolyame` *(v1.4.2: +`sbp`)* |
| `itemsCount` | integer | Количество позиций в заказе |
| `completedAt` | string \| null | ISO 8601, null если не завершён |

**Processing Logic:**
```
1. SELECT FROM customer_order WHERE customer_id = current_user
2. IF status = 'active':
     WHERE status IN ('pending','confirmed','picking','ready','customer_arrived')
     ← v1.4.2: ready, customer_arrived добавлены (Патч #3, BR-STATUS-3)
3. ORDER BY created_at DESC
4. Cursor-based pagination
```

**Errors:**
- 401 `UNAUTHORIZED`

---

### 10.9 POST /api/v1/orders/:id/rate

Оценка заказа покупателем. 1–5. Idempotent upsert.

**Request:**
```
POST /api/v1/orders/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Быстрая сборка"
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `rating` | integer | да | 1–5 |
| `comment` | string | нет | Комментарий, max 500 |

**Response 200:**
```json
{
  "orderId": "uuid",
  "rating": 4,
  "comment": "Быстрая сборка",
  "createdAt": "2026-02-14T19:00:00Z"
}
```

**Processing Logic:**
```
1. Validate customer_order.status = 'completed'
2. Validate customer_order.customer_id = current_user
3. Validate rating IN (1,2,3,4,5)
4. Idempotent upsert:
     IF EXISTS order_rating WHERE order_id = :id
       UPDATE rating, comment, updated_at = NOW()
     ELSE
       INSERT order_rating(order_id, customer_id, rating, comment)
5. Return result
```

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`
- 409 `ORDER_NOT_COMPLETED` — status ≠ `completed`
- 400 `INVALID_RATING` — rating not in 1..5

**409 ORDER_NOT_COMPLETED:**
```json
{
  "code": "ORDER_NOT_COMPLETED",
  "message": "Оценить можно только завершённый заказ",
  "details": {
    "currentStatus": "picking"
  }
}
```

---

### 10.10 POST /api/v1/orders/:id/arrived ← NEW v1.4.2

> Новый эндпоинт (Патч #3). Покупатель подтверждает прибытие в магазин.

**Request:**
```
POST /api/v1/orders/:id/arrived
Authorization: Bearer <customer-token>
```

**Precondition:** `customer_order.status = 'ready'`
**Postcondition:** `customer_order.status = 'customer_arrived'`, `customer_arrived_at = NOW()`

**Response 200:**
```json
{
  "orderId": "uuid",
  "status": "customer_arrived"
}
```

**Processing Logic:**
```
1. Validate customer_order.customer_id = current_user
2. Validate customer_order.status = 'ready'
3. customer_order.status = 'customer_arrived'
4. customer_order.customer_arrived_at = NOW()
5. WS → picker: order.statuschanged { newStatus: 'customer_arrived' }
6. Push → picker: «Покупатель на месте»
7. Return
```

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`
- 409 `ORDER_NOT_READY` — status ≠ `ready`

**409 ORDER_NOT_READY:**
```json
{
  "code": "ORDER_NOT_READY",
  "message": "Заказ не в статусе 'Готов к выдаче'",
  "details": {
    "currentStatus": "picking"
  }
}
```

---

### 10.11 POST /api/v1/picker/orders/:id/confirm-pickup ← NEW v1.4.2

> Новый эндпоинт (Патч #3). Пикер подтверждает выдачу заказа покупателю. Picker может подтвердить выдачу даже если customer не нажал «Я на месте» (`ready` → `completed` напрямую).

**Request:**
```
POST /api/v1/picker/orders/:id/confirm-pickup
Authorization: Bearer <picker-token>
```

**Precondition:** `customer_order.status IN ('ready', 'customer_arrived')`
**Postcondition:** `customer_order.status = 'completed'`, `completed_at = NOW()`

**Response 200:**
```json
{
  "orderId": "uuid",
  "status": "completed"
}
```

**Processing Logic:**
```
1. Validate customer_order.picker_id = current_picker
2. Validate customer_order.status IN ('ready', 'customer_arrived')
3. customer_order.status = 'completed'
4. customer_order.completed_at = NOW()
5. WS → customer: order.statuschanged { newStatus: 'completed' }
6. Push → customer: «Заказ выдан. Спасибо!»
7. Return
```

**Errors:**
- 404 `ORDER_NOT_FOUND`
- 403 `FORBIDDEN`
- 409 `ORDER_NOT_READY` — status not in (`ready`, `customer_arrived`)

---

## Section 11. Settlement API

### 11.1 POST /api/v1/partner/settlements/:periodId/dispute ← REWRITTEN v1.4.4

Оспаривание строк settlement-периода партнёром. Line-level granularity. Re-dispute разрешён.

> **v1.4.4 (Patch Bundle v1.0, Fix #1):** Полная перезапись контракта. Source of truth — Settlement v1.2.1 sec 8.1. `orderIds` → `lineIds`, response aligned, re-dispute разрешён, error `PERIOD_ALREADY_DISPUTED` удалён.

**Request:**
```
POST /api/v1/partner/settlements/:periodId/dispute
Authorization: Bearer <partner-token>
Content-Type: application/json

{
  "lineIds": ["uuid-line-1", "uuid-line-2"],
  "reason": "Некорректный GMV по позициям — просим пересчитать"
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `lineIds` | uuid[] | да | IDs из `settlement_line` для текущего периода |
| `reason` | string | да | Причина оспаривания (max 1000 символов) |

**Response 200:**
```json
{
  "periodId": "uuid",
  "status": "disputed",
  "disputedLinesCount": 2,
  "totalDisputedLines": 5
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `periodId` | uuid | ID settlement period |
| `status` | string | `"disputed"` — всегда после успешного запроса |
| `disputedLinesCount` | integer | Кол-во строк, изменённых ЭТИМ запросом |
| `totalDisputedLines` | integer | Общее кол-во disputed строк в периоде (включая ранее оспоренные) |

**Processing Logic:**
```
1. Validate period.partner_id = current partner
2. Validate period.status IN ('review', 'disputed')
   — IF NOT → 409 PERIOD_NOT_DISPUTABLE { currentStatus }
3. Validate period.review_deadline >= today
   — IF NOT → 409 PERIOD_NOT_DISPUTABLE { reason: "DEADLINE_PASSED" }
4. Validate all lineIds belong to this periodId
   — IF NOT → 400 INVALID_LINE_IDS { invalidIds: [...] }
5. UPDATE settlement_line SET status = 'disputed'
   WHERE id IN (lineIds) AND period_id = periodId
6. settlement_period.status = 'disputed'
7. settlement_period.updated_at = NOW()
8. Notify Robin Food ops: send_alert(...)
9. Return response
```

**Errors:**
- 400 `VALIDATION_ERROR` — пустой lineIds, reason > 1000 символов
- 400 `INVALID_LINE_IDS` — lineIds не принадлежат данному periodId *(NEW v1.4.4)*
- 403 `FORBIDDEN` — period не принадлежит партнёру
- 404 `PERIOD_NOT_FOUND` — periodId не существует
- 409 `PERIOD_NOT_DISPUTABLE` — status не в (`review`, `disputed`) ИЛИ deadline прошёл *(RENAMED v1.4.4, было PERIOD_ALREADY_DISPUTED)*

**400 INVALID_LINE_IDS:** *(NEW v1.4.4)*
```json
{
  "code": "INVALID_LINE_IDS",
  "message": "Указанные строки не принадлежат данному периоду",
  "details": {
    "invalidIds": ["uuid-line-99"],
    "periodId": "uuid"
  }
}
```

**409 PERIOD_NOT_DISPUTABLE:**
```json
{
  "code": "PERIOD_NOT_DISPUTABLE",
  "message": "Период не может быть оспорен",
  "details": {
    "reason": "STATUS_NOT_REVIEW",
    "currentStatus": "approved"
  }
}
```

> **УДАЛЕНО в v1.4.4:** `disputeId`, `status:"open"`, `orderIds`, `409 PERIOD_ALREADY_DISPUTED`. Отдельная сущность `dispute` не существует в Data Model — используется прямое обновление `settlement_line.status`.

---

## Section 12. WebSocket Events

### 12.1 Connection ← EXPANDED v1.4.3 (Патч #2)

> **v1.4.3 (Patch Snapshot v1.2, Патч #2):** Полный контракт WebSocket-соединения — auth, heartbeat, reconnect, close codes, rate limit, offline queue, message envelope.

**URL:**
```
wss://api.robinfood.ru/ws?token=<accessToken>
```

#### Authentication
- `accessToken` в query param `token` (WebSocket API не поддерживает custom headers)
- Сервер валидирует JWT RS256: exp, userId, role
- Invalid/expired → close frame **4001** UNAUTHORIZED
- Forbidden role → close frame **4003** FORBIDDEN

#### Connection Lifecycle
```
1. Client → handshake + token
2. Server validates JWT
3. Server subscribes userId к каналам active orders
4. Server → welcome frame: { "event": "connected", "subscribedOrders": [...] }
5. Ping/pong loop starts
```

#### Heartbeat
- Server ping every **30s**, client pong within **10s**
- 2 consecutive missed → server closes (1001)

#### Reconnect Policy (client-side)
- Backoff: 1s → 2s → 4s → 8s → 16s → **30s cap**
- Jitter: ±500ms
- Fresh token on each reconnect (refresh if expired)
- Foreground: unlimited attempts; background: 0

#### Token Refresh Mid-Session
- Server validates token ONLY at handshake
- WS session can outlive token TTL (1h)
- Server restart → client reconnects with fresh token

#### Custom Close Codes

| Code | Meaning | Client Action |
|------|---------|--------------|
| 1000 | Normal close | Reconnect if needed |
| 1001 | Going away | Reconnect with backoff |
| 4001 | Unauthorized | Refresh token, reconnect |
| 4003 | Forbidden | Do NOT reconnect |
| 4008 | Rate limited | Backoff 30s, reconnect |
| 4029 | Too many connections | Close other tabs |

#### Rate Limiting
- Max **3** concurrent WS per userId (FIFO — oldest dropped 4029)
- Max **10** client→server messages/min (exceeded → 4008)

#### Offline Queue (server-side)
- Disconnected → events queued in Redis (TTL 5 min, max 50)
- Reconnect → server replays queue
- Overflow → `{ "event": "sync_required" }` → client calls REST

#### Message Envelope

Все server→client сообщения используют единый формат:

```json
{
  "event": "order.statuschanged",
  "timestamp": "ISO 8601",
  "idempotencyKey": "uuid",
  "payload": { ... }
}
```

Client MUST deduplicate by `idempotencyKey`.

### 12.2 Events ← ALTERED v1.4.2

> **v1.4.2 (Патч #3):** `order.statuschanged` — `newStatus` включает `ready`, `customer_arrived`. Push triggers добавлены.

#### order.statuschanged

Изменение `customer_order.status`. Отправляется customer, picker (если назначен).

```json
{
  "event": "order.statuschanged",
  "payload": {
    "orderId": "uuid",
    "previousStatus": "picking",
    "newStatus": "ready",
    "reason": null
  }
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `newStatus` | string | `pending` \| `confirmed` \| `picking` \| `ready` \| `customer_arrived` \| `completed` \| `cancelled` *(v1.4.2: +`ready`, `customer_arrived`)* |
| `reason` | string \| null | null или причина: `BNPL_BELOW_MIN`, `HOLD_EXPIRED`, `USER_CANCELLED` и др. |

**State machine (v1.4.2):**

```
pending → confirmed → picking → ready → customer_arrived → completed
  ↓          ↓          ↓
cancelled  cancelled  cancelled
```

> `ready`, `customer_arrived` нельзя cancel (capture уже произведён при `picking → ready`).

**Push triggers (v1.4.2, Патч #3):**

| Переход | Получатель | Push body |
|---------|------------|-----------|
| `picking → ready` | Customer | «Ваш заказ собран и ожидает вас» |
| `ready → customer_arrived` | Picker | «Покупатель на месте» |
| `ready/customer_arrived → completed` | Customer | «Заказ выдан. Спасибо!» |

#### order.cancelled

Расширенное событие для BNPL-cancel. Содержит items.

```json
{
  "event": "order.cancelled",
  "payload": {
    "orderId": "uuid",
    "reason": "BNPL_BELOW_MIN",
    "finalAmount": 46580,
    "minAmount": 50000,
    "provider": "dolyame"
  }
}
```

#### order.totalsupdated

Пересчёт суммы заказа (после взвешивания).

```json
{
  "event": "order.totalsupdated",
  "payload": {
    "orderId": "uuid",
    "totalAmount": 46580,
    "previousTotal": 54580
  }
}
```

#### chat.message

Новое сообщение в чате заказа.

```json
{
  "event": "chat.message",
  "payload": {
    "orderId": "uuid",
    "messageId": "uuid",
    "senderId": "uuid",
    "senderRole": "picker",
    "body": "Яблоки заменены на Гала",
    "createdAt": "2026-02-14T18:12:00Z"
  }
}
```

#### chat.read

Сообщения прочитаны counterparty.

```json
{
  "event": "chat.read",
  "payload": {
    "orderId": "uuid",
    "readBy": "uuid",
    "readCount": 3,
    "readAt": "2026-02-14T18:12:30Z"
  }
}
```

### 12.3 WS Events Summary

| Event | Trigger → Receiver |
|-------|-------------------|
| `order.statuschanged` | status change → `ws://.../orders/{orderId}` |
| `order.cancelled` | BNPL cancel (with items) → `ws://.../orders/{orderId}` |
| `order.totalsupdated` | weigh recalc → `ws://.../orders/{orderId}` |
| `chat.message` | new message → `ws://.../orders/{orderId}` |
| `chat.read` | read receipt → `ws://.../orders/{orderId}` |

---
---

## Section 13. Webhooks ← NEW v1.4.3 (Патч #1)

### 13.1 POST /api/v1/webhooks/tinkoff ← NEW v1.4.3

> Новый эндпоинт (Patch Snapshot v1.2, Патч #1). Входящий webhook от Tinkoff Acquiring (карта + СБП). Через этот endpoint backend узнаёт о факте оплаты.

**Request (from Tinkoff):**
```
POST /api/v1/webhooks/tinkoff
Content-Type: application/json

{
  "TerminalKey": "your_terminal_key",
  "OrderId": "uuid",
  "Success": true,
  "Status": "AUTHORIZED",
  "PaymentId": "12345678",
  "Amount": 5458000,
  "CardId": "...",
  "Pan": "430000******0777",
  "Token": "signature"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `Status` | string | `AUTHORIZED` (hold OK), `CONFIRMED` (capture OK), `REJECTED` (payment failed) |
| `PaymentId` | string | Tinkoff payment ID (= `payment_transaction.provider_ref`) |
| `Token` | string | HMAC SHA-256 подпись (verification) |

**Security:**
- Auth: НЕ требует JWT (вызывающая сторона — Tinkoff)
- IP whitelist: `91.194.226.0/23`
- Verification: `Token = SHA-256(concat(sorted values + Password))`
- Всегда возвращает **200 OK** (Tinkoff retry policy: до 10 попыток)

**Response 200:** Всегда `200 OK` (включая ошибки валидации — чтобы Tinkoff не retry'ил)

**Processing Logic:**
```
1. Verify IP ∈ Tinkoff whitelist (91.194.226.0/23)
   IF NOT → 200 OK (ignore, ACK to prevent retries)

2. Verify Token = SHA-256(concat(sorted_non_token_values + Password))
   IF NOT → 200 OK (ignore invalid signature)

3. Find payment_transaction WHERE provider = 'tinkoff' AND provider_ref = PaymentId
   IF NOT FOUND → 200 OK (unknown PaymentId → no-op)

4. Idempotency: IF (PaymentId, Status) already processed → 200 OK (no-op)
   -- unique index idx_pay_tx_provider_ref(provider, provider_ref) защищает от дублей

5. IF Status = 'AUTHORIZED' | 'CONFIRMED':
     payment_transaction.status = 'success'
     customer_order.status = 'confirmed' (if was 'pending')
     customer_order.payment_status = 'paid'
     WS → customer: order.statuschanged { newStatus: 'confirmed' }
     Push → picker: picker.neworder

6. IF Status = 'REJECTED':
     payment_transaction.status = 'failed'
     customer_order.status = 'cancelled'
     customer_order.payment_status = 'refunded'
     WS → customer: order.statuschanged { newStatus: 'cancelled', reason: 'PAYMENT_REJECTED' }

7. Return 200 OK
```

**Tinkoff retry policy:** 10s, 30s, 60s, 5min, 10min, 30min, 1h, 3h, 6h, 24h

**Rate limit (incoming):** 100 req/min per IP (Tinkoff infrastructure)

> **СБП-специфика:** После подтверждения оплаты в банковском приложении → Tinkoff отправляет `Status = 'AUTHORIZED'`. Далее, после capture → `Status = 'CONFIRMED'`. Callback URL'ы — см. Integration Contracts v1.6.3, sec 1.1.

---

## Section 14. Admin API ← NEW v1.4.3 (Патч #3)

> Новая секция (Patch Snapshot v1.2, Патч #3). Auth: Bearer token, role=admin, JWT RS256.

### 14.1 POST /api/v1/admin/users/invite ← NEW v1.4.3

Приглашение пикера или партнёра. Создаёт `app_user(status='invited')`.

**Request:**
```
POST /api/v1/admin/users/invite
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "phone": "+79991234567",
  "role": "picker",
  "fullName": "Иван Сидоров",
  "partnerId": null
}
```

| Поле | Тип | Required | Описание |
|------|-----|----------|----------|
| `phone` | string | да | Телефон в формате +7... |
| `role` | string | да | `picker` \| `partner` |
| `fullName` | string | нет | ФИО |
| `partnerId` | uuid\|null | условно | Обязателен для `role='partner'` |

**Response 201:**
```json
{
  "id": "uuid",
  "phone": "+79991234567",
  "role": "picker",
  "status": "invited",
  "fullName": "Иван Сидоров",
  "createdAt": "2026-02-15T00:30:00Z"
}
```

**Processing Logic:**
```
1. Validate role ∈ ('picker', 'partner') — admin приглашает только admin seed
2. Validate phone unique (WHERE deleted_at IS NULL)
3. IF role = 'partner' AND partnerId IS NULL → 400 PARTNER_REQUIRED
4. INSERT app_user(phone, role, status='invited', full_name)
5. Return user record
```

**Errors:**
- 400 `VALIDATION_ERROR`
- 400 `PARTNER_REQUIRED` — partnerId обязателен для role=partner
- 409 `PHONE_ALREADY_EXISTS` — телефон уже зарегистрирован
- 403 `FORBIDDEN` — caller не admin

**409 PHONE_ALREADY_EXISTS:**
```json
{
  "code": "PHONE_ALREADY_EXISTS",
  "message": "Пользователь с таким телефоном уже существует",
  "details": {
    "phone": "+79991234567",
    "existingRole": "customer"
  }
}
```

---

### 14.2 GET /api/v1/admin/users ← NEW v1.4.3

Список пользователей с фильтрацией. Cursor-based pagination.

**Request:**
```
GET /api/v1/admin/users?role=picker&status=invited&q=Иван&cursor=abc
Authorization: Bearer <admin-token>
```

| Param | Тип | Required | Описание |
|-------|-----|----------|----------|
| `role` | string | нет | Фильтр: `customer`, `picker`, `partner`, `admin` |
| `status` | string | нет | Фильтр: `invited`, `active`, `deleted` |
| `q` | string | нет | Поиск по phone / fullName |
| `cursor` | string | нет | Cursor pagination |

**Response 200:**
```json
{
  "users": [
    {
      "id": "uuid",
      "phone": "+79991234567",
      "role": "picker",
      "status": "invited",
      "fullName": "Иван Сидоров",
      "createdAt": "2026-02-15T00:30:00Z"
    }
  ],
  "nextCursor": "xyz"
}
```

**Errors:**
- 403 `FORBIDDEN` — caller не admin

---

### 14.3 CLI Script (MVP shortcut)

> Post-MVP → React Admin UI. MVP: скрипт вызывает `POST /admin/users/invite` с service JWT.

```bash
# Invite picker
./scripts/invite-user.sh --phone +79991234567 --role picker --name "Иван Сидоров"

# Invite partner
./scripts/invite-user.sh --phone +79991234567 --role partner --partner-id uuid
```

Реализация: `curl` + service JWT (ENV: `ADMIN_SERVICE_TOKEN`).


## Appendix A. Error Response Format

Все ошибки возвращаются в едином формате:

```json
{
  "code": "ERROR_CODE",
  "message": "Человекочитаемое описание",
  "details": { }
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `code` | string | Machine-readable код ошибки (UPPER_SNAKE_CASE) |
| `message` | string | Описание на русском для отображения |
| `details` | object | Дополнительные данные (nullable) |


> **v1.4.4 (Patch Bundle v1.0, Fix #9):** Все `message` в MVP — на русском языке (ru-RU). Error `code` (`UPPER_SNAKE_CASE`) — language-agnostic. Форматы цен, дат и другие i18n-правила — см. Spec v1.4.4 sec 14 (Localization Policy).
---

## Appendix B. HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (business logic) |
| 410 | Gone (expired resource, e.g. OTP session) — *NEW v1.4.1, Патч #3* |
| 422 | Unprocessable Entity (validation + business rules) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Appendix C. Background Jobs

### Hold Auto-Cancel (15 min)

```
CRON every 1 minute

Logic:
  SELECT id FROM customer_order
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '15 minutes'

  FOR EACH order:
    provider.cancel_payment(order.payment_ref)
    order.status = 'cancelled'
    order.payment_status = 'refunded'
    WS → customer: order.statuschanged { reason: 'HOLD_EXPIRED' }
    Push → customer
```

### OTP / Token Cleanup — NEW v1.4.1

```
CRON daily 03:00 MSK

Logic:
  -- 1. Отозванные refresh tokens старше 7 дней
  DELETE FROM refresh_token
  WHERE revoked_at IS NOT NULL
    AND revoked_at < NOW() - INTERVAL '7 days';

  -- 2. Verified OTP sessions старше 7 дней
  DELETE FROM otp_session
  WHERE status = 'verified'
    AND updated_at < NOW() - INTERVAL '7 days';

  -- 3. Expired (не verified) OTP sessions старше 1 дня
  DELETE FROM otp_session
  WHERE status IN ('pending', 'blocked')
    AND expires_at < NOW() - INTERVAL '1 day';

  -- 4. Expired refresh tokens (не отозванные, но протухшие)
  DELETE FROM refresh_token
  WHERE revoked_at IS NULL
    AND expires_at < NOW();
```

### Account Deletion ← ALTERED v1.4.2

> **v1.4.2 (Патч #3):** Примечание: если у пользователя есть заказы в статусах `ready` / `customer_arrived`, запрос на удаление блокируется на уровне API (sec 5.3). CRON исполняет только уже одобренные deletion requests.

```
CRON daily 04:00 MSK

Logic:
  SELECT dr.* FROM deletion_request dr
  JOIN app_user u ON u.id = dr.user_id
  WHERE dr.status = 'pending'
    AND dr.scheduled_at <= NOW()

  FOR EACH request:
    u.phone → 'deleted_{u.id}'
    u.full_name → NULL
    u.deleted_at = NOW()
    u.status = 'deleted'
    Revoke all refresh_tokens WHERE user_id = u.id
    DELETE FROM cart WHERE customer_id = u.id
    IF u.role = 'picker': reassign active orders
    dr.status = 'executed'
    dr.executed_at = NOW()
```

### Smart Alerts Engine — NEW v1.4.0

```
CRON every 30 min

Logic:
  current_hour = NOW() AT TIME ZONE 'Europe/Moscow'

  window_filter:
    morning  → 08:00–12:00
    evening  → 17:00–21:00
    all_day  → 08:00–21:00

  SELECT sa.* FROM smart_alert sa
  WHERE sa.is_active = TRUE
    AND schedule_matches(sa.schedule, current_hour)
    AND (sa.last_fired_at IS NULL OR sa.last_fired_at < NOW() - INTERVAL '24 hours')

  FOR EACH alert:
    CASE trigger_type:
      'price_drop':
        IF product.current_price < sa.reference_price * 0.95 → FIRE
      'back_in_stock':
        IF product.is_available = TRUE → FIRE
      'price_threshold':
        IF product.current_price <= sa.threshold → FIRE

    ON FIRE:
      INSERT smart_alert_log(alert_id, payload)
      sa.last_fired_at = NOW()
      Push → user notification with payload
```

---

## Appendix D. Endpoint Summary ← ALTERED v1.4.2

### Public (no auth)

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 1 | POST | `/api/v1/auth/send-otp` | 1.1 |
| 2 | POST | `/api/v1/auth/verify-otp` | 1.2 |
| 3 | POST | `/api/v1/auth/refresh` | 1.3 |

### Webhooks (no JWT, IP whitelist) ← NEW v1.4.3

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 58 | POST | `/api/v1/webhooks/tinkoff` | 13.1 ← *NEW v1.4.3* |

### Customer (Bearer token, role=customer)

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 4 | POST | `/api/v1/auth/logout` | 1.4 |
| 5 | POST | `/api/v1/auth/logout-all` | 1.5 |
| 6 | POST | `/api/v1/auth/register-push` | 1.6 ← *NEW v1.4.2* |
| 7 | GET | `/api/v1/stores` | 2.1 |
| 8 | GET | `/api/v1/stores/:id` | 2.2 |
| 9 | GET | `/api/v1/stores/:id/products` | 2.3 |
| 10 | GET | `/api/v1/products/:id` | 2.4 |
| 11 | GET | `/api/v1/search` | 3.1 |
| 12 | GET | `/api/v1/search/suggest` | 3.2 |
| 13 | GET | `/api/v1/cart` | 4.1 |
| 14 | POST | `/api/v1/cart/items` | 4.2 |
| 15 | PUT | `/api/v1/cart/items/:id` | 4.3 |
| 16 | DELETE | `/api/v1/cart/items/:id` | 4.4 |
| 17 | DELETE | `/api/v1/cart` | 4.5 |
| 18 | POST | `/api/v1/cart/checkout` | 4.6 |
| 19 | GET | `/api/v1/orders/:id` | 10.1 |
| 20 | POST | `/api/v1/orders/:id/cancel` | 10.3 |
| 21 | POST | `/api/v1/orders/:id/arrived` | 10.10 ← *NEW v1.4.2* |
| 22 | GET | `/api/v1/profile` | 5.1 |
| 23 | PUT | `/api/v1/profile` | 5.2 |
| 24 | POST | `/api/v1/profile/delete` | 5.3 |
| 25 | POST | `/api/v1/profile/delete/cancel` | 5.4 |
| 26 | GET | `/api/v1/favorites` | 6.1 |
| 27 | POST | `/api/v1/favorites` | 6.2 |
| 28 | DELETE | `/api/v1/favorites/:id` | 6.3 |
| 29 | DELETE | `/api/v1/favorites` | 6.4 |
| 30 | GET | `/api/v1/addresses` | 7.1 |
| 31 | POST | `/api/v1/addresses` | 7.2 |
| 32 | PUT | `/api/v1/addresses/:id` | 7.3 |
| 33 | DELETE | `/api/v1/addresses/:id` | 7.4 |
| 34 | GET | `/api/v1/smart-alerts` | 8.1 |
| 35 | POST | `/api/v1/smart-alerts` | 8.2 |
| 36 | PUT | `/api/v1/smart-alerts/:id` | 8.3 |
| 37 | DELETE | `/api/v1/smart-alerts/:id` | 8.4 |
| 38 | GET | `/api/v1/smart-alerts/:id/history` | 8.5 |
| 39 | GET | `/api/v1/orders/:id/chat` | 9.1 |
| 40 | POST | `/api/v1/orders/:id/chat` | 9.2 |
| 41 | POST | `/api/v1/orders/:id/chat/read` | 9.3 |
| 42 | GET | `/api/v1/orders` | 10.8 |
| 43 | POST | `/api/v1/orders/:id/rate` | 10.9 |

### Picker (Bearer token, role=picker)

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 44 | POST | `/api/v1/auth/register-push` | 1.6 ← *shared with customer* |
| 45 | GET | `/api/v1/picker/orders` | 10.4 |
| 46 | PUT | `/api/v1/picker/orders/:id/accept` | 10.5 |
| 47 | PUT | `/api/v1/picker/orders/:id/item/:itemId/weigh` | 10.6 |
| 48 | PUT | `/api/v1/picker/orders/:id/complete` | 10.7 |
| 49 | POST | `/api/v1/picker/orders/:id/confirm-pickup` | 10.11 ← *NEW v1.4.2* |
| 50 | GET | `/api/v1/orders/:id/chat` | 9.1 |
| 51 | POST | `/api/v1/orders/:id/chat` | 9.2 |
| 52 | POST | `/api/v1/orders/:id/chat/read` | 9.3 |

### Partner (Bearer token, role=partner)

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 53 | POST | `/api/v1/partner/stores/:id/products` | 2.5 |
| 54 | PUT | `/api/v1/partner/products/:id` | 2.6 |
| 55 | DELETE | `/api/v1/partner/products/:id` | 2.7 |
| 56 | GET | `/api/v1/partner/stores/:id/products` | 2.8 |
| 57 | POST | `/api/v1/partner/products/:id/images` | 2.9 ← *NEW v1.4.3* |
| 58 | DELETE | `/api/v1/partner/products/:id/images/:imageId` | 2.10 ← *NEW v1.4.3* |
| 59 | POST | `/api/v1/partner/settlements/:periodId/dispute` | 11.1 |

### Admin (Bearer token, role=admin) ← NEW v1.4.3

| # | Method | Endpoint | Section |
|---|--------|----------|---------|
| 60 | POST | `/api/v1/admin/users/invite` | 14.1 ← *NEW v1.4.3* |
| 61 | GET | `/api/v1/admin/users` | 14.2 ← *NEW v1.4.3* |

**Итого: 61 unique эндпоинтов (было 56 в v1.4.2), +5 новых: webhook tinkoff (#58), partner images (#57–#58), admin invite (#60), admin list (#61). Нумерация #1–#61 включает shared endpoints.**

---

## Appendix E. Rate Limit Policy — NEW v1.4.1

> Патч #7. Глобальная политика rate limiting.

### Лимиты по scope

| Scope | Limit | Applies to |
|-------|-------|------------|
| Auth — per phone | 1 req/60s, 5/day | `POST /auth/send-otp` |
| Auth — per IP | 10 req/min, 30/day | `POST /auth/send-otp` |
| Chat — per user per order | 10 msg/min | `POST /orders/:id/chat` |
| Write — per user | 30 req/min | Все POST/PUT/DELETE (кроме auth, chat) |
| Read — per user | 120 req/min | Все GET |
| Partner API — per partner | 60 req/min | Все `/partner/*` |
| Global — per IP | 300 req/min | Fallback для всех эндпоинтов |

### Ответ при превышении

HTTP 429:

```json
{
  "code": "RATE_LIMITED",
  "message": "Слишком много запросов. Повторите через 12 с.",
  "details": {
    "retryAfter": 12,
    "scope": "user_write"
  }
}
```

### Response Headers

Все ответы включают заголовки rate limit:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 12
X-RateLimit-Reset: 1739577600
```

| Header | Описание |
|--------|----------|
| `X-RateLimit-Limit` | Максимум запросов в текущем окне |
| `X-RateLimit-Remaining` | Оставшиеся запросы в текущем окне |
| `X-RateLimit-Reset` | Unix timestamp сброса окна |

### Приоритет

При попадании под несколько scope-ов применяется **наиболее специфичный**:
`Auth per phone` > `Chat per user per order` > `Write/Read per user` > `Partner per partner` > `Global per IP`.

---

## Appendix F. OpenAPI Specification Reference ← NEW v1.4.4

> Новый appendix (Patch Bundle v1.0, Fix #4). Машиночитаемый API-контракт для codegen, mock-сервера и автотестов.

**Файл:** `openapi.yaml` v1.4.4
**Формат:** OpenAPI 3.1.0
**Эндпоинтов:** 61 (sync with Appendix D)
**Источник:** API Contract v1.4.4, все секции 1–14

**Генерация:**
```bash
python scripts/generate_openapi.py --input api_contract_v1.4.4.md --output openapi.yaml
```

**Использование:**
```bash
# Client codegen (TypeScript Axios)
openapi-generator generate -i openapi.yaml -g typescript-axios -o src/api

# Mock server
prism mock openapi.yaml

# Contract testing
schemathesis run openapi.yaml --base-url=http://localhost:8080

# Lint / validate
npx @redocly/cli lint openapi.yaml

# Breaking change detection (CI)
npx oasdiff breaking openapi-prev.yaml openapi.yaml
```

**Ключевые schemas (components/schemas):**

| Schema | Source | Описание |
|--------|--------|----------|
| `Error` | Appendix A | Единый формат `{ code, message, details }` |
| `DisputeRequest` | Sec 11.1 | `{ lineIds: uuid[], reason: string }` *(FIXED v1.4.4)* |
| `DisputeResponse` | Sec 11.1 | `{ periodId, status, disputedLinesCount, totalDisputedLines }` *(FIXED v1.4.4)* |
| `CheckoutRequest` | Sec 4.6 | `{ paymentMethod }` |
| `CheckoutResponse` | Sec 4.6 | Orders array with `paymentUrl` / `qrCodeUrl` |
| `CustomerOrder` | Sec 10.1 | Full order with status enum + timestamps |
| `TinkoffWebhook` | Sec 13.1 | Incoming Tinkoff notification |
| `CursorParam` | Global | Reusable cursor parameter |

**Серверы:**
```yaml
servers:
  - url: https://api.robinfood.ru/api/v1
    description: Production
  - url: https://api-staging.robinfood.ru/api/v1
    description: Staging
```

**CI интеграция:** см. Patch Bundle v1.0, Fix #6 (`.github/workflows/ci.yml`, stage `contract`).

### Versioning ← NEW v1.4.5

> Новый блок (Snapshot решений 16.02.2026, §4.2). Формальная привязка к политике версионирования API.

- Данный документ и `openapi.yaml` описывают эндпоинты `/api/v1/...`.
- Правила версионирования и деприкации определены в Spec v1.4.5, sec 2.16.
- Будущие major-версии будут публиковаться как отдельные контракты (API Contract v2.x, `openapi-v2.yaml`).

---

## Document Version Matrix ← UPDATED v1.4.5

| Document | Version | Min Compatible |
|----------|---------|----------------|
| API Contract | **v1.4.4** | v1.4.3 |
| Spec | **v1.4.4** | v1.4.3 |
| Data Model | **v1.4.10** | v1.4.9 |
| Navigation | **v1.4.4** | v1.4.3 |
| Integration Contracts | **v1.6.4** | v1.6.3 |
| BNPL Integration | **v1.2.2** | v1.2.2 |
| Settlement | **v1.2.2** | v1.2.1 |

> Cross-references обновлены для соответствия Snapshot решений (16.02.2026). Все зависимости синхронизированы: IC v1.6.4, Settlement v1.2.2, Nav v1.4.4, Spec v1.4.4, DM v1.4.10.

---

API Contract v1.4.5 (Consolidated) — 16.02.2026 — Robin Food Product Engineering Team
