-- 1. Buat bucket public bernama 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Izinkan semua orang melihat gambar (SELECT)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Izinkan admin (authenticated) untuk mengunggah gambar (INSERT)
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 4. Izinkan admin (authenticated) untuk memperbarui gambar (UPDATE)
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 5. Izinkan admin (authenticated) untuk menghapus gambar (DELETE)
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
