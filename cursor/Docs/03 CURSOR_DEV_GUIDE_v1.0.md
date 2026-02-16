---
description: "Robin Food — Development Workflow & Cursor Instructions v1.0"
---

# Robin Food — Инструкция по разработке в Cursor

## Оглавление
1. Архитектура правил
2. Ежедневный workflow
3. Сценарии разработки (playbooks)
4. Agent Mode — стратегия промптов
5. Управление контекстом
6. Поддержка документации
7. CI / Quality gates
8. Чеклист перед первым коммитом
9. Частые ошибки и как их избежать

---

## 1. Архитектура правил

### 1.1 Три уровня правил
```
.cursor/rules/
├── 000  alwaysApply: true    ← загружается ВСЕГДА (conventions, naming, state machine)
├── 010–060  globs            ← загружаются АВТОМАТИЧЕСКИ при открытии файлов по паттерну
├── 070–080  agent requested  ← загружаются ПО ЗАПРОСУ агента (фичи, версии)
└── 090–095  manual commands  ← загружаются ПО КОМАНДЕ (/new-endpoint, /add-screen, ...)
```

### 1.2 Как Cursor выбирает правила
| Вы открыли файл | Что загрузится | Tokens ≈ |
|---|---|---|
| `src/models/customerorder.ts` | 000 + 010 | ~1800 |
| `src/api/routes/orders.ts` | 000 + 020 | ~1500 |
| `src/settlement/payout/executor.ts` | 000 + 050 | ~1500 |
| `mobile/src/screens/Buyer/Cart/CartScreen.tsx` | 000 + 060 | ~1500 |
| `src/payments/bnpl/split/authorize.ts` | 000 + 040 (+ 030 если в integrations/) | ~1800 |
| Команда `/add-cron` в чате | 000 + 092 | ~1200 |

### 1.3 Принцип: документ ≠ правило
```
docs/*.md              ← Source of truth, полный текст (25K–85K chars каждый)
.cursor/rules/*.mdc    ← Выжимки для агента (500–3300 chars), ссылки на docs/
```
Агент читает .mdc → если нужна деталь → смотрит `docs/` через `@file` или поиск.

---

## 2. Ежедневный workflow

### 2.1 Роли
```
Вы          = Project Manager + Technical Approver
Cursor Agent = Developer (пишет код, тесты, миграции)
```

### 2.2 Цикл работы
```
┌──────────────────────────────────────────────┐
│  1. Определить задачу (чётко, 2–3 предложения)  │
│  2. Указать контекст (@file, @folder, @docs)    │
│  3. Agent пишет код                              │
│  4. Review: diff, тесты, бизнес-логика           │
│  5. Accept / Request changes                     │
│  6. Commit с conventional message                │
└──────────────────────────────────────────────┘
```

### 2.3 Conventional Commits
```
feat(orders): add POST /orders/:id/arrived endpoint
fix(bnpl): handle minAmount check for multistore checkout
chore(docs): bump Settlement to v1.2.3
refactor(settlement): extract payout execution to separate module
test(auth): add OTP rate limit integration tests
```

---

## 3. Сценарии разработки (Playbooks)

### Playbook A — Новый REST endpoint

**Промпт:**
```
/new-endpoint

Создай POST /api/v1/orders/:id/arrived
- Precondition: customerorder.status = ready
- Postcondition: status = customerarrived, customerArrivedAt = NOW
- WS event: order.statusChanged → picker
- Push: picker.customerArrived
- Ошибки: 404 ORDER_NOT_FOUND, 403 FORBIDDEN, 409 ORDER_NOT_READY
- См. @docs/API_Contract_v1.4.5_consolidated.md sec 10.10
```

**Что Agent сделает:**
1. Route + Controller + Handler
2. Validation middleware
3. DB query + status transition
4. WS broadcast
5. Push trigger
6. Error responses в едином формате
7. Unit test + integration test
8. Обновит openapi.yaml

---

### Playbook B — Новый экран

**Промпт:**
```
/add-screen

Создай PickerStatsScreen для picker app:
- Показывает KPI: заказов за день, средний вес, рейтинг
- Доступен из PickerProfileScreen
- Нет deep link, нет push routing
- См. @docs/Navigation_v1.4.5_consolidated.md sec 1.2, 3.8
```

---

### Playbook C — Новая миграция

**Промпт:**
```
Добавь колонку estimatedPickupTime TIMESTAMPTZ в customerorder.
- Nullable, без default
- Zero-downtime migration (ALTER TABLE ADD COLUMN)
- Обнови модель в src/models/customerorder.ts
- См. @docs/Data_Model_v1.4.11_consolidated.md Table 2
```

---

### Playbook D — Новый CRON job

**Промпт:**
```
/add-cron

Создай staleOrdersCleanup:
- Schedule: daily 05:00 MSK
- Logic: отменить заказы в status=confirmed старше 24h
- Thresholds: warn 60s, crit 300s, stale 25h
- См. @docs/Integration_Contracts_v1.6.5_consolidated.md sec 8.6
```

---

### Playbook E — Баг в settlement

**Промпт:**
```
Баг: settlement pipeline не учитывает заказы со статусом customerarrived
при подсчёте GMV. Статус customerarrived — это active order (Snapshot v1.1).

Исправь query в src/settlement/pipeline/job.ts:
- WHERE status = 'completed' AND paymentstatus = 'paid'
- См. @docs/Settlement_v1.2.3_consolidated.md sec 5.1
```

---

### Playbook F — Интеграция нового провайдера

**Промпт:**
```
/add-provider

Интегрируй RuStore Push как secondary push channel:
- Класс RuStorePushGateway implements PushGateway
- Routing: если pushPlatform = 'rustore' → RuStore SDK
- Fallback: SMS через SMSC.ru
- См. @docs/Integration_Contracts_v1.6.5_consolidated.md sec 3.1
```

---

## 4. Agent Mode — стратегия промптов

### 4.1 Формула хорошего промпта
```
[Команда] + [Что сделать] + [Контекст @file] + [Ограничения] + [Ссылка на docs]
```

### 4.2 Примеры плохих → хороших промптов

| ❌ Плохо | ✅ Хорошо |
|---|---|
| "Сделай оплату" | "Реализуй SBP flow: Tinkoff Init с PayType=SBP, QR код в checkout response. См. @docs/IC_v1.6.5 sec 1.2" |
| "Добавь тесты" | "Добавь integration тесты для POST /auth/verify-otp: happy path, INVALID_OTP, OTP_BLOCKED, OTP_EXPIRED, CONSENT_REQUIRED. См. @docs/API_Contract sec 1.2" |
| "Пофикси баг" | "Баг: webhook Tinkoff возвращает 500 при дубликате PaymentId. Нужен idempotency check по idx_pay_tx_provider_ref. См. @docs/API_Contract sec 13.1" |

### 4.3 Эффективные @-ссылки
```
@docs/API_Contract_v1.4.5_consolidated.md     ← конкретный документ
@src/models/                                    ← вся папка моделей
@src/api/routes/orders.ts                       ← конкретный файл
@openapi.yaml                                   ← OpenAPI spec
@.cursor/rules/050-partner-settlement.mdc       ← конкретное правило
```

### 4.4 Мультифайловые задачи
Для задач, затрагивающих несколько слоёв:
```
Реализуй customer arrived flow end-to-end:

Backend:
- POST /api/v1/orders/:id/arrived (src/api/routes/orders.ts)
- WS event order.statusChanged (src/ws/events/)
- Push picker.customerArrived (src/push/triggers/)

Mobile:
- Кнопка «Я на месте» в OrderTrackingScreen (status=ready)
- Deep link robinfood://order/:id?action=arrived

@docs/API_Contract_v1.4.5_consolidated.md sec 10.10
@docs/Navigation_v1.4.5_consolidated.md sec 3.5
```

---

## 5. Управление контекстом

### 5.1 Когда контекста мало
Если Agent не знает о бизнес-правиле:
```
Проверь бизнес-правило BR-BNPL-6 в @docs/Spec_v1.4.5_consolidated.md sec 6
```

### 5.2 Когда контекста много
Если Agent путается в большом файле:
```
Читай ТОЛЬКО sec 10.7 из @docs/API_Contract_v1.4.5_consolidated.md
(PUT /picker/orders/:id/complete processing logic)
```

### 5.3 Nested rules для монорепо
Если backend и mobile в одном репо, добавь вложенные правила:
```
robin-food/
├── .cursor/rules/           ← общие правила (000–095)
├── backend/
│   └── .cursor/rules/       ← backend-only (DB, API, CRON)
│       └── backend-conventions.mdc
└── mobile/
    └── .cursor/rules/       ← mobile-only (RN, screens, a11y)
        └── mobile-conventions.mdc
```

### 5.4 .cursorignore
Исключи шум из индексации:
```
# .cursorignore
node_modules/
dist/
build/
*.lock
*.log
coverage/
.env*
```

---

## 6. Поддержка документации

### 6.1 Когда обновлять docs
| Событие | Действие |
|---|---|
| Новый endpoint | Обновить API Contract, Appendix D count |
| Новая таблица/колонка | Обновить Data Model, миграция SQL |
| Новый экран | Обновить Navigation, Screen Registry |
| Новый провайдер | Обновить IC, добавить в таблицу провайдеров |
| Новый CRON job | Обновить Spec sec 11, IC sec 8 |
| Любое изменение | Проверить Version Matrix во ВСЕХ 7 docs |

### 6.2 Когда обновлять .mdc правила
| Событие | Действие |
|---|---|
| Новое бизнес-правило | Обновить 000 (conventions) |
| Новая таблица | Обновить 010 (data model), добавить в таблицу |
| Новый endpoint | Обновить 020 (api), пересчитать count |
| Новый провайдер / CRON | Обновить 030 (integrations) |
| Bump версии документа | Обновить 080 (version matrix) |

### 6.3 Версионирование .mdc
Правила версионируются вместе с кодом (git). Каждый bump документа → обновить .mdc → один коммит:
```
chore(rules): sync .mdc rules with docs v1.4.6
```

---

## 7. CI / Quality gates

### 7.1 OpenAPI validation
```yaml
# .github/workflows/ci.yml
- name: Lint OpenAPI
  run: npx @redocly/cli lint openapi.yaml

- name: Breaking change check
  run: npx oasdiff breaking openapi-prev.yaml openapi.yaml

- name: Contract tests
  run: schemathesis run openapi.yaml --base-url=http://localhost:8080
```

### 7.2 DB migration safety
```yaml
- name: Migration lint
  run: squawk src/migrations/*.sql  # zero-downtime check
```

### 7.3 Test coverage targets (MVP)
```
Unit tests:     ≥ 80% line coverage (business logic)
Integration:    All 61 endpoints happy path + main error paths
Contract:       schemathesis against openapi.yaml
E2E:            Critical flows (auth → checkout → payment → tracking)
```

---

## 8. Чеклист перед первым коммитом

- [ ] `.cursor/rules/` содержит 15 .mdc файлов
- [ ] `docs/` содержит 7 consolidated .md файлов
- [ ] `.cursorignore` настроен
- [ ] `openapi.yaml` в корне проекта
- [ ] Cursor Settings → Rules показывает 15 rules, 1 alwaysApply
- [ ] Тестовые команды работают: `/new-endpoint`, `/add-screen`, `/add-cron`
- [ ] Git: `.cursor/rules/` и `docs/` под версионным контролем
- [ ] Git: `.env*` в `.gitignore`

---

## 9. Частые ошибки и как их избежать

### ❌ Ошибка 1: Слишком большой alwaysApply
**Проблема:** Вынесли всё в 000 → съедает tokens на каждый запрос.
**Решение:** 000 ≤ 100 строк. Детали → в glob-файлы 010–060.

### ❌ Ошибка 2: Agent выдумывает данные
**Проблема:** Agent придумал endpoint или таблицу, которой нет в спеке.
**Решение:** В промпте всегда ссылайтесь на конкретный `@docs/...` и секцию.

### ❌ Ошибка 3: Не обновили Version Matrix
**Проблема:** Изменили API Contract, забыли обновить ссылки в остальных 6 docs.
**Решение:** Используйте правило 080 — при любом bump проверяйте все 7 документов.

### ❌ Ошибка 4: Agent меняет не тот файл
**Проблема:** При мультифайловой задаче Agent путает backend и mobile.
**Решение:** Используйте nested `.cursor/rules/` и явно указывайте пути в промпте.

### ❌ Ошибка 5: Kopecks vs рубли
**Проблема:** Agent использует float для денег или путает формат.
**Решение:** 000 явно указывает: backend = kopecks (integer), UI = `/100` comma decimal.

### ❌ Ошибка 6: Agent не знает про state machine
**Проблема:** Agent позволяет cancel из status=ready.
**Решение:** State machine в 000 (alwaysApply) — Agent видит его всегда.

### ❌ Ошибка 7: Забыли cronHealthWrapper
**Проблема:** Новый CRON без мониторинга.
**Решение:** Команда `/add-cron` содержит обязательный чеклист с wrapper.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  КОМАНДЫ В CURSOR CHAT                              │
│                                                     │
│  /new-endpoint  → REST endpoint (11 шагов)          │
│  /add-screen    → React Native screen (10 шагов)    │
│  /add-cron      → CRON job + monitoring (5 шагов)   │
│  /add-ws-event  → WebSocket event (7 шагов)         │
│  /add-push      → Push notification (7 шагов)       │
│  /add-provider  → External integration (7 шагов)    │
│                                                     │
│  ССЫЛКИ НА DOCS                                     │
│                                                     │
│  @docs/Spec_v1.4.5_consolidated.md                  │
│  @docs/API_Contract_v1.4.5_consolidated.md          │
│  @docs/Data_Model_v1.4.11_consolidated.md           │
│  @docs/Navigation_v1.4.5_consolidated.md            │
│  @docs/Integration_Contracts_v1.6.5_consolidated.md │
│  @docs/BNPL_Integration_v1.2.3_consolidated.md      │
│  @docs/Settlement_v1.2.3_consolidated.md            │
│                                                     │
│  ГОРЯЧИЕ КЛАВИШИ                                    │
│                                                     │
│  Cmd+L          → открыть Chat                      │
│  Cmd+I          → открыть Composer (inline edit)    │
│  Cmd+K          → Cmd+K (quick edit in file)        │
│  Cmd+Shift+I    → Agent mode (автономный)           │
│  @               → добавить контекст (file/folder)  │
│  Tab             → принять suggestion               │
│  Esc             → отклонить suggestion              │
└─────────────────────────────────────────────────────┘
```