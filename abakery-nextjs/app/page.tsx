import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const revalidate = 0; // Disable static caching for dynamic data

export default async function Home() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*')

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="py-4 px-6 border-b border-border flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold text-primary">A'Bakery</h1>
        <nav>
          <a href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors">Admin Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-primary/10 py-20 text-center px-4 flex-grow-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">A'Bakery</h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">Freshly Baked Everyday</p>
        <Button size="lg" asChild>
          <a href="#menu">Lihat Menu</a>
        </Button>
      </section>

      {/* Menu/Catalog */}
      <section id="menu" className="max-w-6xl mx-auto py-16 px-4 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">Katalog Menu</h2>
        
        {(!products || products.length === 0) ? (
          <p className="text-center text-muted-foreground">Belum ada menu yang tersedia. Tunggu update dari kami ya!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20 bg-card">
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop'} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{product.category}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                  <p className="font-bold text-lg text-primary">Rp {product.price.toLocaleString('id-ID')}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <a target="_blank" rel="noreferrer" href={`https://wa.me/6281234567890?text=Halo%20A'Bakery,%20saya%20mau%20pesan%20${encodeURIComponent(product.name)}`}>
                      Pesan via WhatsApp
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary/5 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} A'Bakery. All rights reserved.</p>
          <p className="mt-2">Jl. Contoh Jalan No.123, Kota Anda | Buka Setiap Hari 07:00 - 21:00</p>
        </div>
      </footer>
    </main>
  )
}
