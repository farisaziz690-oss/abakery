-- 1. Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS untuk SELECT (Hanya Admin terautentikasi)
CREATE POLICY "Allow SELECT for authenticated users only" 
ON orders FOR SELECT 
TO authenticated 
USING (true);

-- 4. Kebijakan RLS untuk ALL (Insert, Update, Delete untuk Admin terautentikasi)
CREATE POLICY "Allow ALL for authenticated users" 
ON orders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Tambahkan data contoh (mock data) untuk testing grafik pendapatan selama 30 hari terakhir
INSERT INTO orders (total_price, status, created_at) VALUES
(150000, 'completed', now() - interval '25 days'),
(75000, 'completed', now() - interval '24 days'),
(120000, 'completed', now() - interval '22 days'),
(200000, 'completed', now() - interval '20 days'),
(95000, 'completed', now() - interval '19 days'),
(110000, 'completed', now() - interval '17 days'),
(180000, 'completed', now() - interval '15 days'),
(250000, 'completed', now() - interval '12 days'),
(85000, 'completed', now() - interval '10 days'),
(130000, 'completed', now() - interval '6 days'),
(90000, 'completed', now() - interval '5 days'),
(220000, 'completed', now() - interval '4 days'),
(175000, 'completed', now() - interval '3 days'),
(300000, 'completed', now() - interval '2 days'),
(140000, 'completed', now() - interval '1 days'),
(125000, 'completed', now()),
(80000, 'pending', now() - interval '2 days'),
(45000, 'pending', now());
