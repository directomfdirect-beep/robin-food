-- Add RLS read policies for anon and authenticated roles
CREATE POLICY "Allow anon read" ON businesses FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON campaigns FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON warehouses FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON offers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON offer_prices FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON stocks FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Allow auth read" ON businesses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON offer_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON stocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read" ON categories FOR SELECT TO authenticated USING (true);

-- Verify seed data
SELECT 'businesses: ' || count(*)::text FROM businesses;
SELECT 'offers: ' || count(*)::text FROM offers;
SELECT 'stocks: ' || count(*)::text FROM stocks;
