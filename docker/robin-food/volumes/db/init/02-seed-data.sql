-- =====================================================
-- Robin Food - Seed Data
-- Test data for local development
-- =====================================================

-- Insert test business
INSERT INTO businesses (id, name, inn, legal_name, contact_email, contact_phone) VALUES
(1, 'Магнит', '7703270067', 'ПАО "Магнит"', 'partner@magnit.ru', '+7-800-200-90-02'),
(2, 'Пятёрочка', '7728029110', 'X5 Retail Group', 'partner@x5.ru', '+7-800-555-55-05'),
(3, 'ВкусВилл', '7705958445', 'ООО "ВкусВилл"', 'partner@vkusvill.ru', '+7-495-663-86-38');

-- Insert test campaigns (stores)
INSERT INTO campaigns (id, business_id, name, domain, selling_program) VALUES
-- Магнит
(1, 1, 'Магнит на Комсомольском', 'magnit.ru', 'FBS'),
(2, 1, 'Магнит на Усачевском', 'magnit.ru', 'FBS'),
(3, 1, 'Магнит Космодамианская', 'magnit.ru', 'FBS'),
-- Пятёрочка
(4, 2, 'Пятёрочка Большая Полянка', '5ka.ru', 'FBS'),
(5, 2, 'Пятёрочка Садовническая', '5ka.ru', 'FBS'),
-- ВкусВилл
(6, 3, 'ВкусВилл Павелецкая', 'vkusvill.ru', 'FBS'),
(7, 3, 'ВкусВилл Новокузнецкая', 'vkusvill.ru', 'FBS');

-- Insert warehouses (pickup points)
INSERT INTO warehouses (id, campaign_id, name, address, city, latitude, longitude, is_main) VALUES
(1, 1, 'Магнит Комсомольский', 'Комсомольский проспект, 28', 'Москва', 55.726500, 37.582800, true),
(2, 2, 'Магнит Усачевский', 'ул. Усачева, 29', 'Москва', 55.728000, 37.568000, true),
(3, 3, 'Магнит Космодамианская', 'Космодамианская наб., 4', 'Москва', 55.746500, 37.640700, true),
(4, 4, 'Пятёрочка Большая Полянка', 'ул. Большая Полянка, 7/10', 'Москва', 55.741500, 37.617000, true),
(5, 5, 'Пятёрочка Садовническая', 'Садовническая ул., 54', 'Москва', 55.744000, 37.639000, true),
(6, 6, 'ВкусВилл Павелецкая', 'ул. Павелецкая площадь, 1', 'Москва', 55.729000, 37.638000, true),
(7, 7, 'ВкусВилл Новокузнецкая', 'ул. Пятницкая, 42', 'Москва', 55.738500, 37.627500, true);

-- Insert categories
INSERT INTO categories (id, external_category_id, name, is_leaf) VALUES
(1, 91307, 'Продукты питания', false),
(2, 91308, 'Молочные продукты', true),
(3, 91309, 'Хлеб и выпечка', true),
(4, 91310, 'Мясо и птица', true),
(5, 91311, 'Фрукты и овощи', true),
(6, 91312, 'Напитки', true),
(7, 91313, 'Готовая еда', true),
(8, 91314, 'Замороженные продукты', true);

UPDATE categories SET parent_id = 1 WHERE id > 1;

-- Insert test offers
INSERT INTO offers (id, business_id, offer_id, name, vendor, category_id, 
  shelf_life_value, shelf_life_unit, weight, pictures, is_active) VALUES
-- Молочные продукты
(1, 1, 'MLK-001', 'Молоко Простоквашино 3.2%', 'Простоквашино', 2, 14, 'DAY', 0.93, '["https://example.com/milk.jpg"]', true),
(2, 1, 'YGT-001', 'Йогурт Данон клубника', 'Danone', 2, 21, 'DAY', 0.125, '["https://example.com/yogurt.jpg"]', true),
(3, 2, 'TVR-001', 'Творог Домик в деревне 5%', 'Домик в деревне', 2, 10, 'DAY', 0.2, '["https://example.com/tvorog.jpg"]', true),
(4, 3, 'CHZ-001', 'Сыр Российский', 'Сыроваренный завод', 2, 60, 'DAY', 0.3, '["https://example.com/cheese.jpg"]', true),

-- Хлеб
(5, 1, 'BRD-001', 'Хлеб Бородинский', 'Хлебозавод №1', 3, 5, 'DAY', 0.4, '["https://example.com/bread.jpg"]', true),
(6, 2, 'BRD-002', 'Багет французский', 'Пекарня Коржов', 3, 2, 'DAY', 0.25, '["https://example.com/baguette.jpg"]', true),

-- Мясо
(7, 1, 'CHK-001', 'Куриная грудка охлажденная', 'Мираторг', 4, 5, 'DAY', 0.5, '["https://example.com/chicken.jpg"]', true),
(8, 2, 'SAU-001', 'Сосиски Молочные', 'Черкизово', 4, 15, 'DAY', 0.4, '["https://example.com/sausages.jpg"]', true),

-- Овощи/фрукты
(9, 3, 'APL-001', 'Яблоки Гала', 'Сад Гигант', 5, 14, 'DAY', 1.0, '["https://example.com/apples.jpg"]', true),
(10, 3, 'BNN-001', 'Бананы', 'Chiquita', 5, 7, 'DAY', 1.0, '["https://example.com/bananas.jpg"]', true),

-- Напитки
(11, 1, 'JCE-001', 'Сок Добрый Апельсин', 'Добрый', 6, 180, 'DAY', 1.0, '["https://example.com/juice.jpg"]', true),
(12, 2, 'WTR-001', 'Вода Aqua Minerale', 'PepsiCo', 6, 365, 'DAY', 0.5, '["https://example.com/water.jpg"]', true),

-- Готовая еда
(13, 3, 'SLD-001', 'Салат Цезарь', 'ВкусВилл', 7, 2, 'DAY', 0.3, '["https://example.com/salad.jpg"]', true),
(14, 3, 'SND-001', 'Сэндвич с курицей', 'ВкусВилл', 7, 2, 'DAY', 0.2, '["https://example.com/sandwich.jpg"]', true);

-- Insert prices
INSERT INTO offer_prices (offer_id, campaign_id, value, discount_base, currency, vat) VALUES
(1, 1, 89.90, 109.90, 'RUR', 'VAT_10'),
(2, 1, 59.90, 79.90, 'RUR', 'VAT_10'),
(3, 2, 129.00, 169.00, 'RUR', 'VAT_10'),
(4, 3, 499.00, 649.00, 'RUR', 'VAT_10'),
(5, 1, 49.90, 59.90, 'RUR', 'VAT_10'),
(6, 4, 69.90, 89.90, 'RUR', 'VAT_10'),
(7, 1, 349.00, 449.00, 'RUR', 'VAT_10'),
(8, 5, 199.00, 269.00, 'RUR', 'VAT_10'),
(9, 3, 149.00, 189.00, 'RUR', 'VAT_10'),
(10, 6, 89.00, 109.00, 'RUR', 'VAT_10'),
(11, 1, 129.00, 159.00, 'RUR', 'VAT_20'),
(12, 4, 49.00, 59.00, 'RUR', 'VAT_20'),
(13, 6, 299.00, 399.00, 'RUR', 'VAT_10'),
(14, 7, 199.00, 279.00, 'RUR', 'VAT_10');

-- Insert stocks with expiration dates
INSERT INTO stocks (offer_id, warehouse_id, fit_count, available_count, expiration_date, production_date) VALUES
-- Products expiring soon (for food waste discounts)
(1, 1, 50, 45, CURRENT_DATE + 3, CURRENT_DATE - 11),
(2, 1, 100, 90, CURRENT_DATE + 5, CURRENT_DATE - 16),
(3, 2, 30, 25, CURRENT_DATE + 2, CURRENT_DATE - 8),
(4, 3, 20, 18, CURRENT_DATE + 30, CURRENT_DATE - 30),
(5, 1, 40, 35, CURRENT_DATE + 1, CURRENT_DATE - 4),
(6, 4, 25, 20, CURRENT_DATE + 1, CURRENT_DATE - 1),
(7, 1, 15, 12, CURRENT_DATE + 2, CURRENT_DATE - 3),
(8, 5, 60, 55, CURRENT_DATE + 7, CURRENT_DATE - 8),
(9, 3, 80, 75, CURRENT_DATE + 10, CURRENT_DATE - 4),
(10, 6, 100, 95, CURRENT_DATE + 4, CURRENT_DATE - 3),
(11, 1, 200, 180, CURRENT_DATE + 120, CURRENT_DATE - 60),
(12, 4, 300, 290, CURRENT_DATE + 300, CURRENT_DATE - 65),
(13, 6, 10, 8, CURRENT_DATE + 1, CURRENT_DATE),
(14, 7, 15, 12, CURRENT_DATE + 1, CURRENT_DATE);

-- Insert discount tiers
INSERT INTO discount_tiers (campaign_id, days_before_expiry_min, days_before_expiry_max, discount_percent, is_active) VALUES
-- Default tiers for all campaigns
(NULL, 0, 1, 70.00, true),   -- Last day: 70% off
(NULL, 2, 3, 50.00, true),   -- 2-3 days: 50% off
(NULL, 4, 7, 30.00, true),   -- 4-7 days: 30% off
(NULL, 8, 14, 20.00, true);  -- 8-14 days: 20% off

-- Insert a test buyer
INSERT INTO buyers (id, uuid, first_name, last_name, phone, email, buyer_type) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Александр', 'Тестов', '+79991234567', 'test@robinfood.ru', 'PERSON');

-- Reset sequences
SELECT setval('businesses_id_seq', (SELECT MAX(id) FROM businesses));
SELECT setval('campaigns_id_seq', (SELECT MAX(id) FROM campaigns));
SELECT setval('warehouses_id_seq', (SELECT MAX(id) FROM warehouses));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('offers_id_seq', (SELECT MAX(id) FROM offers));
SELECT setval('offer_prices_id_seq', (SELECT MAX(id) FROM offer_prices));
SELECT setval('stocks_id_seq', (SELECT MAX(id) FROM stocks));
SELECT setval('discount_tiers_id_seq', (SELECT MAX(id) FROM discount_tiers));
SELECT setval('buyers_id_seq', (SELECT MAX(id) FROM buyers));
