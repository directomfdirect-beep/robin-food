# Robin Food — BNPL Integration v1.2.3 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.2.3 | 16.02.2026 | Consolidated | Robin Food Payment Team |

**Scope v1.2.3:** Полная спецификация интеграции с BNPL-провайдерами (Яндекс Сплит, Долями). Патч v1.2.2 — capture при `picking → ready` (вместо `picking → completed`), cancel path при BR-BNPL-6 до перехода в `ready`, schedule sync при capture. **Патч v1.2.3:** Version Matrix синхронизирована (Nav v1.4.4, IC v1.6.4, Settlement v1.2.2), inline cross-refs обновлены.

**Зависимости:** Spec v1.4.4, API Contract v1.4.4, Integration Contracts v1.6.4, Data Model v1.4.10, Settlement v1.2.2, Navigation v1.4.4

**Источник изменений:** Snapshot решений v1.0 (15.02.2026), Patch Snapshot v1.1 (15.02.2026), Patch Snapshot v1.2 (15.02.2026) — cross-refs only, Patch Bundle v1.0 (16.02.2026) — Fix #2 title, cross-refs, Snapshot решений (16.02.2026) — VM sync

---

## Changelog v1.2.2 → v1.2.3

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Sec 12: Version Matrix — Navigation **v1.4.3→v1.4.4**, Integration Contracts **v1.6.3→v1.6.4**, Settlement **v1.2.1→v1.2.2**, BNPL self **v1.2.2→v1.2.3** | §1.6 Version Matrix | METADATA |
| 2 | Dependencies header — IC v1.6.3→**v1.6.4**, Settlement v1.2.1→**v1.2.2**, Navigation v1.4.4→**v1.4.4** | §1.6 Cross-ref sync | METADATA |
| 3 | Sec 4.3, 5.1: inline cross-ref Navigation v1.4.4→**v1.4.4** | §1.6 Inline refs | METADATA |

---

## Changelog v1.2.2 (Patch Bundle v1.0 — metadata fix)

> **Без version bump.** Только исправление заголовка и каскадное обновление cross-references.

| # | Изменение | Patch Bundle v1.0 | Тип |
|---|-----------|-------------------|-----|
| 1 | Document title: `v1.2.3` → `v1.2.2` — устранение расхождения title vs scope/matrix | Fix #2 | FIX METADATA |
| 2 | Зависимости: Spec v1.4.3 → v1.4.4, API Contract v1.4.3 → v1.4.4, Data Model v1.4.9 → v1.4.10 | Fix #1, #3, #9 cascade | METADATA |
| 3 | Sec 2.2: inline ref Spec v1.4.3 → v1.4.4 | Fix #9 cascade | METADATA |
| 4 | Sec 12: Version Matrix обновлена (Spec, API Contract, Data Model) | Cascade | METADATA |
| 5 | Источник изменений: добавлен Patch Bundle v1.0 | — | METADATA |

---

## Changelog v1.2.1 → v1.2.2

| # | Изменение | Патч Snapshot v1.1 | Тип |
|---|-----------|-------------------|-----|
| 1 | Sec 2.2: Capture trigger — `PUT /picker/orders/:id/complete` теперь переводит в `ready` (было `completed`). Capture при `picking → ready` | Патч #3 | ALTER LIFECYCLE |
| 2 | Sec 4.1: BR-BNPL-6 — success path: `status = 'ready'` (было `completed`). Cancel path без изменений | Патч #3 | ALTER LIFECYCLE |
| 3 | Sec 6: Schedule Sync — trigger при capture (`picking → ready`), не при `completed` | Патч #3 | ALTER TRIGGER |
| 4 | Sec 5.1: BNPL Warning — ссылка на Navigation v1.4.4 | Патч #3 | META |
| 5 | Sec 12: Version Matrix обновлена | Патч v1.1 meta | METADATA |

---

## Changelog v1.2 → v1.2.1

| # | Изменение | Snapshot § | Тип |
|---|-----------|-----------|-----|
| 1 | `order` → `customer_order` во всех ссылках, FK, коде | §1.2 | RENAME |
| 2 | `user` → `app_user` во всех ссылках | §1.2 | RENAME |
| 3 | `customer_order.bnpl_status` удалён — BNPL-статусы через `payment_transaction.type` | §1.3 | BREAKING |
| 4 | Authorize trigger: `POST /orders` → `POST /cart/checkout` (multistore) | §5.3 | UPDATED |
| 5 | minAmount проверяется **per sub-order** при multistore checkout | §5.3 | UPDATED |
| 6 | Ссылки на Navigation v1.3.1 → v1.4.2 | §12 | META |
| 7 | Document Version Matrix обновлена | §12 | META |

---

## 1. Поддерживаемые провайдеры

### 1.1 Яндекс Сплит

**ID:** `yandex_split`

**Параметры:**
```json
{
  "name": "Яндекс Сплит",
  "minAmount": 50000,
  "maxAmount": 100000000,
  "installments": [3, 6],
  "feePercent": 5.5,
  "apiUrl": "https://split.yandex.ru/api/v1",
  "apiKey": "ENV_VAR:YANDEX_SPLIT_API_KEY"
}
```

| Поле | Значение | Описание |
|------|----------|----------|
| `minAmount` | 50000 копеек | Минимум 500₽ |
| `maxAmount` | 100M копеек | Максимум 1M руб |
| `installments` | [3, 6] | Доступные периоды рассрочки (месяцев) |
| `feePercent` | 5.5% | Комиссия провайдера (расход Robin Food, не влияет на payout партнёру) |

### 1.2 Долями

**ID:** `dolyame`

**Параметры:**
```json
{
  "name": "Долями",
  "minAmount": 50000,
  "maxAmount": 200000000,
  "installments": [4],
  "feePercent": 6.0,
  "apiUrl": "https://partner.dolyame.ru/v1",
  "apiKey": "ENV_VAR:DOLYAME_API_KEY"
}
```

| Поле | Значение | Описание |
|------|----------|----------|
| `minAmount` | 50000 копеек | Минимум 500₽ |
| `maxAmount` | 200M копеек | Максимум 2M руб |
| `installments` | [4] | Только 4-месячная рассрочка |
| `feePercent` | 6.0% | Комиссия провайдера |

---

## 2. Payment Lifecycle

### 2.1 Authorize (Hold)

**Trigger (UPDATED v1.2.1):** `POST /cart/checkout` — создаёт N `customer_order` (по одному на магазин). Для каждого sub-order с `payment_provider` in `{yandex_split, dolyame}` вызывается authorize отдельно.

> **v1.2 → v1.2.1:** Было `POST /orders` (single order). Теперь `POST /cart/checkout` (multistore). Authorize вызывается **per sub-order**.

```
POST {provider.apiUrl}/authorize
Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json

Body:
{
  "merchantOrderId": "uuid",           // customer_order.id
  "amount": 54580,                      // kopecks, original_total_amount
  "customerId": "uuid",                 // app_user.id
  "installments": 4,
  "returnUrl": "robinfood://payment/callback"
}

Response 200:
{
  "paymentId": "ext-12345",
  "paymentUrl": "https://dolyame.ru/auth/ext-12345",
  "status": "PENDING"
}
```

**Robin Food действия:**
1. Сохранить `customer_order.bnpl_external_id = paymentId`
2. Записать `payment_transaction { type: 'bnpl_authorize', provider_ref: paymentId, status: 'success' }` **(NEW v1.2.1)**
3. Redirect покупателя в `paymentUrl` (PaymentWebView)
4. После callback установить `customer_order.status = 'confirmed'`

**Multistore checkout flow (NEW v1.2.1):**
```python
def checkout(cart, payment_method):
    # Группировка cart_items по store_id -> N sub-orders
    sub_orders = group_by_store(cart.items)

    for sub_order_items in sub_orders:
        order = create_customer_order(sub_order_items)

        if payment_method in ('yandex_split', 'dolyame'):
            provider = BNPL_PROVIDERS[payment_method]

            # minAmount check PER sub-order (NEW v1.2.1)
            if order.total_amount < provider['minAmount']:
                raise HTTP_422({
                    'code': 'BNPL_BELOW_MIN',
                    'subOrderId': order.id,
                    'storeId': order.store_id,
                    'currentTotal': order.total_amount,
                    'minAmount': provider['minAmount'],
                    'provider': payment_method
                })

            # Authorize per sub-order
            auth_response = call_bnpl_authorize(provider, order)
            order.bnpl_external_id = auth_response['paymentId']

            # Track via payment_transaction (replaces bnpl_status)
            create_payment_transaction(
                order_id=order.id,
                type='bnpl_authorize',
                provider=payment_method,
                provider_ref=auth_response['paymentId'],
                amount=order.total_amount,
                status='success'
            )

        order.original_total_amount = order.total_amount
        db.commit()
```

### 2.2 Capture (Confirm) — UPDATED v1.2.2

**Trigger (UPDATED v1.2.2 — Патч #3):** `PUT /picker/orders/:id/complete` — capture payment при переходе `picking → ready`.

> **v1.2.1 → v1.2.2:** Capture теперь происходит при `picking → ready` (ранее при `picking → completed`). Это гарантирует списание **до** выдачи заказа покупателю. Статус заказа после capture = `ready`, не `completed`.

```
POST {provider.apiUrl}/commit
Headers:
  Authorization: Bearer {apiKey}

Body:
{
  "paymentId": "ext-12345",
  "amount": 46580  // finalAmount (может быть != original_total_amount)
}

Response 200:
{
  "paymentId": "ext-12345",
  "status": "CONFIRMED",
  "capturedAmount": 46580
}
```

**Robin Food действия (UPDATED v1.2.2):**
1. Capture через provider API
2. Записать `payment_transaction { type: 'bnpl_commit', status: 'success' }`
3. `customer_order.status = 'ready'`, `customer_order.ready_at = NOW()` *(v1.2.2: было `completed`)*
4. Если `finalAmount != original_total_amount` → см. section 6 (schedule sync) — выполняется **сразу при capture**
5. Push покупателю: «Ваш заказ собран и ожидает вас»

> **v1.2.1:** `bnpl_status` больше не обновляется — статус BNPL-операции определяется по последней записи в `payment_transaction` с соответствующим `type`.

**Дальнейший lifecycle после capture (v1.2.2):**
```
ready → customer_arrived → completed   (BNPL уже captured, нет дополнительных вызовов)
ready → completed                      (picker skip arrived — BNPL уже captured)
```

> После capture BNPL-интеграция **не участвует** в переходах `ready → customer_arrived → completed`. Эти переходы управляются Spec v1.4.4, sec 3.2.

### 2.3 Cancel

**Trigger:**
- Hold timeout (15 min) — CRON job
- User cancellation (до picking) — `POST /orders/:id/cancel`
- BNPL cancel after picking (`finalAmount < provider.minAmount`) — BR-BNPL-6

> **v1.2.2 (Патч #3):** Cancel **невозможен** в статусах `ready` и `customer_arrived` — capture уже произведён. Cancel path BR-BNPL-6 выполняется **до** перехода в `ready`.

```
POST {provider.apiUrl}/cancel
Headers:
  Authorization: Bearer {apiKey}

Body:
{
  "paymentId": "ext-12345",
  "reason": "HOLD_EXPIRED | USER_CANCELLED | AMOUNT_BELOW_MIN"
}

Response 200:
{
  "paymentId": "ext-12345",
  "status": "CANCELLED"
}
```

**Robin Food действия (UPDATED v1.2.1):**
1. Cancel через provider API
2. Записать `payment_transaction { type: 'bnpl_cancel', status: 'success' }`
3. `customer_order.status = 'cancelled'`, `customer_order.payment_status = 'refunded'`

---

## 3. BNPL Status Tracking (NEW v1.2.1)

### 3.1 Миграция с `bnpl_status` на `payment_transaction`

> **BREAKING (Snapshot §1.3):** Колонка `customer_order.bnpl_status` удалена. BNPL-статус определяется по `payment_transaction.type`.

**Было (v1.2):**
```sql
customer_order.bnpl_status = 'authorized' | 'committed' | 'cancelled'
```

**Стало (v1.2.1):**
```sql
-- BNPL-статус = последний payment_transaction.type для данного order
SELECT type, status
FROM payment_transaction
WHERE order_id = :order_id
  AND type IN ('bnpl_authorize', 'bnpl_commit', 'bnpl_cancel')
ORDER BY created_at DESC
LIMIT 1;
```

### 3.2 Маппинг

| Было (`bnpl_status`) | Стало (`payment_transaction.type`) | Описание |
|----------------------|-------------------------------------|----------|
| `authorized` | Последний `type = 'bnpl_authorize'`, `status = 'success'` | Hold через BNPL-провайдера |
| `committed` | Последний `type = 'bnpl_commit'`, `status = 'success'` | Capture подтвержден *(v1.2.2: при `picking → ready`)* |
| `cancelled` | Последний `type = 'bnpl_cancel'`, `status = 'success'` | Отмена/возврат |
| _(no status)_ | Нет записей с `type IN ('bnpl_authorize', ...)` | Заказ не через BNPL |

### 3.3 Helper function

```python
def get_bnpl_status(order_id: str):
    tx = db.query(PaymentTransaction).filter(
        PaymentTransaction.order_id == order_id,
        PaymentTransaction.type.in_([
            'bnpl_authorize', 'bnpl_commit', 'bnpl_cancel'
        ])
    ).order_by(PaymentTransaction.created_at.desc()).first()

    if tx is None:
        return None  # not a BNPL order

    mapping = {
        'bnpl_authorize': 'authorized',
        'bnpl_commit': 'committed',
        'bnpl_cancel': 'cancelled'
    }
    return mapping.get(tx.type)
```

**Поле `customer_order.bnpl_external_id`** остаётся — это ID платежа у провайдера, необходим для всех API-вызовов (commit, cancel, sync).

---
## 4. BR-BNPL-6: Cancel After Picking (UPDATED v1.2.2)

**Бизнес-правило:** Если после picking финальная сумма BNPL-заказа < `provider.minAmount`, заказ отменяется.

> **v1.2.2 (Патч #3):** BR-BNPL-6 check выполняется внутри `PUT /picker/orders/:id/complete` **до** capture и перехода в `ready`. Если check проходит → capture + `ready`. Если fail → cancel + `cancelled`. Заказ **никогда не попадает** в `ready` с суммой ниже minAmount.

### 4.1 Trigger Point (UPDATED v1.2.2)

```python
# PUT /picker/orders/:id/complete — UPDATED v1.2.2
def complete_order(order_id):
    order = db.get(CustomerOrder, order_id)  # RENAMED v1.2.1

    if order.payment_provider not in ('yandex_split', 'dolyame'):
        # Non-BNPL: capture + status = 'ready'  (v1.2.2)
        return proceed_with_capture()

    provider = BNPL_PROVIDERS[order.payment_provider]
    final_amount = calc_order_gmv(order)

    if final_amount < provider['minAmount']:
        # BR-BNPL-6: cancel path — status stays 'cancelled', NOT 'ready'
        cancel_bnpl_order(order, provider)
        return HTTP_200({
            'status': 'cancelled',
            'reason': 'BNPL_BELOW_MIN',
            'finalAmount': final_amount,
            'minAmount': provider['minAmount'],
            'provider': order.payment_provider,
            'items': format_items_for_picker(order)
        })

    # Success path: capture + status = 'ready' (v1.2.2: was 'completed')
    capture_bnpl_payment(order, provider, final_amount)
    order.status = 'ready'              # v1.2.2: was 'completed'
    order.ready_at = datetime.utcnow()  # v1.2.2: NEW field
    db.commit()

    # Schedule sync if amount changed
    if final_amount != order.original_total_amount:
        sync_bnpl_schedule(order)        # v1.2.2: immediately at capture

    # Push + WS
    send_push(order.customer_id, {
        'title': 'Заказ собран',
        'body': 'Ваш заказ собран и ожидает вас',
        'data': {'orderId': order.id, 'deepLink': f"robinfood://order/{order.id}"}
    })
    ws_broadcast_order_status(order, 'ready')

    return HTTP_200({
        'status': 'ready',
        'finalAmount': final_amount,
        'readyAt': order.ready_at.isoformat()
    })
```

> **v1.2.2 flow summary:**
> ```
> PUT /picker/orders/:id/complete
> +-- BR-BNPL-6 check: finalAmount < minAmount?
> |   +-- YES -> cancel BNPL -> status = 'cancelled' (items list for picker)
> |   +-- NO  -> capture BNPL -> status = 'ready' -> schedule sync if needed
> +-- Non-BNPL -> capture Tinkoff/SBP -> status = 'ready'
> ```

### 4.2 BNPL Provider Call

```python
def cancel_bnpl_order(order, provider):
    # 1. Call provider API
    response = requests.post(
        f"{provider['apiUrl']}/cancel",
        headers={'Authorization': f"Bearer {provider['apiKey']}"},
        json={
            'paymentId': order.bnpl_external_id,
            'reason': 'AMOUNT_BELOW_MIN'
        },
        timeout=10
    )

    if not response.ok:
        log_error(f"BNPL cancel failed: {response.text}")
        raise HTTP_500("Payment cancellation failed")

    # 2. Record payment_transaction (UPDATED v1.2.1)
    create_payment_transaction(
        order_id=order.id,
        type='bnpl_cancel',
        provider=order.payment_provider,
        provider_ref=order.bnpl_external_id,
        amount=calc_order_gmv(order),
        status='success'
    )

    # 3. Update order status
    order.status = 'cancelled'
    order.payment_status = 'refunded'
    order.cancelled_at = datetime.utcnow()
    db.commit()

    # 4. WebSocket events
    ws_broadcast_to_picker(order.picker_id, {
        'event': 'order.cancelled',
        'timestamp': datetime.utcnow().isoformat(),
        'idempotencyKey': generate_uuid(),
        'payload': {
            'orderId': order.id,
            'reason': 'BNPL_BELOW_MIN',
            'finalAmount': calc_order_gmv(order),
            'minAmount': provider['minAmount'],
            'provider': order.payment_provider,
            'items': format_items_for_picker(order)
        }
    })

    ws_broadcast_to_customer(order.customer_id, {
        'event': 'order.cancelled',
        'timestamp': datetime.utcnow().isoformat(),
        'idempotencyKey': generate_uuid(),
        'payload': {
            'orderId': order.id,
            'reason': 'BNPL_BELOW_MIN',
            'finalAmount': calc_order_gmv(order),
            'minAmount': provider['minAmount'],
            'provider': order.payment_provider
            # NO items[] for customer
        }
    })

    # 5. Push notification
    send_push(order.customer_id, {
        'title': 'Заказ отменен',
        'body': f"Сумма ниже минимума для рассрочки ({provider['minAmount']//100} руб)",
        'data': {
            'orderId': order.id,
            'deepLink': f"robinfood://order/{order.id}"
        }
    })
```

### 4.3 Items Formatting (Picker)

```python
def format_items_for_picker(order):
    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id,
        OrderItem.status.in_(['active', 'replaced'])
    ).all()

    return [
        {
            'name': get_product_name(item.product_id),
            'quantity': item.actual_quantity or item.requested_quantity,
            'unit': 'kg' if item.quantity_unit == 'kg' else 'pcs'
        }
        for item in items
    ]
```

**Результат:** список товаров для возврата на полку (см. Navigation v1.4.4, sec 3.8).

---

## 5. BNPL Warning During Picking

**Бизнес-требование:** Пикер должен видеть предупреждение, что сумма ниже minAmount, **до** завершения заказа.

### 5.1 PUT /picker/orders/:id/item/:itemId/weigh Response

```python
def weigh_item(order_id, item_id, actual_quantity):
    order = db.get(CustomerOrder, order_id)  # RENAMED v1.2.1
    # ... update item, recalc order.total_amount ...

    if order.payment_provider in ('yandex_split', 'dolyame'):
        provider = BNPL_PROVIDERS[order.payment_provider]

        if order.total_amount < provider['minAmount']:
            warning = {
                'code': 'BNPL_BELOW_MIN',
                'currentTotal': order.total_amount,
                'minAmount': provider['minAmount'],
                'provider': order.payment_provider
            }
        else:
            warning = None
    else:
        warning = None

    return HTTP_200({
        'itemId': item_id,
        'actualQuantity': actual_quantity,
        'newPrice': item.final_price,
        'orderTotal': order.total_amount,
        'warning': warning
    })
```

**Picker App behavior:** если `warning != null`, показать жёлтый banner (см. Navigation v1.4.4, sec 3.8).

---

## 6. Schedule Sync (UPDATED v1.2.2)

**Когда (UPDATED v1.2.2 — Патч #3):** `finalAmount != originalTotalAmount` — проверяется **при capture** (переход `picking -> ready`), а не при `completed`.

> **v1.2.1 -> v1.2.2:** Schedule sync вызывается сразу после capture в `complete_order()` (sec 4.1). Это обеспечивает обновление графика рассрочки до выдачи заказа покупателю.

### 6.1 Detection (UPDATED v1.2.2)

```python
# Called inside complete_order() after capture (v1.2.2)
def on_order_captured(order):
    if order.payment_provider not in ('yandex_split', 'dolyame'):
        return

    if order.total_amount != order.original_total_amount:
        sync_bnpl_schedule(order)
```

### 6.2 Sync Request

```
POST {provider.apiUrl}/update-schedule
Headers:
  Authorization: Bearer {apiKey}

Body:
{
  "paymentId": "ext-12345",
  "newAmount": 46580,
  "originalAmount": 54580
}

Response 200:
{
  "paymentId": "ext-12345",
  "status": "SCHEDULE_UPDATED",
  "installmentPlan": [
    { "dueDate": "2026-03-15", "amount": 11645 },
    { "dueDate": "2026-04-15", "amount": 11645 },
    { "dueDate": "2026-05-15", "amount": 11645 },
    { "dueDate": "2026-06-15", "amount": 11645 }
  ]
}
```

**Robin Food не хранит installmentPlan** — пользователь видит его в приложении провайдера.

---

## 7. Fee Handling

**BNPL fee — расход Robin Food:**
```
provider_fee = final_amount * provider.feePercent / 100
```

Пример (Долями, 6%):
```
final_amount = 46580 копеек
provider_fee = 46580 * 0.06 = 2795 копеек
```

**Settlement:**
- Partner GMV = `final_amount` (46580)
- Partner payout = `gmv * (1 - commission_pct)` — **НЕ** вычитаем BNPL fee
- BNPL fee списывается с баланса Robin Food отдельно

**Пример:** Partner tariff = 15%
```
GMV: 465.80 руб
Commission: 465.80 * 0.15 = 69.87 руб
Payout: 465.80 - 69.87 = 395.93 руб

BNPL fee (Robin Food expense): 27.95 руб
```

BNPL fee **не влияет** на payout партнёру.

**Multistore note (v1.2.1):** При multistore checkout BNPL fee считается **per sub-order**, т.к. каждый `customer_order` — независимая BNPL-транзакция. Settlement line создаётся per `customer_order`.

---

## 8. Error Handling

### 8.1 Provider Unavailable

**Scenario:** BNPL API недоступен при authorize/commit/cancel.

```python
@retry(stop_max_attempt_number=3, wait_exponential_multiplier=1000)
def call_bnpl_api(endpoint, payload):
    try:
        response = requests.post(endpoint, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        log_error(f"BNPL API call failed: {e}")
        raise
```

**Fallback:**

| Операция | Failure action |
|----------|----------------|
| Authorize | Alert «Рассрочка недоступна», предложить Tinkoff / СБП *(v1.2.2: +СБП)* |
| Commit | 3 retry failed -> alert менеджеру, manual resolution. Заказ остаётся в `picking` *(v1.2.2: не переходит в `ready`)* |
| Cancel | Order остаётся в `picking`, manual intervention |

**Multistore rollback (NEW v1.2.1):** Если authorize fails для одного из sub-orders при checkout, **весь checkout откатывается** — cancel уже авторизованных sub-orders, вернуть items в корзину.

### 8.2 Schedule Sync Failure

**Scenario:** Провайдер не может пересчитать schedule при `finalAmount != originalTotalAmount`.

```python
try:
    provider.sync_schedule(payment_id, new_amount)
except ProviderAPIError:
    log_error(f"Schedule sync failed for {order.id}")
    send_alert_to_ops_team(order.id, "BNPL schedule sync failed")
    # Order already in 'ready' (capture done), but schedule not updated
    # Requires manual resolution
```

> **v1.2.2:** Schedule sync failure **не блокирует** переход в `ready`. Capture уже выполнен, заказ доступен для выдачи. Ops-команда разрешает вручную.

---

## 9. Testing & Sandbox

### 9.1 Яндекс Сплит Sandbox

**URL:** `https://split-test.yandex.ru/api/v1`
**Test API Key:** предоставляется Яндексом
**Test cards:**
```
Успешная авторизация: 4111 1111 1111 1111
Отклонение: 4000 0000 0000 0002
```

### 9.2 Долями Sandbox

**URL:** `https://partner-test.dolyame.ru/v1`
**Test API Key:** предоставляется Долями
**Test flow:** все суммы автоматически approved

### 9.3 Multistore Test Scenarios (NEW v1.2.1, UPDATED v1.2.2)

| Scenario | Cart | Expected |
|----------|------|----------|
| 2 stores, both >= minAmount | Store A: 600 руб, Store B: 800 руб | 2x authorize OK |
| 2 stores, one < minAmount | Store A: 300 руб, Store B: 800 руб | Checkout rejected: `BNPL_BELOW_MIN` for store A |
| 2 stores, one fails authorize | Store A: OK, Store B: provider error | Full rollback — cancel store A authorize |
| 1 store, picking drops below min | Store A: 600 руб -> weigh -> 450 руб | Warning on weigh, cancel on complete (BR-BNPL-6). Status = `cancelled`, NOT `ready` *(v1.2.2)* |
| 1 store, picking OK | Store A: 600 руб -> weigh -> 580 руб | Capture on complete -> status = `ready` -> schedule sync *(v1.2.2)* |
| 1 store, ready -> completed | Status = `ready` (BNPL captured) | No BNPL calls on `confirm-pickup` — pure status transition *(NEW v1.2.2)* |

---

## 10. Monitoring & Alerts

**Метрики:**
- BNPL authorize success rate (>95%)
- BNPL commit success rate (>98%)
- Schedule sync success rate (>99%)
- Average authorize latency (<2s)
- **Multistore checkout rollback rate** (<2%) **(NEW v1.2.1)**

**Alerts:**
- BNPL API unavailable (>5 failures in 5 min)
- Schedule sync failed (immediate alert)
- Unusually high cancel rate (>10% in 1 hour)
- **Multistore rollback spike** (>5 rollbacks in 10 min) **(NEW v1.2.1)**

---

## 11. Security

**API Keys:**
- Stored in environment variables / secrets manager
- Rotated every 6 months
- Never logged or exposed to client

**Request Signing:**
- HMAC SHA-256 для Яндекс Сплит
- JWT для Долями
- Timestamps для replay attack protection

**Certificate Pinning:**
- Enforce в production для BNPL API calls
- Prevent MITM attacks

---

## 12. Document Version Matrix (UPDATED v1.2.3 — Snapshot решений 16.02.2026)

| Document | Version | Min Compatible |
|----------|---------|----------------|
| BNPL Integration | **v1.2.3** | v1.2.2 |
| Spec | **v1.4.4** | v1.4.3 |
| API Contract | **v1.4.4** | v1.4.3 |
| Data Model | **v1.4.10** | v1.4.9 |
| Navigation | **v1.4.4** | v1.4.3 |
| Integration Contracts | **v1.6.4** | v1.6.3 |
| Settlement | **v1.2.2** | v1.2.1 |

> **Patch Snapshot v1.2:** BNPL Integration v1.2.2 — без содержательных изменений. Обновлены только cross-references на новые версии зависимых документов.
>
> **Patch Bundle v1.0 (Fix #2):** Исправлен document title `v1.2.3` → `v1.2.2`. Каскадное обновление Version Matrix: Spec → v1.4.4, API Contract → v1.4.4, Data Model → v1.4.10.
>
> **Snapshot решений (16.02.2026):** Version Matrix выровнена: Nav v1.4.4, IC v1.6.4, Settlement v1.2.2. Inline cross-refs обновлены.

---

BNPL Integration v1.2.3 (Consolidated) — 16.02.2026 — Robin Food Payment Team
