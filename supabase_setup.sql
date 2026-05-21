-- Buat tabel kategori (opsional tapi disarankan)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Masukkan data awal untuk kategori
INSERT INTO categories (name) VALUES ('Roti'), ('Kue'), ('Pastry');

-- Buat tabel produk
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT REFERENCES categories(name),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy 1: Mengizinkan semua orang (anonim/publik) untuk membaca data (SELECT)
CREATE POLICY "Public profiles are viewable by everyone."
  ON products FOR SELECT
  USING ( true );

CREATE POLICY "Categories are viewable by everyone."
  ON categories FOR SELECT
  USING ( true );

-- Policy 2: Mengizinkan admin (user terautentikasi) untuk melakukan INSERT, UPDATE, DELETE
CREATE POLICY "Users can insert products."
  ON products FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Users can update products."
  ON products FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Users can delete products."
  ON products FOR DELETE
  USING ( auth.role() = 'authenticated' );
