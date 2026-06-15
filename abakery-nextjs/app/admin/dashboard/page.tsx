'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  LayoutDashboard, 
  Cookie, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Calendar, 
  RefreshCw, 
  Check, 
  Clock, 
  X 
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

type Order = {
  id: string
  total_price: number
  status: string
  created_at: string
}

// Helper function to generate file paths for uploaded images
const generateProductFilePath = (file: File) => {
  const fileExt = file.name.split('.').pop()
  const randomName = `${Math.random().toString(36).substring(2, 15)}`
  return `products/${randomName}.${fileExt}`
}

// Skeleton Loaders
const SkeletonOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border border-[#E6D5C3] bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="h-4 bg-[#E6D5C3]/40 rounded w-1/3"></div>
            <div className="h-8 bg-[#E6D5C3]/60 rounded w-2/3"></div>
            <div className="h-3 bg-[#E6D5C3]/30 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="animate-pulse border border-[#E6D5C3] bg-white shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-5 bg-[#E6D5C3]/50 rounded w-1/2"></div>
            <div className="h-4 bg-[#E6D5C3]/30 rounded w-3/4"></div>
          </div>
          <div className="h-9 bg-[#E6D5C3]/40 rounded w-40"></div>
        </div>
        <div className="h-[300px] bg-[#E6D5C3]/10 rounded-md w-full flex items-end p-4 gap-2">
          {[30, 45, 60, 40, 55, 70, 50, 65, 80, 75, 45, 60].map((h, i) => (
            <div key={i} className="bg-[#E6D5C3]/20 rounded-t flex-1" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview')
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'year'>('7days')
  const [mounted, setMounted] = useState(false)

  // Product Form state
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Roti'
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // Manual Order Form state
  const [saleDialogOpen, setSaleDialogOpen] = useState(false)
  const [salePrice, setSalePrice] = useState('')
  const [saleStatus, setSaleStatus] = useState('completed')
  const [saleDate, setSaleDate] = useState('')
  const [savingSale, setSavingSale] = useState(false)

  const [supabase] = useState(() => createClient())
  const router = useRouter()

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }, [supabase])

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setOrdersLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      fetchProducts()
      fetchOrders()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchProducts, fetchOrders])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  // Handle Product CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let responseError = null
    let finalImageUrl = existingImageUrl

    if (imageFile) {
      const filePath = generateProductFilePath(imageFile)

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert("Gagal mengunggah gambar: " + uploadError.message + "\nPastikan Anda sudah menjalankan script SQL untuk membuat Storage.")
        setUploading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
        
      finalImageUrl = publicUrl
    }

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
      return
    }

    setIsOpen(false)
    resetForm()
    fetchProducts()
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id)
      
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

  // Handle Manual Order
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!salePrice) return
    setSavingSale(true)

    const payload = {
      total_price: Number(salePrice),
      status: saleStatus,
      created_at: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString()
    }

    const { error } = await supabase.from('orders').insert([payload])
    setSavingSale(false)

    if (error) {
      alert("Gagal menyimpan pesanan: " + error.message)
      return
    }

    setSaleDialogOpen(false)
    setSalePrice('')
    setSaleStatus('completed')
    setSaleDate('')
    fetchOrders()
  }

  const handleToggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (!error) {
      fetchOrders()
    } else {
      alert('Gagal memperbarui status: ' + error.message)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data penjualan ini?')) {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (!error) {
        fetchOrders()
      } else {
        alert('Gagal menghapus data: ' + error.message)
      }
    }
  }

  // Revenue Metrics Calculations
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const completedOrders = orders.filter(o => o.status === 'completed')

  const thisMonthRevenue = completedOrders
    .filter(o => {
      const d = new Date(o.created_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, o) => sum + Number(o.total_price), 0)

  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_price), 0)
  const completedCount = completedOrders.length

  // Recharts Data Processing
  const getChartData = () => {
    if (!orders || orders.length === 0) return []

    const dateNow = new Date()
    const startDate = new Date()
    let daysCount = 7
    let formatKey: 'day' | 'month' = 'day'

    if (timeFilter === '7days') {
      startDate.setDate(dateNow.getDate() - 6)
      startDate.setHours(0, 0, 0, 0)
      daysCount = 7
      formatKey = 'day'
    } else if (timeFilter === '30days') {
      startDate.setDate(dateNow.getDate() - 29)
      startDate.setHours(0, 0, 0, 0)
      daysCount = 30
      formatKey = 'day'
    } else {
      formatKey = 'month'
    }

    if (formatKey === 'day') {
      const dataMap: { [key: string]: number } = {}
      for (let i = 0; i < daysCount; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        dataMap[dateStr] = 0
      }

      completedOrders.forEach(o => {
        const oDate = new Date(o.created_at)
        if (oDate >= startDate) {
          const dateStr = oDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
          if (dataMap[dateStr] !== undefined) {
            dataMap[dateStr] += Number(o.total_price)
          }
        }
      })

      return Object.keys(dataMap).map(key => ({
        name: key,
        Revenue: dataMap[key]
      }))
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
      const dataMap: { [key: string]: number } = {}
      months.forEach(m => {
        dataMap[m] = 0
      })

      completedOrders.forEach(o => {
        const oDate = new Date(o.created_at)
        if (oDate.getFullYear() === currentYear) {
          const monthName = months[oDate.getMonth()]
          dataMap[monthName] += Number(o.total_price)
        }
      })

      return months.map(m => ({
        name: m,
        Revenue: dataMap[m]
      }))
    }
  }

  const chartData = getChartData()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Skeleton Loaders are defined outside the component

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-[#3E2723] font-sans">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-[#3E2723] text-[#FCF9F2] flex flex-col border-r border-[#E6D5C3] fixed h-full z-25">
        <div className="p-6 border-b border-[#5D4037] flex items-center gap-3">
          <Cookie className="w-8 h-8 text-[#D4A373]" />
          <div>
            <h1 className="text-lg font-bold tracking-wide leading-tight">A&apos;Bakery Admin</h1>
            <p className="text-xs text-[#F4E3D3]/60">Management System</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#D4A373] text-[#FCF9F2] shadow-md shadow-[#D4A373]/20'
                : 'text-[#F4E3D3]/80 hover:bg-[#5D4037] hover:text-[#FCF9F2]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Ringkasan Pendapatan
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-[#D4A373] text-[#FCF9F2] shadow-md shadow-[#D4A373]/20'
                : 'text-[#F4E3D3]/80 hover:bg-[#5D4037] hover:text-[#FCF9F2]'
            }`}
          >
            <Cookie className="w-4 h-4" />
            Manajemen Menu
          </button>
        </nav>
        
        <div className="p-4 border-t border-[#5D4037] space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-[#F4E3D3]/60 truncate max-w-[120px]">admin@abakery.com</span>
            <Button variant="outline" size="sm" asChild className="h-7 border-[#5D4037] bg-transparent text-[#FCF9F2] hover:bg-[#5D4037] hover:text-[#FCF9F2] text-xs">
              <a href="/" target="_blank">Lihat Web</a>
            </Button>
          </div>
          <Button variant="destructive" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pl-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E6D5C3] px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <h2 className="text-lg font-bold uppercase tracking-wider text-[#8B5A2B] font-serif">
            {activeTab === 'overview' ? 'Analisis Pendapatan' : 'Manajemen Katalog Menu'}
          </h2>
          <div className="text-xs text-muted-foreground bg-[#FAF8F5] border border-[#E6D5C3] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Terhubung
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6 flex-1">
          {activeTab === 'overview' ? (
            ordersLoading ? (
              <SkeletonOverview />
            ) : (
              <div className="space-y-6">
                {/* 3 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-[#E6D5C3] bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Pendapatan Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-emerald-600 font-serif">
                          Rp {thisMonthRevenue.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-xs text-muted-foreground">Dari pesanan berstatus selesai</p>
                      </div>
                      <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#E6D5C3] bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Total Pendapatan</p>
                        <h3 className="text-2xl font-bold text-[#8B5A2B] font-serif">
                          Rp {totalRevenue.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-xs text-muted-foreground">Pendapatan sepanjang masa</p>
                      </div>
                      <div className="p-3 rounded-full bg-[#FAF8F5] text-[#8B5A2B] border border-[#E6D5C3]">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#E6D5C3] bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Pesanan Selesai</p>
                        <h3 className="text-2xl font-bold text-[#3E2723] font-serif">
                          {completedCount} Pesanan
                        </h3>
                        <p className="text-xs text-muted-foreground">Total transaksi sukses</p>
                      </div>
                      <div className="p-3 rounded-full bg-[#FAF8F5] text-[#3E2723] border border-[#E6D5C3]">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recharts Revenue Chart Card */}
                <Card className="border border-[#E6D5C3] bg-white shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h4 className="text-base font-bold text-[#3E2723]">Grafik Tren Pendapatan</h4>
                        <p className="text-xs text-muted-foreground">Visualisasi laba kotor harian/bulanan</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#D4A373]" />
                        <select
                          value={timeFilter}
                          onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                          className="flex h-9 w-40 rounded-md border border-[#E6D5C3] bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4A373] text-[#3E2723]"
                        >
                          <option value="7days">7 Hari Terakhir</option>
                          <option value="30days">30 Hari Terakhir</option>
                          <option value="year">Tahun Ini</option>
                        </select>
                      </div>
                    </div>

                    <div className="h-[350px] w-full pt-4">
                      {mounted && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4A373" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#D4A373" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6D5C3" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#5D4037" 
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <YAxis 
                              stroke="#5D4037" 
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(val) => `Rp ${val.toLocaleString('id-ID', { notation: 'compact' })}`}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#FCF9F2', 
                                borderColor: '#E6D5C3', 
                                borderRadius: '8px',
                                color: '#3E2723',
                                fontSize: '12px'
                              }} 
                              formatter={(value: unknown) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="Revenue" 
                              stroke="#D4A373" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorRevenue)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          Belum ada data pendapatan untuk rentang waktu ini.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders Management Table Card */}
                <Card className="border border-[#E6D5C3] bg-white shadow-sm">
                  <div className="p-6 border-b border-[#E6D5C3] flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-bold text-[#3E2723]">Daftar Transaksi</h4>
                      <p className="text-xs text-muted-foreground">Catatan pemesanan dan status pendapatan</p>
                    </div>
                    
                    {/* Add Manual Sale Dialog */}
                    <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#D4A373] hover:bg-[#C28E5E] text-white">
                          <Plus className="w-4 h-4 mr-2" /> Catat Penjualan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Catat Penjualan Baru</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveSale} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Nominal Pendapatan (Rp)</label>
                            <Input 
                              type="number" 
                              required 
                              placeholder="Contoh: 150000" 
                              value={salePrice} 
                              onChange={e => setSalePrice(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Status Pembayaran</label>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
                              value={saleStatus} 
                              onChange={e => setSaleStatus(e.target.value)}
                            >
                              <option value="completed">Selesai (Completed)</option>
                              <option value="pending">Tertunda (Pending)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tanggal Transaksi (Opsional)</label>
                            <Input 
                              type="datetime-local" 
                              value={saleDate} 
                              onChange={e => setSaleDate(e.target.value)} 
                            />
                            <p className="text-[10px] text-muted-foreground">Kosongkan untuk otomatis mencatat waktu saat ini.</p>
                          </div>
                          <Button type="submit" className="w-full bg-[#3E2723] hover:bg-[#2A1A17] text-white" disabled={savingSale}>
                            {savingSale ? 'Menyimpan...' : 'Simpan Transaksi'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-[#FAF8F5]/50 border-b border-[#E6D5C3]">
                          <TableHead className="font-semibold text-[#5D4037]">Tanggal</TableHead>
                          <TableHead className="font-semibold text-[#5D4037]">Nominal Pendapatan</TableHead>
                          <TableHead className="font-semibold text-[#5D4037]">Status</TableHead>
                          <TableHead className="font-semibold text-[#5D4037] text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              Belum ada catatan penjualan. Klik &quot;Catat Penjualan&quot; untuk memulai.
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-[#FAF8F5]/30 border-b border-[#E6D5C3]">
                              <TableCell className="font-medium">{formatDate(order.created_at)}</TableCell>
                              <TableCell className="font-semibold text-[#8B5A2B]">
                                Rp {Number(order.total_price).toLocaleString('id-ID')}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  order.status === 'completed' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}>
                                  {order.status === 'completed' ? 'Selesai' : 'Pending'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleToggleOrderStatus(order.id, order.status)}
                                  title={order.status === 'completed' ? 'Ubah menjadi Pending' : 'Ubah menjadi Selesai'}
                                >
                                  {order.status === 'completed' ? (
                                    <Clock className="w-4 h-4 text-amber-600" />
                                  ) : (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  )}
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDeleteOrder(order.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )
          ) : (
            // Existing Products Tab (Manajemen Menu)
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-bold text-[#3E2723]">Daftar Menu Produk</h4>
                  <p className="text-xs text-muted-foreground">Kelola katalog makanan A&apos;Bakery</p>
                </div>
                
                <Dialog open={isOpen} onOpenChange={(open) => {
                  setIsOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-[#3E2723] hover:bg-[#2A1A17] text-white">
                      <Plus className="w-4 h-4 mr-2" /> Tambah Menu
                    </Button>
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
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
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
                            <img src={existingImageUrl} alt="Current" className="w-32 h-32 object-cover rounded-md border border-[#E6D5C3]" />
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
                      <Button type="submit" className="w-full bg-[#3E2723] hover:bg-[#2A1A17] text-white" disabled={uploading}>
                        {uploading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah')}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border border-[#E6D5C3] bg-white shadow-sm">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Memuat data produk...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-[#FAF8F5]/50 border-b border-[#E6D5C3]">
                          <TableHead className="font-semibold text-[#5D4037]">Gambar</TableHead>
                          <TableHead className="font-semibold text-[#5D4037]">Nama</TableHead>
                          <TableHead className="font-semibold text-[#5D4037]">Kategori</TableHead>
                          <TableHead className="font-semibold text-[#5D4037]">Harga</TableHead>
                          <TableHead className="font-semibold text-[#5D4037] text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada menu.</TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id} className="hover:bg-[#FAF8F5]/30 border-b border-[#E6D5C3]">
                              <TableCell>
                                <img 
                                  src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150&auto=format&fit=crop'} 
                                  alt={product.name} 
                                  className="w-12 h-12 rounded object-cover border border-[#E6D5C3]"
                                />
                              </TableCell>
                              <TableCell className="font-serif font-semibold">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell className="font-medium text-[#8B5A2B]">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(product)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(product.id, product.image_url)}>
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
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
