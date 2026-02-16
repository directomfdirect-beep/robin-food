-- =====================================================
-- Robin Food Database Schema
-- Retail Partner Integration API
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Currency types
CREATE TYPE currency_type AS ENUM (
  'RUR', 'USD', 'EUR', 'UAH', 'BYR', 'KZT', 'UZS'
);

-- Time unit types (for shelf life, warranty, etc.)
CREATE TYPE time_unit_type AS ENUM (
  'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'
);

-- Offer condition types
CREATE TYPE offer_condition_type AS ENUM (
  'PREOWNED', 'SHOWCASESAMPLE', 'REFURBISHED', 'REDUCTION', 'RENOVATED', 'NOT_SPECIFIED'
);

-- Offer condition quality types
CREATE TYPE offer_condition_quality_type AS ENUM (
  'PERFECT', 'EXCELLENT', 'GOOD', 'NOT_SPECIFIED'
);

-- Offer types
CREATE TYPE offer_type AS ENUM (
  'DEFAULT', 'MEDICINE', 'BOOK', 'AUDIOBOOK', 'ARTIST_TITLE', 'ON_DEMAND', 'ALCOHOL'
);

-- VAT types
CREATE TYPE vat_type AS ENUM (
  'NO_VAT', 'VAT_0', 'VAT_10', 'VAT_10_110', 'VAT_20', 'VAT_20_120', 
  'VAT_18', 'VAT_18_118', 'VAT_12', 'VAT_05', 'VAT_07', 'VAT_22', 'UNKNOWN_VALUE'
);

-- Order status types
CREATE TYPE order_status_type AS ENUM (
  'PLACING', 'RESERVED', 'UNPAID', 'PROCESSING', 'DELIVERY', 
  'PICKUP', 'DELIVERED', 'CANCELLED', 'PENDING', 
  'PARTIALLY_RETURNED', 'RETURNED', 'UNKNOWN'
);

-- Order substatus types
CREATE TYPE order_substatus_type AS ENUM (
  'STARTED', 'READY_TO_SHIP', 'SHIPPED', 'RESERVATION_EXPIRED', 
  'USER_NOT_PAID', 'USER_UNREACHABLE', 'USER_CHANGED_MIND', 
  'USER_REFUSED_DELIVERY', 'USER_REFUSED_PRODUCT', 'SHOP_FAILED', 
  'USER_REFUSED_QUALITY', 'REPLACING_ORDER', 'PICKUP_EXPIRED', 
  'DELIVERY_SERVICE_UNDELIVERED', 'CANCELLED_COURIER_NOT_FOUND', 
  'USER_WANTS_TO_CHANGE_DELIVERY_DATE', 'UNKNOWN'
);

-- Payment type
CREATE TYPE payment_type AS ENUM (
  'PREPAID', 'POSTPAID', 'UNKNOWN'
);

-- Payment method
CREATE TYPE payment_method_type AS ENUM (
  'CASH_ON_DELIVERY', 'CARD_ON_DELIVERY', 'ONLINE', 
  'CREDIT', 'TINKOFF_CREDIT', 'SBP', 'UNKNOWN'
);

-- Delivery type
CREATE TYPE delivery_type AS ENUM (
  'DELIVERY', 'PICKUP', 'POST', 'DIGITAL', 'UNKNOWN'
);

-- Delivery dispatch type
CREATE TYPE delivery_dispatch_type AS ENUM (
  'BUYER', 'BRANDED_OUTLET', 'SHOP_OUTLET', 'UNKNOWN'
);

-- Buyer type
CREATE TYPE buyer_type AS ENUM (
  'PERSON', 'BUSINESS'
);

-- Stock type
CREATE TYPE stock_type AS ENUM (
  'FIT', 'FREEZE', 'AVAILABLE', 'QUARANTINE', 'UTILIZATION', 'DEFECT', 'EXPIRED'
);

-- Selling program type
CREATE TYPE selling_program_type AS ENUM (
  'FBY', 'FBS', 'DBS', 'EXPRESS'
);

-- Promo type
CREATE TYPE promo_type AS ENUM (
  'DIRECT_DISCOUNT', 'BUNDLE', 'FLASH_SALE', 'COUPON', 
  'PROMOCODE', 'PLATFORM_PROMO', 'CHEAPEST_AS_GIFT', 
  'CASHBACK', 'SPREAD_DISCOUNT_COUNT', 'SPREAD_DISCOUNT_RECEIPT', 
  'DISCOUNT_BY_PAYMENT_TYPE', 'PERCENT_DISCOUNT', 'UNKNOWN'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Businesses (Кабинеты)
CREATE TABLE businesses (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  inn VARCHAR(12),
  ogrn VARCHAR(15),
  legal_name VARCHAR(500),
  legal_address TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns/Shops (Магазины)
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  selling_program selling_program_type DEFAULT 'FBS',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_business ON campaigns(business_id);

-- Warehouses (Склады)
CREATE TABLE warehouses (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(255),
  region VARCHAR(255),
  postcode VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_warehouses_campaign ON warehouses(campaign_id);

-- Categories (Категории)
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  external_category_id BIGINT UNIQUE, -- External category ID for integrations
  parent_id BIGINT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  full_path TEXT,
  is_leaf BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_external ON categories(external_category_id);

-- =====================================================
-- OFFERS (ТОВАРЫ)
-- =====================================================

CREATE TABLE offers (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  offer_id VARCHAR(255) NOT NULL, -- SKU
  external_sku BIGINT, -- External platform SKU
  category_id BIGINT REFERENCES categories(id),
  group_id VARCHAR(255),
  
  name VARCHAR(500) NOT NULL,
  description TEXT,
  vendor VARCHAR(255),
  vendor_code VARCHAR(255),
  
  barcodes JSONB DEFAULT '[]',
  pictures JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  
  weight DECIMAL(10, 4),
  length DECIMAL(10, 2),
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  
  shelf_life_value INTEGER,
  shelf_life_unit time_unit_type,
  shelf_life_comment VARCHAR(500),
  
  life_time_value INTEGER,
  life_time_unit time_unit_type,
  life_time_comment VARCHAR(500),
  
  guarantee_period_value INTEGER,
  guarantee_period_unit time_unit_type,
  guarantee_period_comment VARCHAR(500),
  
  manufacturer_countries JSONB DEFAULT '[]',
  
  condition_type offer_condition_type,
  condition_quality offer_condition_quality_type,
  condition_reason TEXT,
  
  offer_type offer_type DEFAULT 'DEFAULT',
  is_downloadable BOOLEAN DEFAULT false,
  is_adult BOOLEAN DEFAULT false,
  box_count INTEGER DEFAULT 1,
  
  age_value INTEGER,
  age_unit time_unit_type,
  
  tags JSONB DEFAULT '[]',
  params JSONB DEFAULT '[]',
  
  customs_commodity_code VARCHAR(20),
  certificates JSONB DEFAULT '[]',
  
  is_archived BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_offer_per_business UNIQUE (business_id, offer_id)
);

CREATE INDEX idx_offers_business ON offers(business_id);
CREATE INDEX idx_offers_offer_id ON offers(offer_id);
CREATE INDEX idx_offers_external_sku ON offers(external_sku);
CREATE INDEX idx_offers_category ON offers(category_id);
CREATE INDEX idx_offers_vendor ON offers(vendor);
CREATE INDEX idx_offers_archived ON offers(is_archived);
CREATE INDEX idx_offers_barcodes ON offers USING GIN (barcodes);
CREATE INDEX idx_offers_tags ON offers USING GIN (tags);

-- =====================================================
-- PRICES (ЦЕНЫ)
-- =====================================================

CREATE TABLE offer_prices (
  id BIGSERIAL PRIMARY KEY,
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  campaign_id BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
  
  value DECIMAL(12, 2) NOT NULL,
  currency currency_type DEFAULT 'RUR',
  
  discount_base DECIMAL(12, 2),
  purchase_price DECIMAL(12, 2),
  additional_expenses DECIMAL(12, 2),
  
  vat vat_type DEFAULT 'VAT_20',
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_offer_campaign_price UNIQUE (offer_id, campaign_id)
);

CREATE INDEX idx_offer_prices_offer ON offer_prices(offer_id);
CREATE INDEX idx_offer_prices_campaign ON offer_prices(campaign_id);

-- =====================================================
-- STOCKS (ОСТАТКИ)
-- =====================================================

CREATE TABLE stocks (
  id BIGSERIAL PRIMARY KEY,
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  
  fit_count INTEGER DEFAULT 0,
  available_count INTEGER DEFAULT 0,
  freeze_count INTEGER DEFAULT 0,
  quarantine_count INTEGER DEFAULT 0,
  defect_count INTEGER DEFAULT 0,
  expired_count INTEGER DEFAULT 0,
  
  expiration_date DATE,
  production_date DATE,
  
  turnover_days DECIMAL(10, 2),
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_stock_per_warehouse UNIQUE (offer_id, warehouse_id)
);

CREATE INDEX idx_stocks_offer ON stocks(offer_id);
CREATE INDEX idx_stocks_warehouse ON stocks(warehouse_id);
CREATE INDEX idx_stocks_expiration ON stocks(expiration_date);

-- =====================================================
-- BUYERS (ПОКУПАТЕЛИ)
-- =====================================================

CREATE TABLE buyers (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  external_id VARCHAR(255), -- External buyer ID
  
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  middle_name VARCHAR(255),
  
  phone VARCHAR(50),
  email VARCHAR(255),
  
  buyer_type buyer_type DEFAULT 'PERSON',
  
  company_name VARCHAR(500),
  company_inn VARCHAR(12),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_buyers_external ON buyers(external_id);
CREATE INDEX idx_buyers_phone ON buyers(phone);
CREATE INDEX idx_buyers_email ON buyers(email);

-- =====================================================
-- ORDERS (ЗАКАЗЫ)
-- =====================================================

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  buyer_id BIGINT REFERENCES buyers(id),
  
  external_order_id VARCHAR(255),
  platform_order_id BIGINT, -- External platform order ID
  
  status order_status_type DEFAULT 'PROCESSING',
  substatus order_substatus_type,
  
  currency currency_type DEFAULT 'RUR',
  items_total DECIMAL(12, 2) DEFAULT 0,
  delivery_total DECIMAL(12, 2) DEFAULT 0,
  buyer_total DECIMAL(12, 2) DEFAULT 0,
  buyer_items_total_before_discount DECIMAL(12, 2),
  
  payment_type payment_type DEFAULT 'POSTPAID',
  payment_method payment_method_type,
  is_paid BOOLEAN DEFAULT false,
  
  is_fake BOOLEAN DEFAULT false,
  cancel_requested BOOLEAN DEFAULT false,
  
  notes TEXT,
  
  creation_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_campaign ON orders(campaign_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_platform_id ON orders(platform_order_id);
CREATE INDEX idx_orders_created ON orders(creation_date);

-- =====================================================
-- ORDER DELIVERY (ДОСТАВКА)
-- =====================================================

CREATE TABLE order_deliveries (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  delivery_type delivery_type DEFAULT 'DELIVERY',
  dispatch_type delivery_dispatch_type,
  
  delivery_service_id BIGINT,
  service_name VARCHAR(255),
  price DECIMAL(12, 2),
  
  from_date DATE,
  to_date DATE,
  from_time TIME,
  to_time TIME,
  real_delivery_date DATE,
  shipment_date DATE,
  
  country VARCHAR(100),
  region VARCHAR(255),
  city VARCHAR(255),
  district VARCHAR(255),
  street VARCHAR(255),
  house VARCHAR(50),
  block VARCHAR(50),
  building VARCHAR(50),
  entrance VARCHAR(20),
  floor VARCHAR(20),
  apartment VARCHAR(50),
  postcode VARCHAR(20),
  
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  recipient_name VARCHAR(500),
  recipient_phone VARCHAR(50),
  
  outlet_code VARCHAR(255),
  outlet_storage_limit_date DATE,
  
  tracks JSONB DEFAULT '[]',
  
  is_estimated BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_deliveries_order ON order_deliveries(order_id);

-- =====================================================
-- ORDER ITEMS (ТОВАРЫ В ЗАКАЗЕ)
-- =====================================================

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  offer_id BIGINT REFERENCES offers(id),
  
  shop_sku VARCHAR(255) NOT NULL,
  offer_name VARCHAR(500),
  
  count INTEGER NOT NULL DEFAULT 1,
  
  price DECIMAL(12, 2) NOT NULL,
  buyer_price DECIMAL(12, 2),
  buyer_price_before_discount DECIMAL(12, 2),
  price_before_discount DECIMAL(12, 2),
  
  vat vat_type,
  
  subsidy DECIMAL(12, 2) DEFAULT 0,
  
  partner_warehouse_id BIGINT REFERENCES warehouses(id),
  
  promos JSONB DEFAULT '[]',
  instances JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_offer ON order_items(offer_id);
CREATE INDEX idx_order_items_sku ON order_items(shop_sku);

-- =====================================================
-- PROMOS (АКЦИИ)
-- =====================================================

CREATE TABLE promos (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  
  platform_promo_id VARCHAR(255),
  shop_promo_id VARCHAR(255),
  
  promo_type promo_type NOT NULL,
  name VARCHAR(500),
  description TEXT,
  
  discount_value DECIMAL(10, 2),
  discount_percent DECIMAL(5, 2),
  
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promos_campaign ON promos(campaign_id);
CREATE INDEX idx_promos_platform_id ON promos(platform_promo_id);
CREATE INDEX idx_promos_dates ON promos(start_date, end_date);

-- =====================================================
-- PROMO OFFERS (ТОВАРЫ В АКЦИИ)
-- =====================================================

CREATE TABLE promo_offers (
  id BIGSERIAL PRIMARY KEY,
  promo_id BIGINT NOT NULL REFERENCES promos(id) ON DELETE CASCADE,
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  
  discount_value DECIMAL(10, 2),
  discount_percent DECIMAL(5, 2),
  promo_price DECIMAL(12, 2),
  
  CONSTRAINT unique_promo_offer UNIQUE (promo_id, offer_id)
);

CREATE INDEX idx_promo_offers_promo ON promo_offers(promo_id);
CREATE INDEX idx_promo_offers_offer ON promo_offers(offer_id);

-- =====================================================
-- ROBIN FOOD SPECIFIC TABLES
-- =====================================================

-- Auto-purchase subscriptions
CREATE TABLE auto_purchase_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  buyer_id BIGINT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  
  is_enabled BOOLEAN DEFAULT true,
  discount_threshold INTEGER DEFAULT 20,
  frequency VARCHAR(50) DEFAULT 'when_available',
  
  subscribed_items JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auto_purchase_buyer ON auto_purchase_subscriptions(buyer_id);

-- Discount tiers (Food waste discounts)
CREATE TABLE discount_tiers (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES campaigns(id) ON DELETE CASCADE,
  
  days_before_expiry_min INTEGER NOT NULL,
  days_before_expiry_max INTEGER,
  
  discount_percent DECIMAL(5, 2) NOT NULL,
  
  category_id BIGINT REFERENCES categories(id),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discount_tiers_campaign ON discount_tiers(campaign_id);
CREATE INDEX idx_discount_tiers_days ON discount_tiers(days_before_expiry_min);

-- =====================================================
-- VIEWS
-- =====================================================

CREATE VIEW v_available_offers AS
SELECT 
  o.id,
  o.offer_id AS sku,
  o.name,
  o.vendor,
  o.description,
  o.pictures,
  c.name AS category_name,
  op.value AS price,
  op.discount_base AS original_price,
  op.currency,
  COALESCE(SUM(s.available_count), 0) AS total_stock,
  MIN(s.expiration_date) AS nearest_expiration,
  o.shelf_life_value,
  o.shelf_life_unit,
  o.updated_at
FROM offers o
LEFT JOIN categories c ON o.category_id = c.id
LEFT JOIN offer_prices op ON o.id = op.offer_id
LEFT JOIN stocks s ON o.id = s.offer_id
WHERE o.is_active = true 
  AND o.is_archived = false
GROUP BY o.id, c.name, op.value, op.discount_base, op.currency;

CREATE VIEW v_orders_with_delivery AS
SELECT 
  o.id,
  o.platform_order_id,
  o.status,
  o.substatus,
  o.buyer_total,
  o.currency,
  o.payment_type,
  o.creation_date,
  b.first_name,
  b.last_name,
  b.phone,
  d.delivery_type,
  d.city,
  d.street,
  d.house,
  d.from_date AS delivery_date
FROM orders o
LEFT JOIN buyers b ON o.buyer_id = b.id
LEFT JOIN order_deliveries d ON o.id = d.order_id;

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_expiry_discount(
  p_expiration_date DATE,
  p_campaign_id BIGINT,
  p_category_id BIGINT DEFAULT NULL
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_days_remaining INTEGER;
  v_discount DECIMAL(5,2) := 0;
BEGIN
  v_days_remaining := p_expiration_date - CURRENT_DATE;
  
  SELECT COALESCE(MAX(dt.discount_percent), 0)
  INTO v_discount
  FROM discount_tiers dt
  WHERE dt.campaign_id = p_campaign_id
    AND dt.is_active = true
    AND v_days_remaining >= dt.days_before_expiry_min
    AND (dt.days_before_expiry_max IS NULL OR v_days_remaining <= dt.days_before_expiry_max)
    AND (dt.category_id IS NULL OR dt.category_id = p_category_id);
    
  RETURN v_discount;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER tr_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_warehouses_updated_at
  BEFORE UPDATE ON warehouses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_stocks_updated_at
  BEFORE UPDATE ON stocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_buyers_updated_at
  BEFORE UPDATE ON buyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_promos_updated_at
  BEFORE UPDATE ON promos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Grant access to service role (bypasses RLS)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read access to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant read access to views
GRANT SELECT ON v_available_offers TO anon, authenticated, service_role;
GRANT SELECT ON v_orders_with_delivery TO authenticated, service_role;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE businesses IS 'Кабинеты продавцов (Robin Food)';
COMMENT ON TABLE campaigns IS 'Магазины/кампании (Robin Food)';
COMMENT ON TABLE warehouses IS 'Склады продавцов';
COMMENT ON TABLE categories IS 'Категории товаров';
COMMENT ON TABLE offers IS 'Товарные предложения (SKU)';
COMMENT ON TABLE offer_prices IS 'Цены на товары';
COMMENT ON TABLE stocks IS 'Остатки товаров на складах';
COMMENT ON TABLE buyers IS 'Покупатели';
COMMENT ON TABLE orders IS 'Заказы';
COMMENT ON TABLE order_deliveries IS 'Информация о доставке заказов';
COMMENT ON TABLE order_items IS 'Товары в заказах';
COMMENT ON TABLE promos IS 'Акции и промо';
COMMENT ON TABLE promo_offers IS 'Товары в акциях';
COMMENT ON TABLE auto_purchase_subscriptions IS 'Подписки на автоматический выкуп (Robin Food)';
COMMENT ON TABLE discount_tiers IS 'Градация скидок по срокам годности (Robin Food)';

COMMENT ON COLUMN offers.offer_id IS 'Ваш SKU - уникальный идентификатор товара';
COMMENT ON COLUMN offers.external_sku IS 'SKU товара во внешней системе';
COMMENT ON COLUMN offers.shelf_life_value IS 'Срок годности - значение';
COMMENT ON COLUMN offers.shelf_life_unit IS 'Срок годности - единица измерения';
COMMENT ON COLUMN stocks.expiration_date IS 'Дата истечения срока годности партии';
