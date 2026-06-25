'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Store, MapPin, Clock, Info } from 'lucide-react'
import { useCart } from './providers/CartProvider'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutDialog() {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, setIsCartOpen, clearCart, totalPrice } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [address, setAddress] = useState('')

  const getTomorrowDateString = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day = String(tomorrow.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !date || !time) {
      alert('Mohon lengkapi data pemesanan yang wajib diisi.')
      return
    }

    if (method === 'delivery' && !address) {
      alert('Mohon isi alamat pengiriman.')
      return
    }

    setIsSubmitting(true)

    const formattedDate = formatIndonesianDate(date)
    const methodText = method === 'pickup' ? 'Ambil Sendiri di Toko' : 'Pengiriman Kurir'
    
    let message = `Halo A'Bakery, saya ingin melakukan Pre-Order:\n\n`
    message += `📋 *DETAIL PEMESANAN*\n`
    message += `- Nama Pemesan: ${name}\n`
    message += `- Metode: ${methodText}\n`
    message += `- Tanggal Pengambilan/Kirim: ${formattedDate}\n`
    message += `- Jam: ${time} WIB\n`
    if (method === 'delivery') {
      message += `- Alamat Pengiriman: ${address}\n`
    }
    message += `\n🛒 *DAFTAR PESANAN*\n`
    
    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity
      message += `- ${item.quantity}x ${item.product.name} (Rp ${itemSubtotal.toLocaleString('id-ID')})\n`
    })
    
    message += `\n💰 *Total Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n\n`
    message += `Mohon konfirmasi pesanan saya beserta detail pembayarannya. Terima kasih!`

    const supabase = createClient()
    const orderItems = cart.map(item => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }))

    // Menggabungkan date dan time, mengasumsikan waktu lokal browser
    const pickupDatetime = new Date(`${date}T${time}:00`).toISOString()

    const { error } = await supabase.from('orders').insert([{
      total_price: totalPrice,
      status: 'pending',
      customer_name: name,
      order_method: method,
      items: orderItems,
      delivery_address: method === 'delivery' ? address : null,
      pickup_datetime: pickupDatetime
    }])

    if (error) {
      console.error("Gagal merekam pesanan ke database:", error)
      alert("Terjadi kesalahan saat menyimpan pesanan secara otomatis, tetapi Anda tetap akan diarahkan ke WhatsApp untuk konfirmasi manual.")
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/6289509260222?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')

    clearCart()
    setIsCheckoutOpen(false)
    setName('')
    setDate('')
    setTime('')
    setAddress('')
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
      <DialogContent className="max-w-md w-full bg-[#FCF9F2] text-[#3E2723] border border-[#E6D5C3] p-6 shadow-xl rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#3E2723] flex items-center gap-2 border-b border-[#E6D5C3] pb-3">
            <Calendar className="w-6 h-6 text-[#D4A373]" />
            Formulir Pre-Order
          </DialogTitle>
          <DialogDescription className="text-[#5D4037] mt-1">
            Lengkapi detail di bawah ini untuk memesan. Pesanan dikirim langsung ke WhatsApp kami.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCheckoutSubmit} className="space-y-4 my-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">Nama Lengkap *</label>
            <Input 
              required 
              placeholder="Contoh: Budi Santoso" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="bg-white border-[#E6D5C3] text-[#3E2723] focus-visible:ring-[#D4A373] h-10 rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">Pengambilan *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('pickup')}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-sm font-semibold transition-all ${
                  method === 'pickup'
                    ? 'bg-[#3E2723] border-[#3E2723] text-white'
                    : 'bg-white border-[#E6D5C3] text-[#5D4037] hover:bg-[#FAF8F5]'
                }`}
              >
                <Store className="w-4 h-4" />
                Ambil Sendiri
              </button>
              <button
                type="button"
                onClick={() => setMethod('delivery')}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-sm font-semibold transition-all ${
                  method === 'delivery'
                    ? 'bg-[#3E2723] border-[#3E2723] text-white'
                    : 'bg-white border-[#E6D5C3] text-[#5D4037] hover:bg-[#FAF8F5]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Kirim ke Alamat
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D4A373]" />
                Tanggal *
              </label>
              <Input 
                type="date" 
                required 
                min={getTomorrowDateString()}
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="bg-white border-[#E6D5C3] text-[#3E2723] focus-visible:ring-[#D4A373] h-10 rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4A373]" />
                Jam Pengambilan *
              </label>
              <Input 
                type="time" 
                required 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                className="bg-white border-[#E6D5C3] text-[#3E2723] focus-visible:ring-[#D4A373] h-10 rounded-sm"
              />
            </div>
          </div>

          {method === 'delivery' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">Alamat Pengiriman Lengkap *</label>
              <textarea
                required
                placeholder="Tuliskan alamat lengkap pengiriman beserta kelurahan, kecamatan, dan patokan rumah..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                className="w-full text-sm p-3 bg-white border border-[#E6D5C3] text-[#3E2723] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#D4A373] placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div className="bg-[#FFF8F2] border border-[#E6D5C3]/60 rounded-md p-3 flex items-start gap-2 text-xs text-[#5D4037] mt-2">
            <Info className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
            <p>
              <strong>Catatan Pre-order:</strong> Kami membutuhkan waktu H-1 untuk memproses pesanan demi menjaga kesegaran produk.
            </p>
          </div>

          <DialogFooter className="pt-2 border-t border-[#E6D5C3] -mx-6 -mb-6 bg-muted/30 p-4 mt-4 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCheckoutOpen(false)
                setIsCartOpen(true)
              }}
              className="border-[#E6D5C3] text-[#5D4037] hover:bg-[#FAF8F5]"
            >
              Kembali ke Keranjang
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#D4A373] hover:bg-[#C28E5E] text-white font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Kirim ke WhatsApp'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
