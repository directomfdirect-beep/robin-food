# Robin Food — Settlement v1.2.3 (Consolidated)

| Версия | Дата | Статус | Автор |
|--------|------|--------|-------|
| 1.2.3 | 16.02.2026 | Consolidated | Robin Food Finance Team |

**Scope v1.2.2:** Полная спецификация расчётов с партнёрами (settlement), включая GMV calculation, commission, adjustments, dispute flow, BNPL fee handling. Патч v1.2.1 — синхронизация с Snapshot v1.0: `disputed` в CHECK constraint `settlement_period.status`, rename таблиц, multistore settlement, обновление зависимостей. **Патч v1.2.2 — Patch Bundle Fix #1:** Dispute API alignment — Settlement подтверждён как source of truth; расширен response sec 8.1, добавлена валидация lineIds, обновлены cross-references на Spec v1.4.4, API Contract v1.4.4, Data Model v1.4.10. **Патч v1.2.3 — Snapshot решений 16.02.2026:** Sec 10 Payout Execution формализован (IC v1.6.4 sec 1.4, `payoutref` field), Version Matrix синхронизирована (Nav v1.4.4, IC v1.6.4), inline cross-refs обновлены.

**Зависимости:** Spec v1.4.4, API Contract v1.4.4, Data Model v1.4.10, BNPL Integration v1.2.2, Navigation v1.4.4, Integration Contracts v1.6.4

> **Patch Snapshot v1.0 (15.02.2026):** Settlement — **без изменений версии** (остаётся v1.2.1). Внесены notes в sec 5 и sec 9 по Патчу #6 (Settlement Pipeline — sequential). Cross-references в Version Matrix обновлены по Патчу #8.

> **Patch Snapshot v1.1 (15.02.2026):** Settlement — **без содержательных изменений** (версия остаётся v1.2.1). Подтверждена совместимость: фильтр `status = 'completed' AND payment_status = 'paid'` корректен для нового lifecycle `picking → ready → customer_arrived → completed` (Патч #3). Обновлены cross-references в Version Matrix.

> **Patch Snapshot v1.2 (15.02.2026):** Settlement — **без содержательных изменений** (версия остаётся v1.2.1). Обновлены cross-references зависимых документов (Spec v1.4.3, API Contract v1.4.3, Data Model v1.4.9, Navigation v1.4.3, IC v1.6.3). Sec 9.1 и Sec 12: добавлены ссылки на unified CRON monitoring (IC v1.6.4 sec 8.6, Патч #6) — Settlement Pipeline обёрнут в `cron_health_wrapper` с формализованными thresholds и Dead Man's Switch. Подтверждена совместимость: webhook Tinkoff/СБП (Патч #1) обрабатывает подтверждение оплаты upstream — settlement logic не затронут (фильтр `status='completed' AND payment_status='paid'` по-прежнему корректен). NFR (Патч #8): формализованы latency/throughput targets в Spec v1.4.3 sec 12.

> **Patch Snapshot v1.3 (16.02.2026):** Settlement **v1.2.1 → v1.2.2.** Dispute API conflict (Patch Bundle Fix #1) — Settlement подтверждён как source of truth: `lineIds` (не `orderIds`), re-dispute разрешён. Расширен response sec 8.1: добавлено поле `totalDisputedLines`. Добавлена валидация `lineIds` принадлежности к `periodId` — ошибка `400 INVALID_LINE_IDS`. API Contract v1.4.3 sec 11.1 обновлён до v1.4.4 sec 11.1 для соответствия. Cross-references: Spec v1.4.3 → v1.4.4, API Contract v1.4.3 → v1.4.4, Data Model v1.4.9 → v1.4.10.

> **Snapshot решений (16.02.2026):** Settlement **v1.2.2 → v1.2.3.** Sec 10 Payout Execution формализован: `executepayout()` с вызовом payout-провайдера (IC v1.6.4, sec 1.4), новое поле `settlement_period.payoutref`, описание процесса (success/error paths). Version Matrix: Nav v1.4.3→v1.4.4, IC v1.6.3→v1.6.4. Inline cross-refs IC обновлены.

---

## Changelog v1.2.2 → v1.2.3

| # | Изменение | Snapshot решений 16.02.2026 | Тип |
|---|-----------|---------------------------|-----|
| 1 | Sec 10: Payout Execution — REWRITE: формализованная функция `executepayout()` с вызовом payout-провайдера (IC v1.6.4, sec 1.4), новое поле `settlement_period.payoutref`, процесс описан (success: `paid` + `payoutref` + e-mail; error: no change + alert) | §2.1 Payout Execution | REWRITE SECTION |
| 2 | Sec 10: DDL reference — `ALTER TABLE settlement_period ADD COLUMN payoutref TEXT` (nullable, bank transfer reference) | §2.1 Data Model | ADD FIELD REF |
| 3 | Document Version Matrix — Navigation **v1.4.3→v1.4.4**, Integration Contracts **v1.6.3→v1.6.4** | §1.7 Version Matrix | METADATA |
| 4 | Dependencies header — Nav v1.4.3→**v1.4.4**, IC v1.6.3→**v1.6.4** | §1.7 Cross-ref sync | METADATA |
| 5 | Inline cross-refs: Integration Contracts v1.6.3→**v1.6.4** (sec 5, 9, 12) | §1.7 Inline refs | METADATA |

---

## Changelog v1.2.1 → v1.2.2

| # | Изменение | Patch Bundle Fix | Тип |
|---|-----------|-----------------|-----|
| 1 | Sec 8.1: Dispute response — добавлено поле `totalDisputedLines` (общее кол-во disputed строк в периоде) | Fix #1 | ALTER RESPONSE |
| 2 | Sec 8.2: Добавлена валидация `lineIds` принадлежности к `periodId` → `400 INVALID_LINE_IDS` | Fix #1 | ALTER VALIDATION |
| 3 | Sec 8.1: Формализован полный перечень ошибок endpoint (5 кодов) | Fix #1 | ALTER ERRORS |
| 4 | All cross-refs: API Contract v1.4.3 → v1.4.4 | Fix #1 meta | ALTER REF |
| 5 | All cross-refs: Spec v1.4.3 → v1.4.4 | Fix #9 meta | ALTER REF |
| 6 | All cross-refs: Data Model v1.4.9 → v1.4.10 | Fix #3 meta | ALTER REF |
| 7 | Document Version Matrix обновлена | meta | METADATA |

---

## Changelog v1.2 → v1.2.1

| # | Изменение | Snapshot § | Тип |
|---|-----------|-----------|-----|
| 1 | `settlement_period.status` CHECK — добавлен `'disputed'` | §1.1 | DDL CHANGE |
| 2 | `order` → `customer_order` — все FK, REFERENCES, код | §1.2 | RENAME |
| 3 | `"order"(id)` → `customer_order(id)` в `settlement_line`, `settlement_adjustment` | §1.2 | DDL CHANGE |
| 4 | Multistore: один checkout = N `customer_order` = N settlement lines | §5.3 | UPDATED |
| 5 | BR-BNPL-6 cancel: `status = 'completed'` в settlement (не попадает в period) | §6.5 Spec | CLARIFICATION |
| 6 | Document Version Matrix обновлена | §12 | META |
| 7 | Sec 5 + Sec 9: note — Settlement Pipeline sequential (Patch Snapshot Патч #6) | Патч #6 | NOTE |

---

## 1. Общий обзор

**Settlement** — процесс расчёта комиссии и payout-сумм для партнёров (розничных сетей) за завершённые заказы.

**Расчётный период:** 1 неделя (понедельник–воскресенье).

**Timeline:**
```
Week 1 (Mon-Sun): Заказы выполняются
Week 2 Mon 03:00: Settlement Pipeline Step 1 — создание period, статус = 'review'
Week 2 Mon 03:00: Settlement Pipeline Step 2 — auto-approve просроченных periods
Week 2 Mon-Sun: Партнёр проверяет отчёт, может оспорить
Week 3 Mon 03:00: Если не оспорен -> status = 'approved'
Week 3: Payout партнёру (банковский перевод)
```

**Multistore note (v1.2.1):** При multistore checkout (`POST /cart/checkout`) корзина разбивается на N `customer_order` (по одному на магазин). Каждый sub-order — **отдельная settlement line** в period партнёра, к которому относится store.

> **Совместимость с Patch Snapshot v1.1 (Патч #3):** Новые промежуточные статусы `ready` и `customer_arrived` **не влияют** на settlement. Заказ попадает в settlement **только** при `status = 'completed' AND payment_status = 'paid'`. Lifecycle: `picking → ready → customer_arrived → completed` — заказ достигает `completed` после `confirm-pickup`, после чего включается в settlement period. Capture (BNPL/Tinkoff/СБП) происходит при `picking → ready`, но settlement line создаётся только по `completed_at`.

> **Совместимость с Patch Snapshot v1.2 (Патч #1 — Webhook Tinkoff/СБП):** Incoming webhook `POST /api/v1/webhooks/tinkoff` (API Contract v1.4.4, sec 13.1) обрабатывает подтверждение оплаты: `AUTHORIZED|CONFIRMED` → `payment_transaction.status='success'` → `customer_order.status='confirmed'`. Это **upstream** от settlement — заказ ещё не `completed`. Settlement logic **не затронут**: фильтр `status='completed' AND payment_status='paid'` по-прежнему корректен. СБП-платежи проходят через тот же webhook и обрабатываются идентично карточным.

---

## 2. GMV Calculation

**GMV (Gross Merchandise Value)** — валовая стоимость товаров в заказе.

### 2.1 Per-Item Contribution

```python
def calc_item_gmv(item):
    if item.quantity_unit == 'kg':
        # Для весовых: final_price уже содержит (price * actual_qty)
        return item.final_price
    else:
        # Для штучных: final_price * quantity
        return item.final_price * item.requested_quantity
```

### 2.2 Order GMV

```python
def calc_order_gmv(order):
    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id,
        OrderItem.status.in_(['active', 'replaced'])
    ).all()

    return sum(calc_item_gmv(item) for item in items)
```

**Пример:**

| Item | Type | Req Qty | Actual Qty | Price | Final Price | Contribution |
|------|------|---------|------------|-------|-------------|--------------|
| Яблоки Голден | kg | 0.5 | 0.48 | 19800/kg | 9504 | **9504** |
| Молоко 3.2% | pcs | 2 | — | 9800 | 9800 | **19600** (9800x2) |
| Сыр Российский | kg | 0.4 | 0.32 | 55000/kg | 17600 | **17600** |
| **TOTAL** | | | | | | **46704** |

`customer_order.total_amount = 46704 копеек = 467.04 руб`

---

## 3. Commission & Payout

### 3.1 Partner Tariff

```sql
SELECT commission_percent
FROM partner_tariff
WHERE partner_id = :partner_id
  AND effective_from <= :order_completed_date
  AND (effective_to IS NULL OR effective_to > :order_completed_date)
ORDER BY effective_from DESC
LIMIT 1;
```

### 3.2 Calculation

```python
gmv = calc_order_gmv(order)
commission = gmv * tariff.commission_percent / 100
payout = gmv - commission
```

**Пример (tariff 15%):**
```
GMV: 467.04 руб
Commission (15%): 70.06 руб
Payout: 396.98 руб
```

**BNPL fee:** НЕ вычитается из payout партнёру (см. sec 7).

---

## 4. Settlement Period

### 4.1 Data Model (UPDATED v1.2.1)

```sql
CREATE TABLE settlement_period (
    id                  UUID PRIMARY KEY,
    partner_id          UUID NOT NULL REFERENCES partner(id),

    period_start        DATE NOT NULL,      -- Monday
    period_end          DATE NOT NULL,      -- Sunday

    status              VARCHAR(20) NOT NULL DEFAULT 'calculating',

    total_gmv           NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_commission    NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_payout        NUMERIC(12,2) NOT NULL DEFAULT 0,

    review_deadline     DATE,
    report_url          TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- UPDATED v1.2.1: added 'disputed' (Snapshot §1.1)
    CONSTRAINT status_check
        CHECK (status IN ('calculating', 'review', 'disputed', 'approved', 'paid'))
);
```

**Статусы (UPDATED v1.2.1):**

| Status | Описание |
|--------|----------|
| `calculating` | Job создаёт период, рассчитывает строки |
| `review` | Партнёр может проверить и оспорить (6 дней) |
| `disputed` | Партнёр оспорил одну или несколько строк **(NEW v1.2.1)** |
| `approved` | Оспариваний нет / разрешены, готов к выплате |
| `paid` | Выплата произведена |

**State machine:**
```
calculating -> review -> approved -> paid
                  |
                  +-> disputed -> approved -> paid
```

> **v1.2 -> v1.2.1:** В v1.2 `period.status` устанавливался в `'disputed'` в коде (sec 8.2), но CHECK constraint не включал это значение. Snapshot §1.1 исправляет несоответствие — `'disputed'` добавлен в DDL.

### 4.2 Migration SQL (v1.2 -> v1.2.1)

```sql
-- Step 1: Update CHECK constraint
ALTER TABLE settlement_period
    DROP CONSTRAINT IF EXISTS status_check;

ALTER TABLE settlement_period
    ADD CONSTRAINT status_check
    CHECK (status IN ('calculating', 'review', 'disputed', 'approved', 'paid'));
```

> Downtime: 0 сек — `ALTER TABLE ... DROP/ADD CONSTRAINT` на CHECK — metadata-only operation.

### 4.3 Settlement Lines (UPDATED v1.2.1)

```sql
CREATE TABLE settlement_line (
    id                  UUID PRIMARY KEY,
    period_id           UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
    order_id            UUID NOT NULL REFERENCES customer_order(id),  -- RENAMED v1.2.1

    gmv                 NUMERIC(12,2) NOT NULL,
    commission_pct      NUMERIC(5,2) NOT NULL,
    commission_amt      NUMERIC(12,2) NOT NULL,
    payout_amt          NUMERIC(12,2) NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'pending',

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT status_check CHECK (status IN ('pending', 'disputed', 'approved'))
);

CREATE INDEX idx_settlement_line_period ON settlement_line(period_id, status);
CREATE INDEX idx_settlement_line_order ON settlement_line(order_id);
```

> **v1.2.1:** `REFERENCES "order"(id)` -> `REFERENCES customer_order(id)` (Snapshot §1.2).

**Каждый `customer_order` = 1 line** в settlement period. При multistore checkout один пользовательский checkout может создать N lines в N разных periods (по одному на каждого партнёра).

---

## 5. Settlement Job (Step 1 of Settlement Pipeline)

> **Settlement Pipeline (Patch Snapshot v1.0, Патч #6):** Settlement Job и Auto-Approve объединены в один **sequential pipeline**, запускаемый CRON daily 03:00 MSK. Settlement Job = **Step 1** (расчёт периодов). Auto-Approve = **Step 2** (sec 9). Health check = **Step 3**. Подробности pipeline — см. Spec v1.4.4, sec 11; Integration Contracts v1.6.4, sec 8.2.

**CRON:** Daily at 03:00 MSK — **Step 1 of Settlement Pipeline**

### 5.1 Logic (UPDATED v1.2.1)

```python
def run_settlement_job():
    previous_week_start = get_previous_monday()
    previous_week_end = previous_week_start + timedelta(days=6)

    for partner in db.query(Partner).filter(Partner.is_active == True):
        period = create_or_get_period(
            partner_id=partner.id,
            start=previous_week_start,
            end=previous_week_end
        )

        if period.status != 'calculating':
            continue  # Уже обработан

        # UPDATED v1.2.1: customer_order (was "order")
        # NOTE (Snapshot v1.1, Патч #3): фильтр status='completed' корректен —
        # заказы проходят ready → customer_arrived → completed перед settlement
        orders = db.query(CustomerOrder).join(Store).filter(
            Store.partner_id == partner.id,
            CustomerOrder.status == 'completed',
            CustomerOrder.payment_status == 'paid',
            CustomerOrder.completed_at >= previous_week_start,
            CustomerOrder.completed_at < previous_week_end + timedelta(days=1)
        ).all()

        total_gmv = 0
        total_commission = 0
        total_payout = 0

        for order in orders:
            line = create_settlement_line(period, order)
            total_gmv += line.gmv
            total_commission += line.commission_amt
            total_payout += line.payout_amt

        # Apply adjustments (refunds, corrections)
        adjustments = apply_adjustments(period)
        total_payout += adjustments['net_adjustment']

        # Update period totals
        period.total_gmv = total_gmv
        period.total_commission = total_commission
        period.total_payout = total_payout
        period.status = 'review'
        period.review_deadline = previous_week_end + timedelta(days=6)

        # Generate PDF report
        report_url = generate_pdf_report(period)
        period.report_url = report_url

        db.commit()

        # Notify partner
        send_email(partner.contact_email, {
            'subject': f"Отчёт за {previous_week_start} - {previous_week_end}",
            'body': f"Сумма к выплате: {total_payout} руб. Срок проверки: {period.review_deadline}.",
            'report_url': report_url
        })
```

### 5.2 Create Settlement Line

```python
def create_settlement_line(period, order):
    gmv = calc_order_gmv(order)

    tariff = get_partner_tariff(
        partner_id=period.partner_id,
        date=order.completed_at.date()
    )

    commission_amt = gmv * tariff.commission_percent / 100
    payout_amt = gmv - commission_amt

    line = SettlementLine(
        period_id=period.id,
        order_id=order.id,
        gmv=gmv / 100,                          # kopecks -> rubles
        commission_pct=tariff.commission_percent,
        commission_amt=commission_amt / 100,
        payout_amt=payout_amt / 100,
        status='pending'
    )

    db.add(line)
    return line
```

### 5.3 Multistore Settlement (NEW v1.2.1)

При multistore checkout один покупатель создаёт N `customer_order`. Каждый sub-order привязан к своему `store`, а store — к `partner`. Settlement job обрабатывает каждый sub-order **независимо**:

```
Checkout (корзина с 3 магазинами):
  |-- customer_order #1 (Store A, Partner X) -> settlement_line в period Partner X
  |-- customer_order #2 (Store B, Partner X) -> settlement_line в period Partner X
  +-- customer_order #3 (Store C, Partner Y) -> settlement_line в period Partner Y
```

**Правила:**
- Один `customer_order` = один `settlement_line` (без изменений)
- Sub-orders одного партнёра попадают в **один** period
- Sub-orders разных партнёров — в **разные** periods
- BNPL minAmount check, cancel, refund — per sub-order

---

## 6. Adjustments

**Settlement Adjustments** — корректировки payout (refunds, penalties, bonuses).

### 6.1 Data Model (UPDATED v1.2.1)

```sql
CREATE TABLE settlement_adjustment (
    id              UUID PRIMARY KEY,
    period_id       UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
    order_id        UUID REFERENCES customer_order(id),  -- RENAMED v1.2.1; nullable for corrections

    type            VARCHAR(20) NOT NULL,
    amount          NUMERIC(12,2) NOT NULL,
    reason          TEXT NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT type_check CHECK (type IN ('refund', 'correction', 'penalty', 'bonus'))
);

CREATE INDEX idx_adjustment_period ON settlement_adjustment(period_id);
```

> **v1.2.1:** `REFERENCES "order"(id)` -> `REFERENCES customer_order(id)` (Snapshot §1.2).

**Types:**

| Type | Sign | Пример |
|------|------|--------|
| `refund` | Negative | Partial refund покупателю |
| `correction` | Negative/Positive | Ошибка в расчёте |
| `penalty` | Negative | Штраф за нарушение SLA |
| `bonus` | Positive | Промо-акция |

### 6.2 Partial Refund (BR-PAY-5)

**Сценарий:** После `customer_order.status = 'completed'` часть суммы возвращена покупателю.

```python
def handle_partial_refund(order, refund_amount_kopecks):
    # 1. Process refund через payment provider
    provider.refund(order.payment_ref, refund_amount_kopecks)

    # 2. Create adjustment
    period = get_current_or_next_open_period(order.store.partner_id)

    adjustment = SettlementAdjustment(
        period_id=period.id,
        order_id=order.id,
        type='refund',
        amount=-(refund_amount_kopecks / 100),  # negative
        reason=f"Partial refund for order {order.id}"
    )
    db.add(adjustment)
    db.commit()

    # 3. Recalc period totals if period still open
    if period.status in ('calculating', 'review', 'disputed'):  # UPDATED v1.2.1: added 'disputed'
        recalc_period_totals(period)
```

**Order остаётся в settlement** — строка `settlement_line` не удаляется, adjustment корректирует payout.

### 6.3 Full Refund

```python
def handle_full_refund(order):
    provider.refund(order.payment_ref, order.total_amount)

    order.payment_status = 'refunded'
    db.commit()

    # Если заказ в closed period -> adjustment в следующем периоде
    period = get_period_for_order(order)

    if period and period.status in ('approved', 'paid'):
        next_period = get_current_or_next_open_period(order.store.partner_id)
        adjustment = SettlementAdjustment(
            period_id=next_period.id,
            order_id=order.id,
            type='refund',
            amount=-(order.total_amount / 100),
            reason=f"Full refund for order {order.id} from closed period"
        )
        db.add(adjustment)
    elif period and period.status in ('calculating', 'review', 'disputed'):  # UPDATED v1.2.1
        # Удалить строку из текущего периода
        db.query(SettlementLine).filter(
            SettlementLine.period_id == period.id,
            SettlementLine.order_id == order.id
        ).delete()
        recalc_period_totals(period)
```

### 6.4 BNPL Cancel After Picking (BR-BNPL-6)

**Сценарий:** `finalAmount < provider.minAmount` -> заказ отменён (status = `'cancelled'`, payment_status = `'refunded'`).

**Settlement impact:** Заказ **НЕ попадает** в settlement — фильтр `status = 'completed' AND payment_status = 'paid'` исключает его автоматически.

> **Совместимость с Snapshot v1.1 (Патч #3):** BR-BNPL-6 cancel теперь происходит при `picking → cancelled` (до перехода в `ready`). Заказ по-прежнему получает `status = 'cancelled'` и **не попадает** в settlement. Capture происходит при `picking → ready`, поэтому cancelled BNPL-заказы не проходят через capture и не достигают `completed`. Settlement logic не затронут.

Если cancel произошёл после того, как settlement line уже создан (edge case — order completed, затем поздний cancel):
```python
def handle_bnpl_cancel_settlement(order):
    period = get_period_for_order(order)
    if period and period.status in ('calculating', 'review', 'disputed'):
        db.query(SettlementLine).filter(
            SettlementLine.period_id == period.id,
            SettlementLine.order_id == order.id
        ).delete()
        recalc_period_totals(period)
    elif period and period.status in ('approved', 'paid'):
        next_period = get_current_or_next_open_period(order.store.partner_id)
        adjustment = SettlementAdjustment(
            period_id=next_period.id,
            order_id=order.id,
            type='refund',
            amount=-(order.total_amount / 100),
            reason=f"BNPL cancel (AMOUNT_BELOW_MIN) for order {order.id}"
        )
        db.add(adjustment)
```

---

## 7. BNPL Fee Handling

**BNPL fee — расход Robin Food, НЕ влияет на payout партнёру.**

```python
# Пример: Долями, 6% fee
order_total_amount = 46580  # копеек
bnpl_fee = 46580 * 0.06  # = 2795 копеек

# GMV для settlement
gmv = 46580  # БЕЗ вычитания fee

# Payout партнёру (15% commission)
commission = 46580 * 0.15  # = 6987
payout = 46580 - 6987      # = 39593

# BNPL fee списывается отдельно с баланса Robin Food
robin_food_expense = bnpl_fee  # = 2795
```

**Partner не платит BNPL fee.** Это маркетинговый инструмент Robin Food.

**Multistore (v1.2.1):** BNPL fee считается per `customer_order` (sub-order), т.к. каждый — отдельная BNPL-транзакция.

---

## 8. Dispute Flow (UPDATED v1.2.2)

**Партнёр может оспорить строки settlement в течение review period (6 дней).**

### 8.1 API Endpoint (UPDATED v1.2.2 — Patch Bundle Fix #1)

> Каноничный контракт — данный документ (Settlement). API Contract v1.4.4, sec 11.1 приведён в соответствие.

```
POST /api/v1/partner/settlements/:periodId/dispute
Authorization: Bearer <partner-token>
Content-Type: application/json

Body:
{
  "lineIds": ["uuid-line-1", "uuid-line-2"],
  "reason": "Некорректный GMV по позициям — просим пересчитать"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lineIds` | uuid[] | ✅ | ID строк из `settlement_line` для данного периода |
| `reason` | string | ✅ | Причина оспаривания (max 1000 chars) |

**Response 200:**
```json
{
  "periodId": "uuid",
  "status": "disputed",
  "disputedLinesCount": 2,
  "totalDisputedLines": 5
}
```

| Field | Type | Description |
|-------|------|-------------|
| `periodId` | uuid | ID settlement period |
| `status` | string | `"disputed"` — всегда после успешного запроса |
| `disputedLinesCount` | integer | Кол-во строк, изменённых **этим** запросом |
| `totalDisputedLines` | integer | Общее кол-во disputed строк в периоде **(NEW v1.2.2)** |

**Errors (UPDATED v1.2.2):**

| HTTP | Code | Описание |
|------|------|----------|
| 400 | `VALIDATION_ERROR` | Пустой `lineIds`, `reason` > 1000 символов |
| 400 | `INVALID_LINE_IDS` | Один или несколько `lineIds` не принадлежат данному `periodId`. `details: { invalidIds: [...] }` **(NEW v1.2.2)** |
| 403 | `FORBIDDEN` | Period не принадлежит партнёру |
| 404 | `PERIOD_NOT_FOUND` | `periodId` не существует |
| 409 | `PERIOD_NOT_DISPUTABLE` | Статус не в `(review, disputed)` ИЛИ `reviewDeadline` истёк. `details: { reason, currentStatus / reviewDeadline }` |

> **УДАЛЕНО (v1.2.2):** Ошибка `409 PERIOD_ALREADY_DISPUTED` из API Contract v1.4.3 — не нужна, re-dispute разрешён.

### 8.2 Business Logic (UPDATED v1.2.2)

```python
def dispute_settlement_lines(period_id, line_ids, reason):
    period = db.get(SettlementPeriod, period_id)

    # Validation (aligned with API Contract v1.4.4, sec 11.1)
    if period.status not in ('review', 'disputed'):  # UPDATED v1.2.1: allow re-dispute
        raise HTTP_409(
            code='PERIOD_NOT_DISPUTABLE',
            message=f"Период в статусе '{period.status}', оспаривание невозможно",
            details={'reason': 'STATUS_NOT_REVIEW', 'currentStatus': period.status}
        )

    if period.review_deadline < date.today():
        raise HTTP_409(
            code='PERIOD_NOT_DISPUTABLE',
            message=f"Срок проверки истёк {period.review_deadline}",
            details={'reason': 'DEADLINE_PASSED', 'reviewDeadline': str(period.review_deadline)}
        )

    # NEW v1.2.2: Validate lineIds belong to this period
    valid_line_ids = set(
        row.id for row in db.query(SettlementLine.id).filter(
            SettlementLine.id.in_(line_ids),
            SettlementLine.period_id == period_id
        ).all()
    )
    invalid_ids = [lid for lid in line_ids if lid not in valid_line_ids]
    if invalid_ids:
        raise HTTP_400(
            code='INVALID_LINE_IDS',
            message=f"{len(invalid_ids)} строк не принадлежат периоду {period_id}",
            details={'invalidIds': invalid_ids}
        )

    # Update lines status
    updated_count = db.query(SettlementLine).filter(
        SettlementLine.id.in_(line_ids),
        SettlementLine.period_id == period_id
    ).update({'status': 'disputed'})

    # Update period status (UPDATED v1.2.1: now valid in CHECK constraint)
    period.status = 'disputed'
    period.updated_at = datetime.utcnow()
    db.commit()

    # NEW v1.2.2: Calculate total disputed lines in period
    total_disputed = db.query(SettlementLine).filter(
        SettlementLine.period_id == period_id,
        SettlementLine.status == 'disputed'
    ).count()

    # Notify Robin Food ops team
    send_alert(
        to='ops@robinfood.ru',
        subject=f"Settlement dispute: period {period_id}",
        body=f"Partner {period.partner_id} disputed {len(line_ids)} lines "
             f"(total disputed: {total_disputed}). Reason: {reason}"
    )

    return {
        'periodId': period_id,
        'status': 'disputed',
        'disputedLinesCount': updated_count,
        'totalDisputedLines': total_disputed
    }
```

> **v1.2 -> v1.2.1:** В v1.2 строка `period.status = 'disputed'` вызывала ошибку PostgreSQL, т.к. CHECK constraint не включал `'disputed'`. Теперь constraint обновлён (sec 4.2).

### 8.3 Resolution

**Manual process:**
1. Ops team investigates disputed lines
2. Корректировка через `SettlementAdjustment(type='correction')` если есть ошибка
3. Disputed lines -> `status = 'approved'`
4. Period -> `status = 'approved'`

**Dispute в `disputed` period (NEW v1.2.1):** Партнёр может оспорить дополнительные строки в period, который уже в `'disputed'`. Это позволяет итеративную проверку без reset.

---

## 9. Auto-Approval (Step 2 of Settlement Pipeline)

> **Settlement Pipeline (Patch Snapshot v1.0, Патч #6):** Auto-Approve = **Step 2** of Settlement Pipeline. Выполняется **последовательно** после Settlement Job (Step 1), а не параллельно. Это исключает race condition, при котором auto-approve мог обработать period до завершения расчёта Step 1.

**CRON:** Daily at 03:00 MSK — **Step 2 of Settlement Pipeline** (sequential after Step 1)

```python
def auto_approve_periods():
    # UPDATED v1.2.1: include 'disputed' periods where all lines resolved
    today = date.today()

    periods = db.query(SettlementPeriod).filter(
        SettlementPeriod.status.in_(['review', 'disputed']),
        SettlementPeriod.review_deadline < today
    ).all()

    for period in periods:
        disputed_count = db.query(SettlementLine).filter(
            SettlementLine.period_id == period.id,
            SettlementLine.status == 'disputed'
        ).count()

        if disputed_count == 0:
            period.status = 'approved'
            period.updated_at = datetime.utcnow()
            db.commit()

            partner = db.get(Partner, period.partner_id)
            send_email(partner.contact_email, {
                'subject': f"Расчётный период {period.period_start}-{period.period_end} утверждён",
                'body': f"Сумма к выплате: {period.total_payout} руб. Ожидайте перевод в течение 3 дней."
            })
        else:
            # Disputed lines still open -> notify ops
            send_alert(
                to='ops@robinfood.ru',
                subject=f"Unresolved disputes: period {period.id}",
                body=f"Deadline passed, {disputed_count} lines still disputed. Manual action required."
            )
```

### 9.1 Settlement Pipeline — Health Check (Step 3, UPDATED — Patch Snapshot v1.2)

> **NEW note (Patch Snapshot v1.0, Патч #6)**

> **UPDATED (Patch Snapshot v1.2, Патч #6 — Unified CRON Monitoring):** Settlement Pipeline теперь обёрнут в unified `cron_health_wrapper` (Integration Contracts v1.6.4, sec 8.6). Собственный health check (ниже) сохраняется как **domain-specific дополнение** к unified wrapper. Формализованные thresholds:

| Metric | Warn | Crit | Stale Alert |
|--------|------|------|-------------|
| Settlement Pipeline total time | > 5 min | > 15 min | no run > 25h |

**Prometheus metrics (через cron_health_wrapper):** `cron_duration_seconds{job="settlement_pipeline"}`, `cron_last_success_timestamp{job="settlement_pipeline"}`, `cron_items_processed{job="settlement_pipeline"}`, `cron_errors_total{job="settlement_pipeline"}`.

**Dead Man's Switch:** `POST https://monitoring.robinfood.ru/heartbeat/settlement_pipeline` — отправляется при каждом успешном завершении. Отсутствие heartbeat > 25h → Stale Alert → ops.

```python
def settlement_pipeline_health_check(step1_time, step2_time, periods_processed):
    total_time = step1_time + step2_time

    log.info(f"Settlement Pipeline completed: "
             f"step1={step1_time:.1f}s, step2={step2_time:.1f}s, "
             f"total={total_time:.1f}s, periods={periods_processed}")

    if total_time > 300:  # 5 min — warn threshold (IC v1.6.4 sec 8.6)
        send_alert(
            to='ops@robinfood.ru',
            subject='Settlement Pipeline slow execution',
            body=f"Total time: {total_time:.0f}s (threshold: 300s). "
                 f"Periods processed: {periods_processed}"
        )
```

### 9.2 Full Pipeline Orchestration (UPDATED — Patch Snapshot v1.2)

```python
# CRON: Daily 03:00 MSK — Settlement Pipeline (sequential)
# Wrapped in cron_health_wrapper (IC v1.6.4 sec 8.6, Patch Snapshot v1.2 Патч #6)
def settlement_pipeline():
    t0 = time.time()

    # Step 1: Settlement Job
    run_settlement_job()
    t1 = time.time()

    # Step 2: Auto-Approve
    auto_approve_periods()
    t2 = time.time()

    # Step 3: Domain-specific Health Check (дополняет unified wrapper)
    settlement_pipeline_health_check(
        step1_time=t1 - t0,
        step2_time=t2 - t1,
        periods_processed=count_processed_periods()
    )

    # Return result for cron_health_wrapper
    return CronResult(processed_count=count_processed_periods())
```

> Полная спецификация pipeline: Spec v1.4.4, sec 11. CRON scheduling: Integration Contracts v1.6.4, sec 8.2. Unified monitoring: Integration Contracts v1.6.4, sec 8.6.

---

## 10. Payout Execution (REWRITTEN v1.2.3 — Snapshot решений 16.02.2026, §2.1)

**Process (UPDATED v1.2.3):** Автоматический банковский перевод через payout-провайдера (см. Integration Contracts v1.6.4, sec 1.4 — Settlement Payout Provider).

### 10.1 Процесс

- **Вход:** период в статусе `approved`.
- **На успехе:** статус → `paid`, сохраняется `payoutref` (bank transfer reference), отправляется e-mail партнёру.
- **На ошибке:** статус **не меняется**, логируем ошибку, шлём alert ops-команде, возможен ручной повтор.

### 10.2 Новое поле `payoutref` (v1.2.3)

> Зафиксировано в Settlement; DDL patch через Data Model.

```sql
ALTER TABLE settlement_period
ADD COLUMN payoutref TEXT;  -- bank transfer reference, nullable
```

### 10.3 Формализованная функция

```python
def execute_payout(period_id: UUID) -> None:
    period = db.get(SettlementPeriod, period_id)
    partner = db.get(Partner, period.partner_id)

    if period.status != 'approved':
        raise ValueError(f"Period {period_id} not approved")

    # 1. Вызов payout-провайдера (IC v1.6.4, sec 1.4)
    payout_ref = payout_provider.transfer(
        recipient_inn=partner.inn,
        amount=period.total_payout,
        description=f"{period.period_start} - {period.period_end}"
    )

    # 2. Обновление статуса периода
    period.status = 'paid'
    period.updated_at = datetime.utcnow()
    period.payoutref = payout_ref  # NEW field v1.2.3
    db.commit()

    # 3. Уведомление партнёра
    send_email(
        partner.contact_email,
        subject=f"Settlement payout for {period.period_start} - {period.period_end}",
        body=f"Total payout {period.total_payout} sent, reference {payout_ref}"
    )
```

### 10.4 Error Handling

```python
def execute_payout_safe(period_id: UUID) -> None:
    try:
        execute_payout(period_id)
    except Exception as e:
        # Статус НЕ меняется — период остаётся 'approved'
        log.error(f"Payout failed for period {period_id}: {e}")
        send_alert(
            to='ops@robinfood.ru',
            subject=f"Payout execution failed: period {period_id}",
            body=f"Error: {e}. Manual retry required."
        )
        # Ручной повтор: ops вызывает execute_payout(period_id) после исправления
```

> **Интеграция:** Payout-провайдер (`POST /v1/transfers`) описан в Integration Contracts v1.6.4, sec 1.4. Возвращает `transferId` (= `payoutref`) и `status` (`COMPLETED` | `FAILED`).

---

## 11. PDF Report Structure

**Генерируется settlement job, доступен партнёру для скачивания.**

```
+-- Отчёт о расчётах за 03.02.2026 - 09.02.2026 ----------------+
|                                                                  |
|  Партнёр: Пятёрочка (ИНН 1234567890)                           |
|  Период: 03.02.2026 - 09.02.2026                                |
|  Тариф: 15%                                                     |
|  Статус: review / disputed / approved                            |
|                                                                  |
+-- Заказы --------------------------------------------------------+
|                                                                  |
|  ID заказа    | Дата       | GMV    | Комиссия | Выплата | Ст.  |
|  ----------------------------------------------------------------|
|  uuid-1       | 03.02.2026 | 467р   | 70р      | 397р    | OK   |
|  uuid-2       | 04.02.2026 | 1234р  | 185р     | 1049р   | DISP |
|  ...                                                             |
|  ----------------------------------------------------------------|
|  ИТОГО        |            | 45670р | 6850р    | 38820р  |      |
|                                                                  |
+-- Корректировки -------------------------------------------------+
|                                                                  |
|  Тип          | Причина                          | Сумма        |
|  ----------------------------------------------------------------|
|  Refund       | Partial refund order uuid-5      | -120р        |
|  Correction   | Ошибка тарифа                    | +50р         |
|  ----------------------------------------------------------------|
|  Корректировки ИТОГО                             | -70р         |
|                                                                  |
+-- Итоговая выплата ----------------------------------------------+
|                                                                  |
|  Выплата за заказы:       38820р                                |
|  Корректировки:           -70р                                  |
|  -----------------------------------------------                |
|  К выплате:               38750р                                |
|                                                                  |
+------------------------------------------------------------------+
```

> **v1.2.1:** Колонка «Ст.» (статус) показывает `OK` / `DISP` для disputed lines.

---

## 12. Monitoring & Alerts (UPDATED — Patch Snapshot v1.2)

**Метрики:**
- Settlement pipeline total execution time (<5 min)
- Periods in `'disputed'` status (<5% of periods)
- Payout execution success rate (>99%)
- **Lines disputed per period** (avg, p95) **(NEW v1.2.1)**

**Unified CRON Monitoring (Patch Snapshot v1.2, Патч #6):**
Settlement Pipeline включён в unified `cron_health_wrapper` (Integration Contracts v1.6.4, sec 8.6):
- Prometheus metrics: `cron_duration_seconds`, `cron_last_success_timestamp`, `cron_items_processed`, `cron_errors_total` — все с label `job="settlement_pipeline"`
- Grafana dashboard: cron_* metrics
- Dead Man's Switch: heartbeat каждые 24h, stale alert при отсутствии > 25h
- Alert channels: Sentry (critical exceptions), Ops Telegram/Slack (warning + critical)

**Alerts:**
- Settlement pipeline failed (immediate) — **через cron_health_wrapper: Sentry + Ops Telegram**
- Settlement pipeline slow (>5 min warning, >15 min critical) — **через cron_health_wrapper thresholds (IC v1.6.4 sec 8.6)**
- Settlement pipeline stale (no run > 25h) — **через Dead Man's Switch (IC v1.6.4 sec 8.6)**
- Dispute rate spike (>10% lines в 1 день)
- Payout execution failed (immediate)
- **Unresolved disputes past deadline** (immediate) **(NEW v1.2.1)**

> **NFR reference (Patch Snapshot v1.2, Патч #8):** Общие latency/throughput/SLA targets — см. Spec v1.4.4, sec 12.

---

## Document Version Matrix (UPDATED v1.2.3)

| Document | Version | Min Compatible |
|----------|---------|----------------|
| Settlement | **v1.2.3** | v1.2.2 |
| Spec | **v1.4.4** | v1.4.3 |
| API Contract | **v1.4.4** | v1.4.3 |
| Data Model | **v1.4.10** | v1.4.9 |
| Navigation | **v1.4.4** | v1.4.3 |
| Integration Contracts | **v1.6.4** | v1.6.3 |
| BNPL Integration | **v1.2.2** | v1.2.2 |

> Cross-references обновлены для соответствия актуальным версиям зависимых документов (Patch Snapshot v1.0 Патч #8, Patch Snapshot v1.1, Patch Snapshot v1.2, **Patch Snapshot v1.3 — Patch Bundle**). Settlement bump v1.2.1 → v1.2.2: Dispute API alignment (sec 8.1, 8.2), cross-refs Spec/API Contract/DM.
>
> **Snapshot решений (16.02.2026):** Settlement bump v1.2.2 → v1.2.3: Payout Execution rewrite (sec 10, IC v1.6.4 sec 1.4, payoutref field). Version Matrix: Nav v1.4.4, IC v1.6.4.

---

*Settlement v1.2.3 (Consolidated) — 16.02.2026 — Robin Food Finance Team*
