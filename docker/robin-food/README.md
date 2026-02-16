# Robin Food - Local Supabase Development

Локальная среда разработки Supabase для Robin Food.

## Порты

Используются альтернативные порты, чтобы не конфликтовать с другими проектами:

| Сервис | Порт | URL |
|--------|------|-----|
| **Supabase Studio** | 4000 | http://localhost:4000 |
| **API Gateway (Kong)** | 9000 | http://localhost:9000 |
| **PostgreSQL** | 6432 | `postgresql://postgres:password@localhost:6432/robin_food` |

## Быстрый старт

```bash
# Перейти в папку Docker
cd docker/robin-food

# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

## Доступ

### Supabase Studio (Dashboard)
Откройте http://localhost:4000 в браузере.

### Подключение к базе данных
```bash
psql "postgresql://postgres:robin-food-super-secret-password-2024@localhost:6432/robin_food"
```

### REST API
```bash
# Получить все офферы
curl http://localhost:9000/rest/v1/offers \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

## Ключи API

| Ключ | Значение |
|------|----------|
| **ANON_KEY** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0` |
| **SERVICE_KEY** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU` |

## Структура базы данных

Схема совместима с Yandex Market Partner API:

### Основные таблицы
- `businesses` - Кабинеты (businessId)
- `campaigns` - Магазины (campaignId)
- `warehouses` - Склады
- `categories` - Категории товаров
- `offers` - Товары (ShopSku)
- `offer_prices` - Цены
- `stocks` - Остатки

### Заказы
- `buyers` - Покупатели
- `orders` - Заказы
- `order_deliveries` - Доставка
- `order_items` - Товары в заказе

### Robin Food специфика
- `auto_purchase_subscriptions` - Подписки на автовыкуп
- `discount_tiers` - Скидки по срокам годности

## Управление

```bash
# Остановить все сервисы
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Перезапустить конкретный сервис
docker-compose restart db

# Посмотреть логи конкретного сервиса
docker-compose logs -f db
```

## Интеграция с приложением

Добавьте в `.env` файл вашего приложения:

```env
VITE_SUPABASE_URL=http://localhost:9000
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```
