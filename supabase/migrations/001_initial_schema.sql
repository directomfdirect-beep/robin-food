-- ============================================
-- Robin Food Database Schema
-- Based on Yandex Eda Vendor API Structure
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. VENDORS (Партнеры/Магазины)
-- Совместимо с Yandex Eda API: /restaurants
-- ============================================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64) UNIQUE NOT NULL, -- ID в системе партнера (для интеграции)
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    
    -- Координаты
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Контакты
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- График работы (JSON формат как в Yandex API)
    working_hours JSONB DEFAULT '[]'::jsonb,
    
    -- Статус
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    block_reason TEXT,
    blocked_at TIMESTAMPTZ,
    blocked_until TIMESTAMPTZ,
    
    -- Настройки
    pickup_time_minutes INTEGER DEFAULT 15, -- Время сборки заказа
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Изображения
    logo_url TEXT,
    cover_url TEXT,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendors_location ON vendors USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_vendors_active ON vendors (is_active) WHERE is_active = true;

-- ============================================
-- 2. CATEGORIES (Категории меню)
-- Совместимо с Yandex Eda API: categories[]
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64) NOT NULL, -- ID в системе партнера
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Изображение
    image_url TEXT,
    image_updated_at TIMESTAMPTZ,
    
    -- Сортировка и отображение
    sort_order INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    
    -- Расписание доступности (JSON)
    schedules JSONB DEFAULT '[]'::jsonb,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(vendor_id, external_id)
);

CREATE INDEX idx_categories_vendor ON categories (vendor_id);
CREATE INDEX idx_categories_parent ON categories (parent_id);

-- ============================================
-- 3. ITEMS (Товары/Блюда)
-- Совместимо с Yandex Eda API: items[]
-- ============================================
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64) NOT NULL, -- ID в системе партнера
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    
    -- Основная информация
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Цены
    price DECIMAL(10, 2) NOT NULL, -- Текущая цена
    original_price DECIMAL(10, 2), -- Оригинальная цена (до скидки)
    vat INTEGER DEFAULT 0, -- НДС в процентах
    
    -- Измерения (Yandex Eda format)
    measure INTEGER, -- Вес/объем
    measure_unit VARCHAR(10) CHECK (measure_unit IN ('г', 'мл', 'g', 'ml', 'шт')),
    is_catchweight BOOLEAN DEFAULT false, -- Весовой товар
    weight_quantum DECIMAL(10, 3), -- Минимальный квант для весового товара
    
    -- Питательность (КБЖУ)
    calories DECIMAL(10, 2),
    proteins DECIMAL(10, 2),
    fats DECIMAL(10, 2),
    carbohydrates DECIMAL(10, 2),
    
    -- Изображения (JSON массив)
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Штрихкод
    barcode VARCHAR(50),
    
    -- Срок годности (для food waste)
    shelf_life_days INTEGER, -- Общий срок годности
    expiry_date DATE, -- Конкретная дата истечения (для партии)
    days_until_expiry INTEGER GENERATED ALWAYS AS (expiry_date - CURRENT_DATE) STORED,
    
    -- Скидки по времени (Robin Food специфика)
    discount_percent INTEGER DEFAULT 0,
    discount_starts_at TIMESTAMPTZ,
    discount_ends_at TIMESTAMPTZ,
    
    -- Остатки
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    
    -- Дополнительные описания (Yandex format)
    ingredients JSONB DEFAULT '[]'::jsonb, -- consisting_ingredients
    badges JSONB DEFAULT '[]'::jsonb, -- food_specifics, spiciness, etc.
    
    -- Возрастные ограничения
    age_restriction INTEGER, -- 18, 21 или null
    alcohol_percentage DECIMAL(5, 2),
    
    -- Акциз
    excise VARCHAR(20), -- 'sugary_drink', 'other'
    
    -- Сортировка
    sort_order INTEGER DEFAULT 100,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ, -- Последняя синхронизация с партнером
    
    UNIQUE(vendor_id, external_id)
);

CREATE INDEX idx_items_vendor ON items (vendor_id);
CREATE INDEX idx_items_category ON items (category_id);
CREATE INDEX idx_items_available ON items (is_available) WHERE is_available = true;
CREATE INDEX idx_items_expiry ON items (expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_items_discount ON items (discount_percent) WHERE discount_percent > 0;
CREATE INDEX idx_items_barcode ON items (barcode) WHERE barcode IS NOT NULL;

-- ============================================
-- 4. MODIFIER_GROUPS (Группы модификаторов)
-- Совместимо с Yandex Eda API: modifierGroups[]
-- ============================================
CREATE TABLE modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64) NOT NULL,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    
    -- Ограничения выбора
    min_selected INTEGER DEFAULT 0,
    max_selected INTEGER DEFAULT 255,
    
    sort_order INTEGER DEFAULT 100,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(item_id, external_id)
);

CREATE INDEX idx_modifier_groups_item ON modifier_groups (item_id);

-- ============================================
-- 5. MODIFIERS (Модификаторы)
-- Совместимо с Yandex Eda API: modifiers[]
-- ============================================
CREATE TABLE modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64) NOT NULL,
    group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    original_price DECIMAL(10, 2),
    vat INTEGER DEFAULT 0,
    
    -- Ограничения количества
    min_amount INTEGER DEFAULT 0,
    max_amount INTEGER DEFAULT 255,
    
    is_available BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(group_id, external_id)
);

CREATE INDEX idx_modifiers_group ON modifiers (group_id);

-- ============================================
-- 6. USERS (Пользователи)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Аутентификация (Supabase Auth)
    auth_id UUID UNIQUE, -- Ссылка на auth.users
    
    -- Контакты
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    
    -- Профиль
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    
    -- Платежные данные (хранятся токены, не сами карты)
    payment_tokens JSONB DEFAULT '[]'::jsonb,
    default_payment_token VARCHAR(255),
    
    -- Избранное
    favorite_items UUID[] DEFAULT '{}',
    favorite_vendors UUID[] DEFAULT '{}',
    
    -- Настройки
    notifications_enabled BOOLEAN DEFAULT true,
    push_token TEXT,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users (phone);
CREATE INDEX idx_users_auth ON users (auth_id);

-- ============================================
-- 7. USER_ADDRESSES (Адреса пользователей)
-- ============================================
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    label VARCHAR(50), -- 'Дом', 'Работа', etc.
    address TEXT NOT NULL,
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    entrance VARCHAR(20),
    floor VARCHAR(20),
    apartment VARCHAR(20),
    intercom VARCHAR(50),
    comment TEXT,
    
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_addresses_user ON user_addresses (user_id);

-- ============================================
-- 8. ORDERS (Заказы)
-- Совместимо с Yandex Eda API: orders
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Идентификаторы
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Человекочитаемый номер (XXXXXX-XXXXXXXX)
    eats_id VARCHAR(20), -- ID в Yandex Eda (для интеграции)
    
    -- Участники
    user_id UUID NOT NULL REFERENCES users(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    
    -- Тип заказа
    order_type VARCHAR(20) DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery', 'marketplace')),
    
    -- Статус
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Ожидает подтверждения
        'confirmed',    -- Подтвержден
        'preparing',    -- Готовится
        'ready',        -- Готов к выдаче
        'picked_up',    -- Забран
        'delivering',   -- Доставляется
        'delivered',    -- Доставлен
        'cancelled',    -- Отменен
        'refunded'      -- Возврат
    )),
    
    -- Суммы
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    promo_discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Промокод
    promo_code VARCHAR(50),
    
    -- Оплата
    payment_method VARCHAR(30), -- 'card', 'cash', 'apple_pay', etc.
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'processing', 'paid', 'failed', 'refunded'
    )),
    payment_id VARCHAR(255), -- ID транзакции в платежной системе
    
    -- Адрес доставки (для delivery)
    delivery_address JSONB,
    
    -- Время
    estimated_ready_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Комментарии
    customer_comment TEXT,
    cancellation_reason TEXT,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Платформа
    platform VARCHAR(10) DEFAULT 'RF' CHECK (platform IN ('RF', 'YE', 'DC')) -- Robin Food, Yandex Eda, Delivery Club
);

CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_vendor ON orders (vendor_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created ON orders (created_at DESC);
CREATE INDEX idx_orders_number ON orders (order_number);

-- ============================================
-- 9. ORDER_ITEMS (Позиции заказа)
-- Совместимо с Yandex Eda API: order.items[]
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id),
    
    -- Копия данных на момент заказа
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Цена за единицу
    quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
    
    -- Итого
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Модификаторы (JSON копия выбранных)
    modifiers JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_item ON order_items (item_id);

-- ============================================
-- 10. SUBSCRIPTIONS (Подписки на автовыкуп)
-- Robin Food специфика
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Настройки
    is_active BOOLEAN DEFAULT true,
    discount_threshold INTEGER NOT NULL DEFAULT 30, -- Минимальная скидка %
    frequency VARCHAR(20) DEFAULT 'full_cart' CHECK (frequency IN (
        'when_available', -- Выкупать по мере появления
        'full_cart',      -- Когда все товары доступны
        'weekly'          -- Раз в неделю
    )),
    
    -- Товары для отслеживания (JSON)
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Формат: [{ "item_id": "uuid", "vendor_id": "uuid", "quantity": 1 }]
    
    -- Статистика
    last_checked_at TIMESTAMPTZ,
    last_purchased_at TIMESTAMPTZ,
    total_purchases INTEGER DEFAULT 0,
    total_saved DECIMAL(10, 2) DEFAULT 0,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions (is_active) WHERE is_active = true;

-- ============================================
-- 11. REVIEWS (Отзывы)
-- Совместимо с Yandex Eda API: /v1/feedback
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(64), -- ID в Yandex Eda
    
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    
    -- Оценка
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Текст
    predefined_comment TEXT, -- Шаблонные комментарии
    comment TEXT,
    
    -- Ответ партнера
    reply TEXT,
    replied_at TIMESTAMPTZ,
    
    -- Промокод от партнера
    promo_percent INTEGER,
    
    -- Метаданные
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_order ON reviews (order_id);
CREATE INDEX idx_reviews_vendor ON reviews (vendor_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);

-- ============================================
-- 12. NOTIFICATIONS (Уведомления)
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(30) NOT NULL, -- 'order', 'delivery', 'subscription', 'promo', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Ссылка на связанную сущность
    related_type VARCHAR(30), -- 'order', 'item', 'vendor'
    related_id UUID,
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = false;

-- ============================================
-- 13. PROMO_CODES (Промокоды)
-- ============================================
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Тип скидки
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Ограничения
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    
    -- Привязка
    vendor_id UUID REFERENCES vendors(id), -- null = для всех
    
    -- Срок действия
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT true,
    
    -- Статистика
    times_used INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes (code);
CREATE INDEX idx_promo_codes_active ON promo_codes (is_active, valid_until);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для updated_at
CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Функция генерации номера заказа
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = CONCAT(
        TO_CHAR(NOW(), 'YYMMDD'),
        '-',
        LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Включаем RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Политики для users
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = auth_id);

-- Политики для orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Политики для subscriptions
CREATE POLICY "Users can manage own subscriptions"
    ON subscriptions FOR ALL
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Политики для notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============================================
-- VIEWS (Представления)
-- ============================================

-- Товары со скидками (для каталога)
CREATE VIEW discounted_items AS
SELECT 
    i.*,
    v.name as vendor_name,
    v.address as vendor_address,
    c.name as category_name,
    ROUND(((i.original_price - i.price) / i.original_price * 100)::numeric, 0) as calculated_discount
FROM items i
JOIN vendors v ON i.vendor_id = v.id
JOIN categories c ON i.category_id = c.id
WHERE i.is_available = true
  AND i.discount_percent > 0
  AND v.is_active = true
  AND v.is_blocked = false
ORDER BY i.discount_percent DESC, i.days_until_expiry ASC NULLS LAST;

-- Активные заказы пользователя
CREATE VIEW active_orders AS
SELECT 
    o.*,
    v.name as vendor_name,
    v.address as vendor_address,
    v.phone as vendor_phone
FROM orders o
JOIN vendors v ON o.vendor_id = v.id
WHERE o.status NOT IN ('delivered', 'cancelled', 'refunded', 'picked_up')
ORDER BY o.created_at DESC;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE vendors IS 'Партнеры/магазины. Совместимо с Yandex Eda API restaurants.';
COMMENT ON TABLE items IS 'Товары/блюда. Совместимо с Yandex Eda API menu items.';
COMMENT ON TABLE orders IS 'Заказы. Совместимо с Yandex Eda API orders.';
COMMENT ON TABLE subscriptions IS 'Подписки на автовыкуп товаров (Robin Food специфика).';

COMMENT ON COLUMN items.external_id IS 'ID товара в системе партнера для интеграции с Yandex Eda';
COMMENT ON COLUMN items.expiry_date IS 'Дата истечения срока годности для конкретной партии товара';
COMMENT ON COLUMN items.days_until_expiry IS 'Автоматически вычисляемое количество дней до истечения срока';
COMMENT ON COLUMN orders.eats_id IS 'ID заказа в Yandex Eda (формат XXXXXX-XXXXXXXX)';
