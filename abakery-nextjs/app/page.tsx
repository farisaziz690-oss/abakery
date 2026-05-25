import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const revalidate = 0; // Disable static caching for dynamic data

export default async function Home() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*')

  return (
    <main className="min-h-screen bg-[#FCF9F2] text-[#3E2723] flex flex-col font-sans">
      {/* Navbar */}
      <header className="py-4 px-6 border-b border-[#E6D5C3] flex flex-wrap justify-between items-center fixed top-0 w-full bg-[#FCF9F2]/95 backdrop-blur-md z-50 text-[#3E2723] shadow-sm">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <h1 className="text-2xl font-bold tracking-wider">A'Bakery</h1>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex-1 flex gap-4 md:gap-8 justify-center items-center order-3 w-full mt-4 md:order-none md:w-auto md:mt-0">
          <a href="#home" className="text-xs sm:text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Home</a>
          <a href="#about" className="text-xs sm:text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Tentang Kami</a>
          <a href="#menu" className="text-xs sm:text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Menu</a>
          <a href="#location" className="text-xs sm:text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Lokasi</a>
        </nav>

        {/* Right: Admin Link */}
        <div className="flex-1 flex justify-end order-2 md:order-none">
          <a href="/admin/login" className="text-xs sm:text-sm font-medium hover:text-[#D4A373] transition-colors uppercase tracking-widest">Admin Login</a>
        </div>
      </header>

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
            A'Bakery
          </h1>
          <p className="text-lg md:text-2xl font-bold tracking-[0.3em] mb-12 text-[#F4E3D3] uppercase drop-shadow-md">
            Our Menu
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="max-w-6xl mx-auto py-24 px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Gambar di Kiri */}
          <div className="relative h-[400px] md:h-[500px] rounded-t-[200px] overflow-hidden shadow-xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=2070&auto=format&fit=crop" 
              alt="Tentang A'Bakery" 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
              Berawal dari kecintaan kami pada aroma roti yang baru keluar dari oven, A'Bakery hadir untuk menyajikan roti dan kue berkualitas tinggi yang dibuat dengan sepenuh hati.
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
        <h2 className="text-5xl md:text-6xl text-center mb-16 text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
          Katalog Menu
        </h2>
        
        {(!products || products.length === 0) ? (
          <p className="text-center text-[#5D4037] text-lg">Belum ada menu yang tersedia. Tunggu update dari kami ya!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl hover:shadow-[#D4A373]/20 transition-all border border-[#E6D5C3] bg-white group rounded-md">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop'} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold bg-[#FCF9F2]/90 backdrop-blur-sm text-[#8B5A2B] px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-serif text-[#3E2723] tracking-wide">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#5D4037] mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                  <p className="font-bold text-2xl text-[#D4A373]">Rp {product.price.toLocaleString('id-ID')}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-sm bg-[#D4A373] hover:bg-[#C28E5E] text-white font-bold transition-colors shadow-sm" asChild>
                    <a target="_blank" rel="noreferrer" href={`https://wa.me/6281234567890?text=Halo%20A'Bakery,%20saya%20mau%20pesan%20${encodeURIComponent(product.name)}`}>
                      PESAN SEKARANG
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.01255850977!2d106.7588523315752!3d-6.229728025211915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1716643210000!5m2!1sid!2sid" 
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
                <h3 className="text-3xl font-serif text-[#3E2723] mb-3">A'Bakery Pusat</h3>
                <p className="text-[#5D4037] text-lg leading-relaxed">
                  Jl. Contoh Jalan Indah No. 123<br />
                  Kelurahan Bahagia, Kecamatan Suka Maju<br />
                  Kota Jakarta, 12345
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
                    <span className="font-bold text-[#3E2723]">WhatsApp:</span> +62 812-3456-7890<br />
                    <span className="font-bold text-[#3E2723]">Email:</span> hello@abakery.com
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="rounded-sm bg-[#8B5A2B] hover:bg-[#5D4037] text-[#FCF9F2] font-bold px-8 shadow-md" asChild>
                  <a target="_blank" rel="noreferrer" href="https://maps.google.com">Buka di Google Maps</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#F4E3D3] border-t border-[#E6D5C3] mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[#5D4037] tracking-wider">
          <p className="mb-4 text-3xl text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>A'Bakery</p>
          <p>&copy; {new Date().getFullYear()} A'Bakery. All rights reserved.</p>
          <p className="mt-2">Freshly Baked Everyday | Buka Setiap Hari 07:00 - 21:00</p>
        </div>
      </footer>
    </main>
  )
}
