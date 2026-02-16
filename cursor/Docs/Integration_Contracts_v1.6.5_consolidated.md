# Robin Food — Integration Contracts v1.6.5 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.6.5 | 16.02.2026 | Consolidated | Robin Food Integration Team |

**Scope v1.6.5:** Полное описание интеграционных контрактов с внешними системами — payment providers, SMS (OTP), push, geocoding, image hosting. Патч v1.6.4 — синхронизация с Patch Bundle v1.0: localization format references для push-body с ценами (Spec v1.4.4 sec 14), обновление cross-references. Патч v1.6.3 — синхронизация с Patch Snapshot v1.2 (webhook Tinkoff/СБП + unified CRON monitoring); Патч v1.6.2 — синхронизация с Patch Snapshot v1.1: `consentAccepted` в OTP flow, `push_token` через `refresh_token`, `INVALID_OTP` 401->400, `sbp` маппинг, push triggers для `ready`/`customer_arrived`/`completed`. **Патч v1.6.5:** IP whitelist Tinkoff webhook → config-driven (runbook RF-NET-01); новая подсекция 1.4 Settlement Payout Provider (Bank Transfer); обновление Version Matrix (Spec v1.4.5, DM v1.4.11).

**Зависимости:** Spec v1.4.5, API Contract v1.4.4, BNPL Integration v1.2.2, Data Model v1.4.11, Settlement v1.2.2, Navigation v1.4.4

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026), Patch Snapshot v1.3 (16.02.2026), Patch Snapshot v1.6.5 (16.02.2026)

---

## Changelog v1.6.4 -> v1.6.5

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Sec 1.1: Tinkoff webhook IP whitelist — заменён жёсткий CIDR `91.194.226.0/23` на config-driven подход (env `TINKOFF_WEBHOOK_IP_RANGES`, runbook `RF-NET-01`) | IP whitelist management | ALTER SECURITY |
| 2 | NEW sec 1.4: Settlement Payout Provider (Bank Transfer) — формализация контракта выплат партнёрам (`POST /v1/transfers`, `transferId`, error handling) | Payout Execution | NEW SECTION |
| 3 | Sec 12: Version Matrix — Spec v1.4.4 → v1.4.5, Data Model v1.4.10 → v1.4.11, IC self v1.6.4 → v1.6.5 | Version Matrix sync | METADATA |

---

## Changelog v1.6.3 -> v1.6.4

| # | Изменение | Patch Bundle Fix | Тип |
|---|-----------|-----------------|-----|
| 1 | Sec 3.4, 3.5: Push notification body с ценами — формат `{price/100} ₽` (запятая-разделитель), ссылка Spec v1.4.4 sec 14.3 | Fix #9 | ADD NOTE |
| 2 | Sec 1.1: cross-ref webhook API Contract v1.4.3 → v1.4.4 sec 13.1 | meta | ALTER REF |
| 3 | Sec 8.2: Settlement ref v1.2.1 → v1.2.2 | meta | ALTER REF |
| 4 | All cross-refs: Spec v1.4.3 → v1.4.4, API Contract v1.4.3 → v1.4.4, DM v1.4.9 → v1.4.10, Settlement v1.2.1 → v1.2.2, Nav v1.4.3 → v1.4.4 | meta | ALTER REF |
| 5 | Sec 12: Document Version Matrix обновлена | meta | METADATA |

---

## Changelog v1.6.2 -> v1.6.3

| # | Изменение | Патч Snapshot v1.2 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 1.1: добавлен явный контракт для Tinkoff Notification Callback URL (prod/staging), retry policy, СБП-специфика | Патч #1 | NEW NOTE |
| 2 | Sec 1.2: cross-ref на API Contract v1.4.3 sec 13.1 (`POST /api/v1/webhooks/tinkoff`) | Патч #1 | ADD REF |
| 3 | Sec 8.6: NEW — Unified CRON Monitoring & Alerting (health wrapper, Prometheus metrics, thresholds, Dead Man's Switch) | Патч #6 | NEW SECTION |
| 4 | Sec 8.2: Settlement Pipeline note выровнен с unified monitoring (ref sec 8.6) | Патч #6 | NOTE |
| 5 | Sec 12: Document Version Matrix обновлена (Spec v1.4.3, AC v1.4.3, DM v1.4.9, Nav v1.4.3, IC v1.6.3) | Патч v1.2 meta | META |

---

## Changelog v1.6.1 -> v1.6.2

| # | Изменение | Патч Snapshot v1.1 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 2.1: flow diagram — `verify-otp body` включает `consentAccepted` (conditional); ошибка `400 CONSENT_REQUIRED` | Патч #1 | UPDATED |
| 2 | Sec 3: `send_push()` переписан — push routing через `refresh_token.push_token` / `push_platform` вместо `device.push_token`; ссылка на `POST /auth/register-push` | Патч #2 | BREAKING |
| 3 | Sec 3.2: push triggers — добавлены `order.ready`, `picker.customer_arrived`, `order.completed`; sec 3.5: JSON payloads | Патч #3 | UPDATED |
| 4 | Sec 2.1: `INVALID_OTP` HTTP status 401 -> **400** (alignment с Spec + API Contract) | Патч #4 | FIX |
| 5 | Sec 1.2: `sbp` -> Tinkoff Init mapping (`PayType: 'SBP'`); `payment_provider` enum расширен | Патч #5 | UPDATED |
| 6 | Sec 1.1: note — capture теперь при `picking -> ready` (Патч #3) | Патч #3 | NOTE |
| 7 | Sec 1.3: BNPL ref обновлён v1.2.1 -> v1.2.2 | Патч #3 meta | META |
| 8 | Sec 9: FCM invalid token — `refresh_token.push_token = null` (was `device.push_token`) | Патч #2 | FIX |
| 9 | Document Version Matrix обновлена | all | META |

---

## Changelog v1.6.0 -> v1.6.1

| # | Изменение | Snapshot Патч | Тип |
|---|-----------|--------------|-----|
| 1 | Sec 2.1: OTP error codes aligned — `INVALID_OTP`, `OTP_BLOCKED`, `OTP_EXPIRED` | Патч #2 | UPDATED |
| 2 | Sec 2.1: `410 OTP_EXPIRED` (was implicit) — теперь explicit в flow diagram | Патч #3 | UPDATED |
| 3 | Sec 8.5: Cleanup CRON SQL — добавлены правила для `verified` OTP (7d) и expired `refresh_token` | Патч #4 | UPDATED |
| 4 | Sec 3: Open question resolved — FCM primary, RuStore Push post-MVP; `PushGateway` Protocol | Патч #5a | RESOLVED |
| 5 | Sec 5: Open question resolved — Yandex Object Storage (ru-central1) | Патч #5b | RESOLVED |
| 6 | Sec 11: Open question resolved — Admin Panel = React Admin (lightweight web-UI) | Патч #5c | RESOLVED |
| 7 | Sec 8.2: Settlement Pipeline — sequential note (Step 1 + Step 2 + Step 3) | Патч #6 | UPDATED |
| 8 | Sec 2.1: Rate limits — ссылка на API Contract Appendix E (Rate Limit Policy) | Патч #7 | NOTE |
| 9 | Document Version Matrix — cross-references synced | Патч #8 | META |
| 10 | BNPL Integration ref: v1.2 -> v1.2.1 | Патч #8 | META |

---

## Changelog v1.5.1 -> v1.6.0

| # | Изменение | Snapshot § | Тип |
|---|-----------|-----------|-----|
| 1 | SMS: расширен контракт SMSC.ru для Auth OTP (rate limits, TTL, blocked) | §2 | UPDATED |
| 2 | Push: расширены trigger cases (Smart Alerts, Chat, Deletion Reminder) | §9, §10, §6 | UPDATED |
| 3 | Push: отмечен open question FCM vs RuStore Push | §14.1 | NOTE |
| 4 | Geocoding: расширен для Addresses (client-side suggest + forward) | §8 | UPDATED |
| 5 | NEW: Image Hosting — S3-compatible для product_image | §14.2 | NEW |
| 6 | NEW: CRON Jobs — 3 новых job с внешними вызовами | §13 | NEW |
| 7 | Rename: `order` -> `customer_order` во всех ссылках | §1.2 | RENAME |
| 8 | Зависимости обновлены до v1.4.0 / v1.4.6 / v1.2.1 | §12 | META |

---

## 1. Payment Providers

### 1.1 Tinkoff Acquiring

**Notification Callback (Webhook) — UPDATED v1.6.3 (Патч #1)**

- Callback URL (prod): `https://api.robinfood.ru/api/v1/webhooks/tinkoff`
- Callback URL (staging): `https://api-staging.robinfood.ru/api/v1/webhooks/tinkoff`
- IP whitelist: **config-driven** (UPDATED v1.6.5)
  - Конкретные CIDR-диапазоны Tinkoff настраиваются через переменную окружения `TINKOFF_WEBHOOK_IP_RANGES`.
  - Источник правды: инфраструктурный runbook `RF-NET-01`.
  - Текущие диапазоны (справочно, не являются каноничным источником): `91.194.226.0/23`.
  - При ротации IP со стороны Tinkoff — обновляется env-переменная и runbook, без изменений в коде или документации.
- Auth: HMAC SHA-256 (`Token` в payload по доке Tinkoff)
- Retry policy: 10s, 30s, 60s, 5min, 10min, 30min, 1h, 3h, 6h, 24h (остановка при HTTP 200 OK)
- СБП-специфика: после подтверждения в банковском приложении → `Status='AUTHORIZED'`, после capture → `Status='CONFIRMED'`

> Детальная обработка webhook описана в API Contract v1.4.4, sec 13.1 (`POST /api/v1/webhooks/tinkoff`). Здесь фиксируются callback URL, whitelist, retry policy и СБП-специфика.

**Base URL:** `https://securepay.tinkoff.ru/v2/`

**Authentication:** TerminalKey + подпись запросов (HMAC SHA-256)

#### Init Payment (Hold)

```
POST /Init
Body:
{
  "TerminalKey": "your_terminal_key",
  "Amount": 5458000,  // kopecks
  "OrderId": "uuid",
  "Description": "Заказ Robin Food #uuid",
  "Token": "signature"
}

Response 200:
{
  "Success": true,
  "PaymentId": "12345678",
  "PaymentURL": "https://securepay.tinkoff.ru/...",
  "Status": "NEW"
}
```

**Side effect:** Hold на карте покупателя на 15 минут.

**Caller:** `POST /cart/checkout` -> для каждого sub-order (v1.6.0 UPDATED — was `POST /orders`).

#### Confirm Payment (Capture)

```
POST /Confirm
Body:
{
  "TerminalKey": "your_terminal_key",
  "PaymentId": "12345678",
  "Amount": 4658000,  // final amount (может быть < hold)
  "Token": "signature"
}

Response 200:
{
  "Success": true,
  "Status": "CONFIRMED",
  "PaymentId": "12345678"
}
```

**При частичном capture:** разница между hold и capture автоматически возвращается.

> **v1.6.2 (Патч #3):** Capture теперь происходит при `picking -> ready` (ранее при `picking -> completed`). Confirm вызов через Tinkoff API идентичен — разница только в моменте вызова. См. Spec v1.4.4, sec 2.15.

#### Cancel Payment (Refund)

```
POST /Cancel
Body:
{
  "TerminalKey": "your_terminal_key",
  "PaymentId": "12345678",
  "Amount": 4658000,  // full or partial
  "Token": "signature"
}

Response 200:
{
  "Success": true,
  "Status": "REFUNDED",
  "PaymentId": "12345678"
}
```

**Full refund:** `customer_order.payment_status -> 'refunded'`
**Partial refund:** `payment_status` остаётся `'paid'`, создаётся `settlement_adjustment(type='refund')` (BR-PAY-5)

---

### 1.2 СБП (Система Быстрых Платежей) — UPDATED v1.6.2

**Интеграция через Tinkoff:**

```
POST /Init
Body:
{
  "TerminalKey": "your_terminal_key",
  "Amount": 5458000,
  "OrderId": "uuid",
  "PayType": "SBP",  // СБП flag
  "Token": "signature"
}
```

**QR-код:** response содержит `QrCodeURL` для оплаты через банковское приложение.

**Webhook:** Tinkoff шлёт notification на callback URL при смене статуса.

**Маппинг `sbp` -> Tinkoff Init (NEW v1.6.2 — Патч #5):**

```python
def init_payment(order):
    if order.payment_provider == 'sbp':
        payload = {
            "TerminalKey": TINKOFF_TERMINAL_KEY,
            "Amount": order.total_amount,
            "OrderId": str(order.id),
            "PayType": "SBP",              # СБП flag
            "Token": sign(payload)
        }
        response = tinkoff_api.init(payload)
        # response contains QrCodeURL for bank app
        return {'qrCodeUrl': response['QrCodeURL'], 'paymentId': response['PaymentId']}

    elif order.payment_provider == 'tinkoff':
        # Стандартный card flow (PayType отсутствует)
        payload = {
            "TerminalKey": TINKOFF_TERMINAL_KEY,
            "Amount": order.total_amount,
            "OrderId": str(order.id),
            "Token": sign(payload)
        }
        response = tinkoff_api.init(payload)
        return {'paymentUrl': response['PaymentURL'], 'paymentId': response['PaymentId']}
```

> **v1.6.2 (Патч #5):** `customer_order.payment_provider = 'sbp'` (не `'tinkoff'`). Confirm/Cancel вызовы — через тот же Tinkoff API, различий нет. Разделение нужно для UX, аналитики и отчётности.

**Payment provider enum (UPDATED v1.6.2):**

| Provider | Описание | Init flow |
|----------|----------|-----------|
| `tinkoff` | Банковские карты (Tinkoff Acquiring) | Standard Init |
| `sbp` | Система Быстрых Платежей (через Tinkoff) | Init с `PayType: 'SBP'` **(NEW v1.6.2)** |
| `yandex_split` | BNPL, Яндекс Сплит | BNPL authorize |
| `dolyame` | BNPL, Долями | BNPL authorize |

---

### 1.3 BNPL Providers (UPDATED v1.6.2)

**Supported providers:**
- Яндекс Сплит (`yandex_split`)
- Долями (`dolyame`)

**Параметры провайдеров:**

```python
BNPL_PROVIDERS = {
  'yandex_split': {
    'name': 'Яндекс Сплит',
    'minAmount': 50000,     # kopecks (500 руб)
    'maxAmount': 100000000, # 1M руб
    'installments': [3, 6],
    'apiUrl': 'https://split.yandex.ru/api/v1',
    'apiKey': 'ENV_VAR'
  },
  'dolyame': {
    'name': 'Долями',
    'minAmount': 50000,     # kopecks (500 руб)
    'maxAmount': 200000000, # 2M руб
    'installments': [4],
    'apiUrl': 'https://partner.dolyame.ru/v1',
    'apiKey': 'ENV_VAR'
  }
}
```

**Использование `minAmount`:**

```python
# BR-BNPL-6 check at PUT /picker/orders/:id/complete
def check_bnpl_minAmount(order):
    if order.payment_provider not in ('yandex_split', 'dolyame'):
        return None

    provider_config = BNPL_PROVIDERS[order.payment_provider]
    final_amount = calc_order_gmv(order)

    if final_amount < provider_config['minAmount']:
        return {
            'code': 'BNPL_BELOW_MIN',
            'currentTotal': final_amount,
            'minAmount': provider_config['minAmount'],
            'provider': order.payment_provider
        }
    return None
```

**Multistore checkout (v1.6.0):** При `POST /cart/checkout` BNPL `minAmount` проверяется **per sub-order**, т.к. каждый `customer_order` — отдельная транзакция. Если sub-order < `minAmount`, checkout для этого sub-order отклоняется с `BNPL_BELOW_MIN`.

**Детальные контракты:** см. BNPL Integration v1.2.2 (sections 3-5). *(v1.6.2: ref обновлён v1.2.1 -> v1.2.2)*

---
### 1.4 Settlement Payout Provider (Bank Transfer) — NEW v1.6.5

> Формализация интеграционного контракта для выплат партнёрам. Caller: Settlement Service (`executepayout()`), только для периодов со статусом `approved` (Settlement v1.2.2, sec 10).

**Provider:** Банк-эквайер (конкретный провайдер TBD — MVP может быть ручной перевод через банк-клиент, post-MVP — API).

**Pseudo-endpoint:**

```
POST https://bank-api.example.com/v1/transfers
Headers:
  Authorization: Bearer <bank-api-token>
  Content-Type: application/json
  Idempotency-Key: {periodId}

Body:
{
  "recipientInn": "1234567890",       // partner.inn
  "recipientAccount": "40702...",      // partner bank account (post-MVP)
  "amount": 38750.00,                 // settlement_period.total_payout, RUB
  "currency": "RUB",
  "description": "Robin Food settlement 2026-02-03 — 2026-02-09"
}

Response 200:
{
  "transferId": "TRF-20260216-001",   // → settlement_period.payout_ref (Data Model v1.4.11)
  "status": "COMPLETED"               // COMPLETED | PENDING | FAILED
}
```

**Processing Logic:**

```python
def execute_payout(period_id: UUID) -> None:
    period = db.get(SettlementPeriod, period_id)
    partner = db.get(Partner, period.partner_id)

    if period.status != 'approved':
        raise ValueError(f"Period {period_id} not approved, current status: {period.status}")

    # 1. Call bank payout API
    response = payout_provider.transfer(
        recipient_inn=partner.inn,
        amount=period.total_payout,
        description=f"Robin Food settlement {period.period_start} — {period.period_end}",
        idempotency_key=str(period_id)
    )

    # 2. Update period
    if response.status == 'COMPLETED':
        period.status = 'paid'
        period.payout_ref = response.transfer_id  # Data Model v1.4.11, Table 20
        period.updated_at = datetime.utcnow()
        db.commit()

        # 3. Notify partner
        send_email(
            partner.contact_email,
            subject=f"Выплата за {period.period_start} — {period.period_end}",
            body=f"Сумма {period.total_payout / 100:.2f} ₽ перечислена. Ref: {response.transfer_id}"
        )
    elif response.status == 'PENDING':
        # Async payout — poll or wait for callback
        period.payout_ref = response.transfer_id
        db.commit()
        log.info(f"Payout pending for period {period_id}, ref {response.transfer_id}")
    else:
        # FAILED — do not change status, alert ops
        send_ops_alert(
            severity='critical',
            message=f"Payout FAILED for period {period_id}, partner {partner.inn}: {response}"
        )
        sentry_sdk.capture_message(f"Payout failed: {period_id}")
```

**Error Handling:**

| Scenario | Action |
|----------|--------|
| Bank API unavailable | Retry x3 (exp backoff), then alert ops, period stays `approved` |
| Transfer failed | Alert ops, period stays `approved`, manual retry required |
| Transfer pending | Store `payout_ref`, poll status or await callback |
| Duplicate request (same `Idempotency-Key`) | Bank returns existing `transferId`, no-op |

**Security:**
- Bank API credentials stored in env variables, never in code.
- TLS 1.2+ required.
- Idempotency-Key = `periodId` (UUID) — prevents duplicate payouts.

**Cross-references:**
- Settlement v1.2.2, sec 10 — Payout Execution business logic.
- Data Model v1.4.11, Table 20 — `settlement_period.payout_ref` column.
- Spec v1.4.5, sec 12 — NFR (latency, security).

---

## 2. SMS Provider (UPDATED v1.6.2)

**Используется:** SMSC.ru

**Endpoint:** `https://smsc.ru/sys/send.php`

```
POST /send.php
Params:
  login: 'your_login'
  psw: 'your_password'
  phones: '+79991234567'
  mes: 'Robin Food: 482916'  // 6-digit OTP
  fmt: 3  // JSON response

Response 200:
{
  "id": 123456,
  "cnt": 1
}
```

### 2.1 OTP Delivery (UPDATED v1.6.2)

Основной use case — доставка OTP-кодов для Auth flow.

**Caller:** `POST /auth/send-otp` -> SMSC.ru -> SMS -> user

**Параметры:**

| Параметр | Значение | Описание |
|----------|----------|----------|
| OTP длина | 6 цифр | Генерируется server-side (`otp_session.code`) |
| OTP TTL | 2 мин | `otp_session.expires_at = created_at + 2 min` |
| Max попыток | 3 | После 3 неверных -> `otp_session.status = 'blocked'` |
| Sender name | `Robin Food` | Alphanumeric sender ID |

**OTP Error Codes (UPDATED v1.6.2, Патч #4):**

| Ситуация | HTTP | Error Code | Details |
|----------|------|------------|---------|
| Неверный код | **400** | `INVALID_OTP` | `{ attemptsLeft: N }` |
| 3 неверных попытки | 403 | `OTP_BLOCKED` | `{ blockedUntil: ISO8601 }` |
| OTP истёк (>2 min) | 410 | `OTP_EXPIRED` | `{ expiredAt: ISO8601 }` |
| Согласие не дано (новый user) | **400** | **`CONSENT_REQUIRED`** | `{ field: "consentAccepted", law: "152-ФЗ" }` |

> **v1.6.1 -> v1.6.2 (Патч #4):** HTTP-статус `INVALID_OTP` изменён с `401` на `400 Bad Request` — alignment с Spec v1.4.4 и API Contract v1.4.4. Семантически `400` верен — ошибка ввода клиента, не проблема аутентификации.
>
> **v1.6.1 -> v1.6.2 (Патч #1):** Добавлена ошибка `CONSENT_REQUIRED` для новых пользователей, не давших согласие на обработку ПД (152-ФЗ).

**Rate Limits (server-side, перед вызовом SMSC):**

| Scope | Limit | Action при превышении |
|-------|-------|----------------------|
| Per phone | 1 SMS / 60 сек | `429 RATE_LIMITED { retryAfter: N }` |
| Per phone | 5 SMS / день | `429 RATE_LIMITED` |
| Per IP | 10 req / мин | `429 RATE_LIMITED` |
| Per IP | 30 req / 24 часа | `429 RATE_LIMITED` |

> **v1.6.1 (Патч #7):** Rate limits для Auth OTP включены в общую Rate Limit Policy — см. API Contract v1.4.4, Appendix E. Таблица выше — subset, специфичный для SMS-провайдера. Полная политика (включая Write/Read/Chat/Partner API) описана в Appendix E.

**Flow diagram (UPDATED v1.6.2 — Патч #1, #4):**
```
Client -> POST /auth/send-otp { phone }
  |
  |-- Rate limit check (phone + IP) [ref: API Contract v1.4.4 Appendix E]
  |   +-- IF exceeded -> 429 RATE_LIMITED { retryAfter: N }
  |
  |-- Generate OTP (6 digits)
  |-- Store otp_session { phone, code_hash, status='pending', expires_at }
  |
  |-- Call SMSC.ru POST /send.php
  |   |-- Success -> 200 { otpSent: true, retryAfter: 60 }
  |   +-- Failure -> retry (max 2), then 503 SMS_DELIVERY_FAILED
  |
  +-- Client -> POST /auth/verify-otp { otpSessionId, code, consentAccepted }   <-- v1.6.2: +consentAccepted
      |-- Validate code against otp_session
      |-- IF match    -> check consent (if new user)                              <-- v1.6.2: NEW step
      |   |-- IF new user AND consentAccepted != true -> 400 CONSENT_REQUIRED     <-- v1.6.2: NEW error
      |   +-- ELSE -> JWT tokens + otp_session.status='verified'
      |       +-- Client -> POST /auth/register-push { pushToken, platform }      <-- v1.6.2: NEW step (Патч #2)
      |-- IF mismatch -> attempts++ ; 400 INVALID_OTP { attemptsLeft: N }         <-- v1.6.2: was 401, now 400
      |   +-- IF attempts >= 3 -> status='blocked' ; 403 OTP_BLOCKED
      +-- IF expired  -> 410 OTP_EXPIRED { expiredAt }
```

### 2.2 Fallback SMS (Notifications)

Используется при отсутствии `push_token` у пользователя.

**Trigger cases:**
- Критические статусы заказа (cancelled, completed)
- Smart Alert fires (если нет push_token)

**Rate limit SMSC.ru:** 5 SMS на номер в час (fraud protection — provider-side).

---
## 3. Push Notifications (UPDATED v1.6.2)

**Используется:** Firebase Cloud Messaging (FCM) — **primary provider (MVP)**

> **RESOLVED (Патч #5a, v1.6.1):** FCM выбран как primary push-провайдер для MVP. ~85% Android-устройств в РФ поддерживают GMS. Для остальных — SMS fallback через SMSC.ru. Post-MVP: RuStore Push как secondary channel.

**Endpoint:** `https://fcm.googleapis.com/v1/projects/{project_id}/messages:send`

```
POST /messages:send
Authorization: Bearer <firebase-token>
Body:
{
  "message": {
    "token": "device_fcm_token",
    "notification": {
      "title": "Заказ собран",
      "body": "Ваш заказ #1234 готов к выдаче"
    },
    "data": {
      "orderId": "uuid",
      "type": "order.status_changed",
      "deepLink": "robinfood://order/uuid"
    },
    "apns": {
      "payload": {
        "aps": {
          "sound": "default",
          "badge": 1
        }
      }
    }
  }
}

Response 200:
{
  "name": "projects/.../messages/message-id"
}
```

### 3.1 PushGateway Abstraction (UPDATED v1.6.2)

> **Патч #5a (v1.6.1):** Для подготовки к RuStore Push post-MVP введён `PushGateway` Protocol.

```python
class PushGateway(Protocol):
    def send(self, token: str, payload: dict) -> bool: ...

class FCMGateway(PushGateway):
    # MVP -- primary push provider
    def send(self, token: str, payload: dict) -> bool:
        response = requests.post(
            f"https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send",
            headers={"Authorization": f"Bearer {get_fcm_token()}"},
            json={"message": {"token": token, **payload}},
            timeout=10
        )
        return response.ok

# Post-MVP
class RuStorePushGateway(PushGateway):
    # Secondary channel -- RuStore Push SDK
    def send(self, token: str, payload: dict) -> bool:
        # RuStore Push API (TBD post-MVP)
        ...
```

**Routing logic (UPDATED v1.6.2 — Патч #2):**

> **v1.6.1 -> v1.6.2 (Патч #2):** Заменён `get_user_device(user_id)` на запросы к `refresh_token.push_token` / `push_platform`. Push token обновляется через `POST /auth/register-push` (API Contract v1.4.4, эндпоинт #54). Хранение — `refresh_token` table (Data Model v1.4.10, Table 10). Отдельная таблица `device` для MVP избыточна — refresh_token уже привязан к устройству (FIFO max 3).

```python
def send_push(user_id: str, payload: dict):
    # Push routing через refresh_token (UPDATED v1.6.2, Патч #2)
    # Заменяет get_user_device() из v1.6.1
    sessions = db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.revoked_at.is_(None),
        RefreshToken.push_token.isnot(None)
    ).all()

    if sessions:
        for session in sessions:
            gateway = get_gateway(session.push_platform)  # FCMGateway | RuStorePushGateway
            success = gateway.send(session.push_token, payload)
            if not success:
                session.push_token = None  # invalidate stale token
                db.commit()
        if not any(s.push_token for s in sessions):
            send_sms_fallback(user_id, payload)
    else:
        send_sms_fallback(user_id, payload)

def get_gateway(platform: str) -> PushGateway:
    # MVP: только FCM. Post-MVP: добавить RuStore
    if platform == 'fcm':
        return fcm_gateway
    elif platform == 'rustore':
        return rustore_gateway  # post-MVP
    else:
        return fcm_gateway  # default
```

### 3.2 Trigger Cases (UPDATED v1.6.2 — Патч #3)

| Trigger | Target | Title | Deep Link | Source |
|---------|--------|-------|-----------|--------|
| `order.status_changed` | customer | «Статус заказа обновлён» | `robinfood://order/{id}` | v1.5.1 |
| **`order.ready`** | **customer** | **«Ваш заказ собран и ожидает вас»** | `robinfood://order/{id}` | **v1.6.2** |
| `order.cancelled` (hold expired) | customer | «Заказ отменён» | `robinfood://order/{id}` | v1.5.1 |
| `order.cancelled` (BNPL) | customer | «Заказ отменён (рассрочка)» | `robinfood://order/{id}` | v1.5.1 |
| `picker.new_order` | picker | «Новый заказ» | — | v1.5.1 |
| **`picker.customer_arrived`** | **picker** | **«Покупатель на месте»** | — | **v1.6.2** |
| **`order.completed`** | **customer** | **«Заказ выдан. Спасибо!»** | `robinfood://order/{id}` | **v1.6.2** |
| `smart_alert.fired` | customer | «{product} — цена снизилась!» | `robinfood://product/{id}` | v1.6.0 |
| `chat.message` | counterparty | «Новое сообщение по заказу» | `robinfood://order/{id}?tab=chat` | v1.6.0 |
| `deletion_reminder` | customer | «Аккаунт будет удалён {date}» | — | v1.6.0 |

> **v1.6.2 (Патч #3):** Три новых push trigger для lifecycle `picking -> ready -> customer_arrived -> completed`. Ранее один generic `order.status_changed` покрывал все переходы. Теперь конкретные push с информативным текстом для ключевых этапов выдачи.

### 3.3 Chat Push — Grouping (NEW v1.6.0)

При app in background чат-сообщения группируются:

```python
# Если >=3 messages за 30 сек от одного sender -> grouped push
def should_group_chat_push(order_id, sender_id):
    recent = get_recent_pushes(order_id, sender_id, window=30)
    if len(recent) >= 3:
        return True  # send grouped: "N новых сообщений по заказу"
    return False  # send individual
```

**Grouped push:**
```json
{
  "notification": {
    "title": "Чат по заказу #1234",
    "body": "5 новых сообщений от пикера"
  },
  "data": {
    "type": "chat.message.grouped",
    "orderId": "uuid",
    "messageCount": 5,
    "deepLink": "robinfood://order/uuid?tab=chat"
  }
}
```

### 3.4 Smart Alert Push (NEW v1.6.0, UPDATED v1.6.4)

> **v1.6.4 (Fix #9):** Цены в push-body форматируются согласно Spec v1.4.4, sec 14.3 (Localization Policy): `{price/100}` с запятой-разделителем дробной части, символ `₽`. Пример: `«Было 89,00 ₽, стало 79,00 ₽ (-11%)»`. Backend `format_price()` — единая утилита для всех push-body с ценами.

```json
{
  "notification": {
    "title": "Молоко 3.2% — цена снизилась!",
    "body": "Было 89 руб, стало 79 руб (-11%) в Пятёрочке"
  },
  "data": {
    "type": "smart_alert.fired",
    "alertId": "uuid",
    "productId": "uuid",
    "deepLink": "robinfood://product/uuid"
  }
}
```

**Schedule windows:** push отправляется только в рамках расписания алерта:
- `morning`: 08:00-12:00 MSK
- `evening`: 17:00-21:00 MSK
- `all_day`: 08:00-21:00 MSK

Если trigger сработал вне окна — push откладывается до начала следующего окна.

### 3.5 New Status Push Payloads (NEW v1.6.2, UPDATED v1.6.4)

> **v1.6.4 (Fix #9):** Суммы в push-body (если будут добавлены, например «Итого: N ₽») форматируются через `format_price()` — Spec v1.4.4, sec 14.3. В текущих payload'ах ниже суммы отсутствуют, но правило закреплено для будущих расширений.

```json
// order.ready -> customer
{
  "notification": {
    "title": "Заказ собран!",
    "body": "Ваш заказ готов. Нажмите «Я на месте», когда прибудете."
  },
  "data": {
    "type": "order.ready",
    "orderId": "uuid",
    "deepLink": "robinfood://order/uuid"
  }
}

// customer_arrived -> picker
{
  "notification": {
    "title": "Покупатель на месте",
    "body": "Покупатель прибыл за заказом"
  },
  "data": {
    "type": "picker.customer_arrived",
    "orderId": "uuid"
  }
}

// completed -> customer
{
  "notification": {
    "title": "Заказ выдан. Спасибо!",
    "body": "Заказ завершён. Оцените качество сборки."
  },
  "data": {
    "type": "order.completed",
    "orderId": "uuid",
    "deepLink": "robinfood://order/uuid"
  }
}
```

---

## 4. Geolocation Services (UPDATED v1.6.0)

**Используется:** Яндекс Карты API

### 4.1 Geocoding (Forward)

```
GET https://geocode-maps.yandex.ru/1.x/
Params:
  apikey: 'your_api_key'
  geocode: 'Москва, ул. Ленина, 10'
  format: json

Response:
{
  "response": {
    "GeoObjectCollection": {
      "featureMember": [
        {
          "GeoObject": {
            "Point": {
              "pos": "37.618423 55.751244"  // lon lat
            }
          }
        }
      ]
    }
  }
}
```

**Используется для:**
- Карта магазинов (Buyer App)
- Навигация до магазина (Picker App)
- Расчёт расстояния до магазина

### 4.2 Suggest API — Addresses (NEW v1.6.0)

**Вызывается с клиента** (client-side):

```
GET https://suggest-maps.yandex.ru/v1/suggest
Params:
  apikey: 'your_client_api_key'  // restricted key, client-side
  text: 'Москва Ленина'
  types: 'geo'
  lang: 'ru_RU'
  results: 5
  bbox: '36.80,55.48~37.96,56.01'  // Moscow bounding box
  ull: '37.618423,55.751244'  // user location for ranking

Response:
{
  "results": [
    {
      "title": { "text": "улица Ленина, 10" },
      "subtitle": { "text": "Москва, Россия" },
      "uri": "ymapsbm1://geo?ll=37.618423,55.751244"
    }
  ]
}
```

**Flow:**
```
AddressEditScreen
|-- User types address -> debounce 300ms
|-- Call Yandex Suggest API (client-side)
|-- Show suggestions dropdown
|-- User selects suggestion
|-- Call Yandex Geocoding (forward) -> get lat/lon
|-- Show map preview with pin
+-- Save -> POST /addresses { label, address, lat, lon, isDefault }
```

**API Key management:**
- **Client-side key** (Suggest) — restricted by bundle ID (iOS) / package name (Android) + HTTP Referrer
- **Server-side key** (Geocoding for distance calc) — stored in ENV, unrestricted per IP

**Rate limits (Yandex):**
- Suggest: 1000 requests/day (free tier) -> commercial plan for production
- Geocoding: 1000 requests/day (free tier) -> commercial plan for production

---

## 5. Image Hosting (UPDATED v1.6.1)

> **RESOLVED (Патч #5b):** Выбран **Yandex Object Storage** (ru-central1), S3-compatible. CDN: Yandex CDN -> `cdn.robinfood.ru`. Выбор обусловлен: 500+ ТБ storage vs 15k руб/мес MinIO self-hosted; managed service снижает ops overhead.

**Provider:** Yandex Object Storage (ru-central1, S3-compatible)

**CDN:** Yandex CDN -> `cdn.robinfood.ru`

**Используется для:** `product_image.image_url`, `category.image_url`, user avatars (post-MVP)

### 5.1 Upload (Partner API -> Backend -> S3)

```python
def upload_product_image(product_id: str, image_file: bytes, sort_order: int):
    key = f"products/{product_id}/{uuid4()}.webp"

    # Resize + convert to WebP (server-side)
    optimized = optimize_image(image_file, max_width=1200, quality=80)

    s3_client.put_object(
        Bucket='robinfood-images',
        Key=key,
        Body=optimized,
        ContentType='image/webp',
        CacheControl='public, max-age=31536000'  # 1 year
    )

    # Save to DB
    db.create_product_image(
        product_id=product_id,
        image_url=f"https://cdn.robinfood.ru/{key}",
        sort_order=sort_order
    )
```

### 5.2 CDN Configuration

```
S3 Bucket: robinfood-images
Provider: Yandex Object Storage
Region: ru-central1
Public read: via CDN only
CDN: Yandex CDN -> cdn.robinfood.ru

URL format: https://cdn.robinfood.ru/products/{product_id}/{image_id}.webp

Image variants (generated on upload):
  - original: max 1200px wide, WebP, q80
  - thumb: 300px wide, WebP, q70 (for lists)
  - micro: 100px wide, WebP, q60 (for search results)
```

### 5.3 Constraints

| Parameter | Value |
|-----------|-------|
| Max file size (upload) | 5 MB |
| Allowed formats (input) | JPEG, PNG, WebP |
| Output format | WebP |
| Max images per product | 10 (`product_image.sort_order` 0-9) |
| CDN cache TTL | 1 year (immutable URLs) |
| Soft delete | Remove DB record, keep S3 object 30 days |

---

## 6. Partner API (Settlement Reports)

**Для партнёров:** доступ к settlement-отчётам через Robin Food Partner Portal.

**Endpoint:** `GET /api/v1/partner/settlements/:periodId/report`

**Response:** PDF файл с детализацией заказов.

**Webhook (optional):**
```
POST {partner_webhook_url}
Body:
{
  "event": "settlement.ready",
  "periodId": "uuid",
  "reportUrl": "https://robinfood.ru/reports/uuid.pdf",
  "totalPayout": 1234567.89
}
```

---
## 7. Reporting & Analytics

### 7.1 Google Analytics (GA4)

**Track events:**
```javascript
gtag('event', 'order_created', {
  order_id: 'uuid',
  total_amount: 54580,  // kopecks
  payment_provider: 'tinkoff',  // or 'sbp' (v1.6.2)
  store_count: 2  // multistore (NEW v1.6.0)
});

gtag('event', 'order_completed', {
  order_id: 'uuid',
  picker_id: 'uuid',
  duration_seconds: 1200
});

// NEW v1.6.0
gtag('event', 'smart_alert_created', {
  alert_id: 'uuid',
  trigger_type: 'price_drop',
  entity_type: 'product'
});

gtag('event', 'chat_message_sent', {
  order_id: 'uuid',
  sender_role: 'customer'
});

gtag('event', 'account_deletion_requested', {
  reason: 'privacy'
});
```

### 7.2 Sentry (Error Tracking)

**SDK integration:** iOS/Android/Backend

```swift
// iOS example
SentrySDK.capture(error: error) { scope in
  scope.setContext(value: ["orderId": orderId], key: "order")
  scope.setLevel(.error)
}
```

---

## 8. Background Jobs — External Calls (UPDATED v1.6.2)

### 8.1 Hold Auto-Cancel Job

**Schedule:** CRON every 1 min

**External calls:**
- Tinkoff: `POST /Cancel`
- BNPL: `POST /cancel-payment`
- FCM: push notification -> customer
- WebSocket: broadcast `order.status_changed`

### 8.2 Settlement Pipeline (UPDATED v1.6.4)

> **Патч #6 (v1.6.1):** Settlement Job и Auto-Approve объединены в один **sequential pipeline**. Это исключает race condition, при котором auto-approve мог обработать period до завершения расчёта Step 1. Подробности pipeline — Spec v1.4.4 sec 11, Settlement v1.2.2 sec 5 + sec 9.

**Schedule:** Daily at 03:00 MSK — **Sequential Pipeline**

```python
def settlement_pipeline():
    t0 = time.time()

    # Step 1: Settlement Job -- create periods, calc lines, PDF, email
    run_settlement_job()
    t1 = time.time()

    # Step 2: Auto-Approve -- approve expired review periods (no disputed lines)
    auto_approve_periods()
    t2 = time.time()

    # Step 3: Health Check -- log timing, alert if slow
    settlement_pipeline_health_check(
        step1_time=t1 - t0,
        step2_time=t2 - t1,
        periods_processed=count_processed_periods()
    )
```

**External calls (per step):**

| Step | External calls |
|------|---------------|
| Step 1: Settlement Job | Generate PDF (internal), Store PDF -> S3 / CDN, Send email (SMTP), Optional webhook -> partner |
| Step 2: Auto-Approve | Send email (SMTP) — approved notification, Send alert -> ops (unresolved disputes) |
| Step 3: Health Check | Send alert -> ops (if total_time > 5 min) |

### 8.3 Account Deletion Job (NEW v1.6.0)

**Schedule:** Daily at 04:00 MSK

**External calls:**
- None (internal DB operations only)
- Revoke all `refresh_token` records for user
- Clear `cart` + `cart_item`
- Anonymize `app_user` (phone -> `deleted_{uuid}`, full_name -> NULL)

**Pre-execution notification (7 days before):**
- FCM: push `deletion_reminder` -> customer
- SMS fallback (if no push_token)

### 8.4 Smart Alerts Engine (NEW v1.6.0)

**Schedule:** CRON every 30 min

**External calls:**
- FCM: push `smart_alert.fired` -> customer (within schedule window)
- SMS fallback (if no push_token, critical alerts only)

**Logic:**
```python
def run_smart_alerts_engine():
    current_hour = now().hour  # MSK

    for alert in get_active_alerts():
        # Check schedule window
        if not is_in_schedule(alert.schedule, current_hour):
            continue

        # Check debounce (24h)
        if alert.last_fired_at and (now() - alert.last_fired_at) < timedelta(hours=24):
            continue

        # Check trigger
        triggered = check_trigger(alert)
        if not triggered:
            continue

        # Send push
        send_push(alert.user_id, build_alert_payload(alert))

        # Log
        create_alert_log(alert.id, payload)
        alert.last_fired_at = now()
        db.save(alert)
```

### 8.5 OTP/Token Cleanup (UPDATED v1.6.1)

> **Патч #4 (v1.6.1):** TTL-правила расширены — добавлены cleanup для verified OTP (7 дней) и expired refresh tokens. SQL-запросы выровнены с API Contract v1.4.4 Appendix C.

**Schedule:** CRON every 1 hour

**External calls:** None (internal DB cleanup)

**Logic (UPDATED v1.6.1):**
```sql
-- 1. OTP expired (non-verified), older than 24h
DELETE FROM otp_session
WHERE expires_at < NOW() - INTERVAL '24 hours'
  AND status != 'verified';

-- 2. OTP verified, older than 7 days (NEW v1.6.1, Патч #4)
DELETE FROM otp_session
WHERE status = 'verified'
  AND verified_at < NOW() - INTERVAL '7 days';

-- 3. Revoked refresh tokens, older than 7 days
DELETE FROM refresh_token
WHERE revoked_at IS NOT NULL
  AND revoked_at < NOW() - INTERVAL '7 days';

-- 4. Expired refresh tokens (NEW v1.6.1, Патч #4)
DELETE FROM refresh_token
WHERE expires_at < NOW();
```

> **v1.6.0 -> v1.6.1:** Правила #1 и #3 были в v1.6.0. Правила #2 (verified OTP 7d) и #4 (expired refresh) добавлены Патчем #4 для полного coverage всех устаревших записей.

### 8.6 Unified CRON Monitoring & Alerting — NEW v1.6.3 (Патч #6)

> Единый подход к мониторингу всех CRON-задач: health wrapper, метрики, threshold'ы и Dead Man's Switch. Расширяет существующий domain-specific health check Settlement Pipeline (sec 8.2).

#### 8.6.1 Health Wrapper Protocol

```python
def cron_health_wrapper(job_name: str, job_fn):
    t0 = time.time()
    try:
        result = job_fn()  # ожидается CronResult(processed_count=int)
        duration = time.time() - t0

        cron_duration_seconds.labels(job=job_name).observe(duration)
        cron_last_success_timestamp.labels(job=job_name).set(time.time())
        cron_items_processed.labels(job=job_name).set(getattr(result, 'processed_count', 0))

        if duration > CRON_THRESHOLDS[job_name]['warn']:
            send_ops_alert(
                severity='warning',
                message=f"Job {job_name} slow: {duration:.0f}s (> {CRON_THRESHOLDS[job_name]['warn']}s)",
            )
    except Exception as e:
        cron_errors_total.labels(job=job_name).inc()
        send_ops_alert(
            severity='critical',
            message=f"Job {job_name} failed: {e}",
        )
        sentry_sdk.capture_exception(e)
        raise
    finally:
        send_heartbeat(job_name)
```

#### 8.6.2 Thresholds

```python
CRON_THRESHOLDS = {
  'hold_auto_cancel':    { 'warn': 30,  'crit': 55,   'stale': 3 * 60 },
  'settlement_pipeline': { 'warn': 300, 'crit': 900,  'stale': 25 * 3600 },
  'account_deletion':    { 'warn': 120, 'crit': 600,  'stale': 25 * 3600 },
  'smart_alerts':        { 'warn': 60,  'crit': 120,  'stale': 35 * 60 },
  'otp_cleanup':         { 'warn': 30,  'crit': 60,   'stale': 65 * 60 },
}
```

#### 8.6.3 Alert Channels

- Sentry — исключения (critical).
- Ops Telegram/Slack — warning + critical (slow jobs, failures, stale).
- Prometheus + Grafana — dashboard по cron_* метрикам + alert rules.

#### 8.6.4 Dead Man's Switch

```python
def send_heartbeat(job_name: str):
    requests.post(
        f"https://monitoring.robinfood.ru/heartbeat/{job_name}",
        timeout=5
    )
```

Heartbeat не пришёл в течение `stale`-порога → Stale Alert для ops.

**Применение:**

```python
cron_health_wrapper('hold_auto_cancel', run_hold_auto_cancel_job)
cron_health_wrapper('settlement_pipeline', settlement_pipeline)
cron_health_wrapper('account_deletion', run_account_deletion_job)
cron_health_wrapper('smart_alerts', run_smart_alerts_engine)
cron_health_wrapper('otp_cleanup', run_otp_cleanup_job)
```

---

## 9. Error Handling

**Все провайдеры:** retry logic с exponential backoff.

```python
@retry(stop_max_attempt_number=3, wait_exponential_multiplier=1000)
def call_provider_api(endpoint, payload):
    response = requests.post(endpoint, json=payload, timeout=10)
    response.raise_for_status()
    return response.json()
```

**Critical failures:**

| Provider | Failure | Action |
|----------|---------|--------|
| Tinkoff | Unavailable | Alert «Оплата временно недоступна» |
| BNPL | Unavailable | Fallback to Tinkoff / disable BNPL options |
| SMSC.ru | Unavailable | Retry x2, then `503 SMS_DELIVERY_FAILED` |
| SMSC.ru | Delivery failed | Queue for later delivery (max 3 attempts over 5 min) |
| FCM | Unavailable | Fallback to SMS (if push_token missing or FCM down) |
| FCM | Invalid token | Mark `refresh_token.push_token = null`, fallback SMS **(UPDATED v1.6.2)** |
| Yandex Suggest | Unavailable | Client shows «Введите адрес вручную» |
| Yandex Geocoding | Unavailable | Use cached coordinates if available |
| Yandex Object Storage | Upload failed | Retry x3, then reject with `503 IMAGE_UPLOAD_FAILED` |

> **v1.6.2 (Патч #2):** FCM invalid token — обновлено `device.push_token = null` -> `refresh_token.push_token = null`. Push-токен хранится в `refresh_token` (Data Model v1.4.10, Table 10).

---

## 10. Security

**API Keys:**
- Stored in environment variables (never in code/git)
- Rotated every 6 months (production)
- Client-side keys (Yandex Suggest) — restricted by platform (bundle ID / package name)

**Signatures:**
- Tinkoff: HMAC SHA-256 signature per request
- BNPL: Bearer token authentication
- FCM: Service Account JSON key
- SMSC.ru: login + password (HTTPS only)

**JWT (NEW v1.6.0):**
- Algorithm: RS256 (asymmetric)
- Public key: distributed to all services for verification
- Private key: stored in secrets manager, accessible only by Auth service
- Key rotation: planned post-MVP

**HTTPS only:**
- All external API calls use TLS 1.2+
- Certificate pinning for critical providers (Tinkoff, BNPL)

---

## 11. Open Questions (UPDATED v1.6.1 — all resolved)

| # | Question | Decision (Патч #5) | Impact | Status |
|---|----------|---------------------|--------|--------|
| 1 | Push provider | **FCM primary (MVP)**, RuStore Push post-MVP. ~85% GMS coverage, SMS fallback. `PushGateway` Protocol added (sec 3.1) | Sec 3 | **Resolved** |
| 2 | Image hosting | **Yandex Object Storage** (ru-central1), S3-compatible. CDN: Yandex CDN -> `cdn.robinfood.ru` | Sec 5 | **Resolved** |
| 3 | Admin Panel | **React Admin** (lightweight web-UI) at `admin.robinfood.ru`. Auth: JWT RS256, role=admin. MVP: invite picker/partner via CLI script `./scripts/invite-user.sh` | Не влияет на IC | **Resolved** |

---

## 12. Document Version Matrix (UPDATED v1.6.5)

| Document | Version | Min Compatible |
|----------|---------|----------------|
| Integration Contracts | **v1.6.5** | v1.6.4 |
| Spec | **v1.4.5** | v1.4.3 |
| API Contract | **v1.4.4** | v1.4.3 |
| Data Model | **v1.4.11** | v1.4.10 |
| Navigation | **v1.4.4** | v1.4.3 |
| BNPL Integration | **v1.2.2** | v1.2.2 |
| Settlement | **v1.2.2** | v1.2.1 |

> Cross-references обновлены для соответствия актуальным версиям зависимых документов.
> **v1.6.5:** Spec → v1.4.5 (API Versioning Policy, IP whitelist NFR), Data Model → v1.4.11 (payout_ref column). Новая секция 1.4 Settlement Payout Provider.

---

Integration Contracts v1.6.5 (Consolidated) — 16.02.2026 — Robin Food Integration Team
