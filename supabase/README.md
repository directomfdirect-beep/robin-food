# Robin Food - Supabase Database Schema

База данных Robin Food для интеграции с ритейл-партнёрами.

## Структура схемы

### Основные сущности

| Таблица | Описание |
|---------|----------|
| `businesses` | Кабинеты продавцов |
| `campaigns` | Магазины/кампании |
| `warehouses` | Склады |
| `categories` | Категории товаров |
| `offers` | Товарные предложения (SKU) |
| `offer_prices` | Цены |
| `stocks` | Остатки на складах |
| `orders` | Заказы |
| `order_items` | Товары в заказах |
| `order_deliveries` | Доставка |
| `buyers` | Покупатели |
| `promos` | Акции |

### Специфичные таблицы Robin Food

| Таблица | Описание |
|---------|----------|
| `auto_purchase_subscriptions` | Подписки на автоматический выкуп товаров |
| `discount_tiers` | Градация скидок по срокам годности |

## Основные поля товаров (offers)

```sql
-- Идентификаторы
offer_id       -- Ваш SKU
external_sku   -- SKU во внешней системе

-- Сроки годности (ключевое для food waste)
shelf_life_value    -- Значение срока годности
shelf_life_unit     -- Единица (HOUR, DAY, WEEK, MONTH, YEAR)
shelf_life_comment  -- Условия хранения

-- Габариты и вес
weight, length, width, height

-- Штрихкоды (JSONB массив)
barcodes -- ["4601230000000"]
```

## Остатки (stocks)

```sql
fit_count        -- Годный товар
available_count  -- Доступен к продаже
freeze_count     -- Зарезервирован
quarantine_count -- На карантине
defect_count     -- Брак
expired_count    -- Просрочен

expiration_date  -- Дата истечения срока годности
```

## Заказы (orders)

Статусы:
- `PLACING` - оформляется
- `PROCESSING` - в обработке
- `DELIVERY` - передан в доставку
- `PICKUP` - в пункте выдачи
- `DELIVERED` - доставлен
- `CANCELLED` - отменён

## Функции

### Расчёт скидки по сроку годности

```sql
SELECT calculate_expiry_discount(
  '2024-02-10'::DATE,  -- expiration_date
  1,                    -- campaign_id
  NULL                  -- category_id (optional)
);
```

## Представления (Views)

### v_available_offers
Доступные товары с ценами и остатками:
```sql
SELECT * FROM v_available_offers 
WHERE total_stock > 0 
ORDER BY nearest_expiration;
```

### v_orders_with_delivery
Заказы с информацией о доставке:
```sql
SELECT * FROM v_orders_with_delivery 
WHERE status = 'PROCESSING';
```

## Применение миграции

```bash
# Через Supabase CLI
supabase db push

# Или напрямую в SQL Editor Supabase
# Скопируйте содержимое migrations/001_robin_food_schema.sql
```

## Пример данных

```sql
-- Создание бизнеса
INSERT INTO businesses (name, inn) 
VALUES ('ООО Ритейл', '7707083893');

-- Создание магазина
INSERT INTO campaigns (business_id, name, selling_program) 
VALUES (1, 'Магнит Экспресс', 'FBS');

-- Добавление товара
INSERT INTO offers (
  business_id, 
  offer_id, 
  name, 
  shelf_life_value, 
  shelf_life_unit
) VALUES (
  1, 
  'MILK-001', 
  'Молоко 3.2% 1л', 
  14, 
  'DAY'
);

-- Добавление остатков с датой истечения
INSERT INTO stocks (
  offer_id, 
  warehouse_id, 
  available_count, 
  expiration_date
) VALUES (
  1, 
  1, 
  50, 
  '2024-02-15'
);
```

## Настройка скидок по срокам годности

```sql
-- Скидки для продуктов с истекающим сроком
INSERT INTO discount_tiers (campaign_id, days_before_expiry_min, days_before_expiry_max, discount_percent) VALUES
(1, 0, 1, 70),   -- 0-1 день: 70% скидка
(1, 2, 3, 50),   -- 2-3 дня: 50% скидка
(1, 4, 7, 30),   -- 4-7 дней: 30% скидка
(1, 8, 14, 20);  -- 8-14 дней: 20% скидка
```

## RLS (Row Level Security)

RLS включен на всех основных таблицах. Настройте политики в соответствии с вашей системой аутентификации:

```sql
CREATE POLICY "Users can view their business data" ON offers
  FOR SELECT USING (business_id IN (
    SELECT business_id FROM user_businesses WHERE user_id = auth.uid()
  ));
```
