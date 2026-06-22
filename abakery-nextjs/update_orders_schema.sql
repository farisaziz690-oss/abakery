-- 1. Tambahkan kolom baru pada tabel orders
ALTER TABLE orders 
ADD COLUMN customer_name TEXT,
ADD COLUMN order_method TEXT,
ADD COLUMN items JSONB,
ADD COLUMN delivery_address TEXT,
ADD COLUMN pickup_datetime TIMESTAMP WITH TIME ZONE;

-- 2. Buat policy baru untuk mengizinkan insert bagi user anonim (pembeli yang checkout)
CREATE POLICY "Allow INSERT for anonymous and authenticated users" 
ON orders FOR INSERT 
TO public
WITH CHECK (true);
