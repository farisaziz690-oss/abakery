'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LogOut, Plus, Pencil, Trash2, Upload } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Roti'
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let responseError = null
    let finalImageUrl = existingImageUrl

    // 1. Upload image if a new file is selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert("Gagal mengunggah gambar: " + uploadError.message + "\nPastikan Anda sudah menjalankan script SQL untuk membuat Storage.")
        setUploading(false)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
        
      finalImageUrl = publicUrl
    }

    // 2. Save data to database
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image_url: finalImageUrl
    }

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId)
      responseError = error
    } else {
      const { error } = await supabase.from('products').insert([payload])
      responseError = error
    }

    setUploading(false)

    if (responseError) {
      alert("Gagal menyimpan data: " + responseError.message)
      console.error(responseError)
      return
    }

    setIsOpen(false)
    resetForm()
    fetchProducts()
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      // Hapus data dari tabel
      await supabase.from('products').delete().eq('id', id)
      
      // Opsional: Hapus gambar dari storage jika menggunakan storage kita
      if (imageUrl && imageUrl.includes('product-images')) {
        const path = imageUrl.split('product-images/')[1]
        if (path) {
          await supabase.storage.from('product-images').remove([path])
        }
      }
      
      fetchProducts()
    }
  }

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || 'Roti'
    })
    setExistingImageUrl(product.image_url || '')
    setImageFile(null)
    setEditingId(product.id)
    setIsOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'Roti' })
    setImageFile(null)
    setExistingImageUrl('')
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Admin */}
      <header className="bg-card border-b border-border py-4 px-6 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-primary">A'Bakery Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a href="/" target="_blank">Lihat Website</a>
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Manajemen Menu</h2>
          
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" /> Tambah Menu</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Produk</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga (Rp)</label>
                  <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Roti">Roti</option>
                    <option value="Kue">Kue</option>
                    <option value="Pastry">Pastry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gambar Produk</label>
                  {existingImageUrl && !imageFile && (
                    <div className="mb-2">
                      <img src={existingImageUrl} alt="Current" className="w-32 h-32 object-cover rounded-md border" />
                      <p className="text-xs text-muted-foreground mt-1">Gambar saat ini (Pilih file baru untuk mengganti)</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0])
                        }
                      }} 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada menu.</TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img 
                            src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150&auto=format&fit=crop'} 
                            alt={product.name} 
                            className="w-12 h-12 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id, product.image_url)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
