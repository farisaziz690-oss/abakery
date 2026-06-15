import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Info, Star } from 'lucide-react'
import ProductCatalog from '@/components/ProductCatalog'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

export const revalidate = 0; // Disable static caching for dynamic data

export default async function Home() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*')

  return (
    <main className="min-h-screen bg-[#FCF9F2] text-[#3E2723] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 flex-grow-0 pt-20 border-b border-[#E6D5C3]">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Lapisan hitam sedikit dikurangi agar gambar lebih terang, tapi teks tetap terbaca */}
          <div className="absolute inset-0 bg-black/40 backdrop-brightness-90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center mt-10">
          <h1 className="text-7xl md:text-9xl mb-4 text-[#FCF9F2] drop-shadow-2xl" style={{ fontFamily: 'var(--font-dancing-script)' }}>
            A&apos;Bakery
          </h1>
          <p className="text-lg md:text-2xl font-bold tracking-[0.3em] mb-12 text-[#F4E3D3] uppercase drop-shadow-md">
            Fresh by Order, Baked with Love
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="max-w-6xl mx-auto py-24 px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Gambar di Kiri */}
          <div className="relative h-[400px] md:h-[500px] rounded-t-[200px] overflow-hidden shadow-xl border-8 border-white">
            <Image
              src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=2070&auto=format&fit=crop"
              alt="Tentang A'Bakery"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Garis ornamen di dalam gambar */}
            <div className="absolute inset-0 border border-white/50 m-3 rounded-t-[200px] pointer-events-none"></div>
          </div>

          {/* Teks di Kanan */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <h3 className="text-[#D4A373] font-bold tracking-widest uppercase mb-2 text-sm">Cerita Kami</h3>
            <h2 className="text-5xl md:text-6xl mb-6 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
              Memanggang Kebahagiaan Setiap Hari
            </h2>
            <p className="text-[#5D4037] leading-relaxed mb-6 text-lg">
              Berawal dari kecintaan kami pada aroma roti yang baru keluar dari oven, A&apos;Bakery hadir untuk menyajikan roti dan kue berkualitas tinggi yang dibuat dengan sepenuh hati.
            </p>
            <p className="text-[#5D4037] leading-relaxed mb-8 text-lg">
              Kami percaya bahwa bahan-bahan alami dan resep tradisional adalah kunci rahasia di balik setiap gigitan yang lezat. Mari datang dan rasakan sendiri kehangatan sajian dari oven kami!
            </p>
            <div className="md:self-start">
              <Button className="rounded-sm bg-[#3E2723] hover:bg-[#2A1A17] text-[#FCF9F2] font-bold px-8 py-6 transition-colors shadow-lg" asChild>
                <a href="#menu">Jelajahi Menu Kami</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu/Catalog */}
      <section id="menu" className="max-w-6xl mx-auto py-24 px-4 flex-grow w-full">
        <h2 className="text-5xl md:text-6xl text-center mb-10 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
          Katalog Menu
        </h2>

        {/* Banner Info Pre-Order */}
        <div className="bg-[#FFF8F2] border border-[#E6D5C3] rounded-xl p-5 mb-12 max-w-2xl mx-auto shadow-sm flex items-start gap-4 text-left">
          <div className="bg-[#D4A373]/20 p-2.5 rounded-lg text-[#D4A373] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#3E2723] text-lg mb-1">Informasi Sistem Pre-Order</h4>
            <p className="text-sm text-[#5D4037] leading-relaxed">
              Semua menu kami dipanggang segar berdasarkan pesanan. Silakan lakukan pemesanan minimal <strong>1-2 hari sebelumnya</strong> (H-1 / H-2) sebelum tanggal pengiriman atau pengambilan.
            </p>
          </div>
        </div>

        <ProductCatalog products={products} />
      </section>

      {/* Testimonials / Ulasan Pembeli Section */}
      <section id="reviews" className="w-full bg-[#FAF8F5] py-24 border-t border-[#E6D5C3]">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-[#D4A373] font-bold tracking-widest uppercase mb-2 text-center text-sm">Apa Kata Mereka</h3>
          <h2 className="text-5xl md:text-6xl text-center mb-16 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
            Ulasan Pembeli
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#E6D5C3] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-1 text-[#D4A373] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-6 italic text-sm">
                &quot;Roti sobek cokelatnya bener-bener lembut banget! Cokelatnya juga melimpah dan gak bikin enek. Sistem pre-order-nya mantap, pas roti sampai masih terasa hangat dan fresh dari oven!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4A373]/20 flex items-center justify-center font-bold text-[#8B5A2B] text-sm">
                  RH
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] text-sm">Rina Hartati</h4>
                  <p className="text-xs text-[#5D4037]/60">Pelanggan Setia</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#E6D5C3] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-1 text-[#D4A373] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-6 italic text-sm">
                &quot;Baru pertama kali coba pre-order croissant di sini buat acara arisan keluarga, semua pada suka! Teksturnya flaky di luar tapi lembut di dalam. Sangat recommended buat yang cari pastry premium.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4A373]/20 flex items-center justify-center font-bold text-[#8B5A2B] text-sm">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] text-sm">Aditya Prasetyo</h4>
                  <p className="text-xs text-[#5D4037]/60">Pecinta Pastry</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#E6D5C3] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-1 text-[#D4A373] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-6 italic text-sm">
                &quot;Pelayanannya ramah banget, admin WhatsApp-nya informatif. Roti gandumnya cocok buat sarapan diet saya. Kualitas bahannya terasa premium dan higienis. Pasti bakal order lagi!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4A373]/20 flex items-center justify-center font-bold text-[#8B5A2B] text-sm">
                  SD
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] text-sm">Siti Dewi</h4>
                  <p className="text-xs text-[#5D4037]/60">Ibu Rumah Tangga</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-[#FCF9F2] py-24 border-t border-[#E6D5C3]">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-[#D4A373] font-bold tracking-widest uppercase mb-2 text-center text-sm">Ada Pertanyaan?</h3>
          <h2 className="text-5xl md:text-6xl text-center mb-16 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
            Tanya Jawab Umum
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-white rounded-lg border border-[#E6D5C3] [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 text-base font-semibold text-[#3E2723] cursor-pointer select-none">
                <span>Bagaimana cara memesan roti di A&apos;Bakery?</span>
                <span className="text-[#D4A373] transition-transform duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[#5D4037] leading-relaxed border-t border-[#E6D5C3]/40 pt-4">
                Pemesanan dilakukan dengan memilih menu yang diinginkan ke dalam keranjang, kemudian mengisi formulir pre-order (Nama, Tanggal Pengambilan, Waktu, & Alamat jika dikirim). Setelah itu, Anda akan diarahkan ke WhatsApp kami untuk konfirmasi pesanan dan pembayaran.
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-white rounded-lg border border-[#E6D5C3] [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 text-base font-semibold text-[#3E2723] cursor-pointer select-none">
                <span>Mengapa menggunakan sistem Pre-Order H-1?</span>
                <span className="text-[#D4A373] transition-transform duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[#5D4037] leading-relaxed border-t border-[#E6D5C3]/40 pt-4">
                Kami berkomitmen menyajikan roti yang benar-benar segar dan tanpa pengawet. Dengan sistem Pre-Order H-1 (pesan hari ini untuk besok), kami hanya memanggang roti sesuai jumlah pesanan sehingga kualitas dan kelembutannya tetap terjaga saat sampai di tangan Anda.
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-white rounded-lg border border-[#E6D5C3] [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 text-base font-semibold text-[#3E2723] cursor-pointer select-none">
                <span>Bagaimana metode pembayaran yang tersedia?</span>
                <span className="text-[#D4A373] transition-transform duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[#5D4037] leading-relaxed border-t border-[#E6D5C3]/40 pt-4">
                Kami menerima pembayaran melalui Transfer Bank (BCA, Mandiri, dll) serta berbagai E-Wallet (OVO, GoPay, Dana, ShopeePay). Detail rekening atau QRIS pembayaran akan dikirimkan oleh admin kami melalui WhatsApp setelah pesanan Anda divalidasi.
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-white rounded-lg border border-[#E6D5C3] [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 text-base font-semibold text-[#3E2723] cursor-pointer select-none">
                <span>Apakah bisa dikirim langsung ke rumah saya?</span>
                <span className="text-[#D4A373] transition-transform duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[#5D4037] leading-relaxed border-t border-[#E6D5C3]/40 pt-4">
                Bisa! Kami menyediakan opsi pengiriman ke seluruh wilayah Surabaya menggunakan kurir instan ojek online (GoSend/GrabExpress) untuk menjaga agar roti tidak rusak di jalan. Ongkos kirim akan disesuaikan dengan tarif aplikasi yang berlaku. Anda juga dapat memilih opsi &quot;Ambil Sendiri&quot; langsung di toko kami tanpa biaya tambahan.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="w-full bg-[#FFFDF9] py-24 border-t border-[#E6D5C3]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl text-center mb-16 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
            Kunjungi Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-6 md:p-10 rounded-2xl border border-[#E6D5C3] shadow-lg">
            {/* Kiri: Google Maps */}
            <div className="w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden border-4 border-[#FCF9F2]">
              <iframe
                src="https://maps.google.com/maps?q=-7.2415175,112.6090786&hl=id&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Kanan: Detail Alamat */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-3xl font-serif text-[#3E2723] mb-3">A&apos;Bakery Pusat</h3>
                <p className="text-[#5D4037] text-lg leading-relaxed">
                  Jl. Rejosari gang manggis rt.02 rw.03<br />
                  Kelurahan Benowo, Kecamatan Pakal<br />
                  Kota Surabaya, 60195
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-[#D4A373] font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#D4A373]"></span> Jam Operasional
                  </h4>
                  <ul className="text-[#5D4037] space-y-1 text-lg">
                    <li><span className="font-bold text-[#3E2723]">Senin - Jumat:</span> 07:00 - 21:00</li>
                    <li><span className="font-bold text-[#3E2723]">Sabtu - Minggu:</span> 06:30 - 22:00</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#D4A373] font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#D4A373]"></span> Hubungi Kami
                  </h4>
                  <p className="text-[#5D4037] text-lg">
                    <span className="font-bold text-[#3E2723]">WhatsApp:</span> +62 895-0926-0222<br />
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button className="rounded-sm bg-[#8B5A2B] hover:bg-[#5D4037] text-[#FCF9F2] font-bold px-8 shadow-md" asChild>
                  <a target="_blank" rel="noreferrer" href="https://maps.app.goo.gl/G73wfXK2BjVTsJhbA">Buka di Google Maps</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#F4E3D3] border-t border-[#E6D5C3] mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[#5D4037] tracking-wider">
          <p className="mb-4 text-3xl text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>A&apos;Bakery</p>
          <p>&copy; {new Date().getFullYear()} A&apos;Bakery. All rights reserved.</p>
          <p className="mt-2">Freshly Baked Everyday | Buka Setiap Hari 07:00 - 21:00</p>
        </div>
      </footer>
    </main>
  )
}
