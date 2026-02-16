-- =====================================================
-- Robin Food v2 Migration
-- Adds: auth, cart, favorites, addresses, smart alerts,
--        chat, settlement, payments, product images, ratings
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- =====================================================
-- NEW ENUM TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('customer', 'picker', 'partner', 'admin');
CREATE TYPE user_status AS ENUM ('invited', 'active', 'deleted');
CREATE TYPE payment_provider_type AS ENUM ('tinkoff', 'sbp', 'yandex_split', 'dolyame');
CREATE TYPE payment_status_type AS ENUM ('pending', 'authorized', 'paid', 'refunded', 'cancelled', 'failed');
CREATE TYPE rf_order_status AS ENUM ('pending', 'confirmed', 'picking', 'ready', 'customer_arrived', 'completed', 'cancelled');
CREATE TYPE alert_trigger_type AS ENUM ('price_drop', 'back_in_stock', 'price_threshold');
CREATE TYPE alert_schedule_type AS ENUM ('morning', 'evening', 'all_day');
CREATE TYPE settlement_status AS ENUM ('calculating', 'review', 'disputed', 'approved', 'paid');
CREATE TYPE settlement_line_status AS ENUM ('pending', 'disputed', 'approved');
CREATE TYPE adjustment_type AS ENUM ('refund', 'correction', 'penalty', 'bonus');
CREATE TYPE entity_type AS ENUM ('product', 'store');
CREATE TYPE chat_sender_type AS ENUM ('customer', 'picker', 'system');

-- =====================================================
-- APP_USER (extends buyers concept with auth)
-- =====================================================

CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  consent_accepted BOOLEAN DEFAULT false,
  consent_accepted_at TIMESTAMPTZ,
  avatar_url TEXT,
  push_token TEXT,
  push_platform VARCHAR(20),
  language VARCHAR(5) DEFAULT 'ru',
  deletion_scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_app_user_phone ON app_user(phone);
CREATE INDEX idx_app_user_role ON app_user(role);
CREATE INDEX idx_app_user_status ON app_user(status);

CREATE TRIGGER tr_app_user_updated_at
  BEFORE UPDATE ON app_user
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- OTP_SESSION
-- =====================================================

CREATE TABLE otp_session (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_session_phone ON otp_session(phone);
CREATE INDEX idx_otp_session_expires ON otp_session(expires_at);

-- =====================================================
-- REFRESH_TOKEN
-- =====================================================

CREATE TABLE refresh_token (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  device_info JSONB DEFAULT '{}',
  push_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_token_user ON refresh_token(user_id);
CREATE INDEX idx_refresh_token_hash ON refresh_token(token_hash);

-- =====================================================
-- CUSTOMER_ORDER (Robin Food orders, separate from marketplace orders)
-- =====================================================

CREATE TABLE customer_order (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE,
  user_id UUID NOT NULL REFERENCES app_user(id),
  store_id BIGINT REFERENCES campaigns(id),
  warehouse_id BIGINT REFERENCES warehouses(id),

  status rf_order_status NOT NULL DEFAULT 'pending',
  payment_provider payment_provider_type,
  payment_status payment_status_type DEFAULT 'pending',

  items_total DECIMAL(12,2) DEFAULT 0,
  delivery_total DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,

  hold_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  picking_started_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  customer_arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,

  picker_id UUID REFERENCES app_user(id),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_order_user ON customer_order(user_id);
CREATE INDEX idx_customer_order_store ON customer_order(store_id);
CREATE INDEX idx_customer_order_status ON customer_order(status);
CREATE INDEX idx_customer_order_picker ON customer_order(picker_id);
CREATE INDEX idx_customer_order_hold ON customer_order(hold_expires_at) WHERE status = 'pending';
CREATE INDEX idx_customer_order_created ON customer_order(created_at);

CREATE TRIGGER tr_customer_order_updated_at
  BEFORE UPDATE ON customer_order
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- CUSTOMER_ORDER_ITEM
-- =====================================================

CREATE TABLE customer_order_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  offer_id BIGINT NOT NULL REFERENCES offers(id),
  offer_name VARCHAR(500),

  requested_quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
  actual_quantity DECIMAL(10,3),
  is_weighted BOOLEAN DEFAULT false,

  unit_price DECIMAL(12,2) NOT NULL,
  final_price DECIMAL(12,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coi_order ON customer_order_item(order_id);
CREATE INDEX idx_coi_offer ON customer_order_item(offer_id);

-- =====================================================
-- ORDER_RATING
-- =====================================================

CREATE TABLE order_rating (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_user(id),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_order_rating UNIQUE (order_id, user_id)
);

CREATE TRIGGER tr_order_rating_updated_at
  BEFORE UPDATE ON order_rating
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- CART (server-side)
-- =====================================================

CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER tr_cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- CART_ITEM
-- =====================================================

CREATE TABLE cart_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  store_id BIGINT REFERENCES campaigns(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_cart_item UNIQUE (cart_id, offer_id, store_id)
);

CREATE INDEX idx_cart_item_cart ON cart_item(cart_id);

-- =====================================================
-- FAVORITE (polymorphic)
-- =====================================================

CREATE TABLE favorite (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  entity_type entity_type NOT NULL,
  entity_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_favorite UNIQUE (user_id, entity_type, entity_id)
);

CREATE INDEX idx_favorite_user ON favorite(user_id);
CREATE INDEX idx_favorite_entity ON favorite(entity_type, entity_id);

-- =====================================================
-- ADDRESS
-- =====================================================

CREATE TABLE address (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  label VARCHAR(100),
  full_address TEXT NOT NULL,
  city VARCHAR(255),
  street VARCHAR(255),
  house VARCHAR(50),
  apartment VARCHAR(50),
  entrance VARCHAR(20),
  floor VARCHAR(20),
  intercom VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_address_user ON address(user_id);

CREATE TRIGGER tr_address_updated_at
  BEFORE UPDATE ON address
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DELETION_REQUEST
-- =====================================================

CREATE TABLE deletion_request (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE UNIQUE,
  reason TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deletion_request_scheduled ON deletion_request(scheduled_at) WHERE executed_at IS NULL AND cancelled_at IS NULL;

-- =====================================================
-- SMART_ALERT
-- =====================================================

CREATE TABLE smart_alert (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  offer_id BIGINT REFERENCES offers(id) ON DELETE CASCADE,
  store_id BIGINT REFERENCES campaigns(id),

  trigger_type alert_trigger_type NOT NULL,
  threshold_value DECIMAL(12,2),
  schedule alert_schedule_type DEFAULT 'all_day',

  is_active BOOLEAN DEFAULT true,
  last_fired_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_smart_alert_user ON smart_alert(user_id);
CREATE INDEX idx_smart_alert_active ON smart_alert(is_active) WHERE is_active = true;

CREATE TRIGGER tr_smart_alert_updated_at
  BEFORE UPDATE ON smart_alert
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SMART_ALERT_LOG
-- =====================================================

CREATE TABLE smart_alert_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID NOT NULL REFERENCES smart_alert(id) ON DELETE CASCADE,
  triggered_value DECIMAL(12,2),
  push_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_smart_alert_log_alert ON smart_alert_log(alert_id);

-- =====================================================
-- CHAT_MESSAGE
-- =====================================================

CREATE TABLE chat_message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES app_user(id),
  sender_type chat_sender_type NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_message_order ON chat_message(order_id);
CREATE INDEX idx_chat_message_created ON chat_message(order_id, created_at);

-- =====================================================
-- PAYMENT_TRANSACTION
-- =====================================================

CREATE TABLE payment_transaction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  provider payment_provider_type NOT NULL,
  provider_ref VARCHAR(255),
  
  operation VARCHAR(50) NOT NULL, -- 'authorize', 'capture', 'cancel', 'refund'
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'RUB',
  
  status payment_status_type NOT NULL DEFAULT 'pending',
  provider_status VARCHAR(100),
  provider_response JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_pay_tx_provider_ref ON payment_transaction(provider, provider_ref) WHERE provider_ref IS NOT NULL;
CREATE INDEX idx_pay_tx_order ON payment_transaction(order_id);
CREATE INDEX idx_pay_tx_status ON payment_transaction(status);

CREATE TRIGGER tr_payment_transaction_updated_at
  BEFORE UPDATE ON payment_transaction
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- PRODUCT_IMAGE (multi-image support)
-- =====================================================

CREATE TABLE product_image (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumb_url TEXT,
  micro_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_image_offer ON product_image(offer_id);

-- =====================================================
-- PARTNER_TARIFF
-- =====================================================

CREATE TABLE partner_tariff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  commission_percent DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partner_tariff_business ON partner_tariff(business_id);

-- =====================================================
-- SETTLEMENT_PERIOD
-- =====================================================

CREATE TABLE settlement_period (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id BIGINT NOT NULL REFERENCES businesses(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  status settlement_status NOT NULL DEFAULT 'calculating',
  
  total_gmv DECIMAL(14,2) DEFAULT 0,
  total_commission DECIMAL(14,2) DEFAULT 0,
  total_adjustments DECIMAL(14,2) DEFAULT 0,
  total_payout DECIMAL(14,2) DEFAULT 0,
  total_disputed_lines INTEGER DEFAULT 0,
  
  payout_ref VARCHAR(255),
  paid_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlement_period_business ON settlement_period(business_id);
CREATE INDEX idx_settlement_period_dates ON settlement_period(period_start, period_end);
CREATE INDEX idx_settlement_period_status ON settlement_period(status);

CREATE TRIGGER tr_settlement_period_updated_at
  BEFORE UPDATE ON settlement_period
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SETTLEMENT_LINE (one per customer_order)
-- =====================================================

CREATE TABLE settlement_line (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES customer_order(id),
  
  status settlement_line_status NOT NULL DEFAULT 'pending',
  
  gmv DECIMAL(12,2) NOT NULL DEFAULT 0,
  commission DECIMAL(12,2) NOT NULL DEFAULT 0,
  payout DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  disputed_at TIMESTAMPTZ,
  dispute_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlement_line_period ON settlement_line(period_id);
CREATE INDEX idx_settlement_line_order ON settlement_line(order_id);

CREATE TRIGGER tr_settlement_line_updated_at
  BEFORE UPDATE ON settlement_line
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SETTLEMENT_ADJUSTMENT
-- =====================================================

CREATE TABLE settlement_adjustment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID NOT NULL REFERENCES settlement_period(id) ON DELETE CASCADE,
  line_id UUID REFERENCES settlement_line(id),
  
  adjustment_type adjustment_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,
  
  created_by UUID REFERENCES app_user(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlement_adj_period ON settlement_adjustment(period_id);

-- =====================================================
-- FTS INDEX ON OFFERS
-- =====================================================

ALTER TABLE offers ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION offers_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('russian', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('russian', COALESCE(NEW.vendor, '')), 'B') ||
    setweight(to_tsvector('russian', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_offers_search_vector
  BEFORE INSERT OR UPDATE OF name, vendor, description ON offers
  FOR EACH ROW EXECUTE FUNCTION offers_search_vector_update();

CREATE INDEX idx_offers_search ON offers USING GIN(search_vector);
CREATE INDEX idx_offers_name_trgm ON offers USING GIN(name gin_trgm_ops);

-- Update existing offers to populate search_vector
UPDATE offers SET search_vector = 
  setweight(to_tsvector('russian', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('russian', COALESCE(vendor, '')), 'B') ||
  setweight(to_tsvector('russian', COALESCE(description, '')), 'C');

-- =====================================================
-- GEOSPATIAL INDEX ON WAREHOUSES
-- =====================================================

CREATE INDEX idx_warehouses_geo ON warehouses USING GIST (
  ll_to_earth(latitude::float8, longitude::float8)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- =====================================================
-- NUTRITIONAL DATA ON OFFERS (КБЖУ)
-- =====================================================

ALTER TABLE offers ADD COLUMN IF NOT EXISTS kcal DECIMAL(8,1);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS proteins DECIMAL(8,1);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS fats DECIMAL(8,1);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS carbs DECIMAL(8,1);

-- =====================================================
-- RLS POLICIES for new tables
-- =====================================================

ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite ENABLE ROW LEVEL SECURITY;
ALTER TABLE address ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alert ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_rating ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_line ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Anon can read catalog data
CREATE POLICY "anon_read_businesses" ON businesses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_campaigns" ON campaigns FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_warehouses" ON warehouses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_offers" ON offers FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_offer_prices" ON offer_prices FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_stocks" ON stocks FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_categories" ON categories FOR SELECT TO anon USING (true);

-- Authenticated read access  
CREATE POLICY "auth_read_businesses" ON businesses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_campaigns" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_warehouses" ON warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_offers" ON offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_offer_prices" ON offer_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_stocks" ON stocks FOR SELECT TO authenticated USING (true);

-- Seed partner tariffs
INSERT INTO partner_tariff (business_id, commission_percent) VALUES
(1, 15.00),
(2, 12.00),
(3, 10.00);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE app_user IS 'Application users (customers, pickers, partners, admins)';
COMMENT ON TABLE otp_session IS 'One-time password sessions for phone auth';
COMMENT ON TABLE refresh_token IS 'JWT refresh tokens per device';
COMMENT ON TABLE customer_order IS 'Robin Food customer orders';
COMMENT ON TABLE customer_order_item IS 'Items in customer orders';
COMMENT ON TABLE order_rating IS 'Order ratings (1-5 stars)';
COMMENT ON TABLE cart IS 'Server-side shopping cart (one per user)';
COMMENT ON TABLE cart_item IS 'Items in shopping cart';
COMMENT ON TABLE favorite IS 'User favorites (products and stores)';
COMMENT ON TABLE address IS 'User delivery addresses (max 5)';
COMMENT ON TABLE deletion_request IS 'Account deletion requests (30-day grace)';
COMMENT ON TABLE smart_alert IS 'Smart price/stock alerts';
COMMENT ON TABLE smart_alert_log IS 'Alert firing history';
COMMENT ON TABLE chat_message IS 'Order-scoped chat messages';
COMMENT ON TABLE payment_transaction IS 'Payment provider transactions';
COMMENT ON TABLE product_image IS 'Product images (max 10 per product)';
COMMENT ON TABLE partner_tariff IS 'Partner commission rates';
COMMENT ON TABLE settlement_period IS 'Weekly settlement periods';
COMMENT ON TABLE settlement_line IS 'Settlement lines (one per order)';
COMMENT ON TABLE settlement_adjustment IS 'Settlement adjustments (refunds, corrections)';
