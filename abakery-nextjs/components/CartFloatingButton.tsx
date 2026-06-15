'use client'

import React from 'react'
import { ShoppingBag, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCart } from './providers/CartProvider'
import Image from 'next/image'

export default function CartFloatingButton() {
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    isMounted
  } = useCart()

  if (!isMounted) return null

  return (
    <>
      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#3E2723] hover:bg-[#2A1A17] text-[#FCF9F2] px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 border border-[#5D4037] animate-bounce-subtle"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-[#D4A373]" />
            <span className="absolute -top-2 -right-2 bg-[#D4A373] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#3E2723]">
              {totalItems}
            </span>
          </div>
          <div className="text-left pr-1">
            <p className="text-[10px] text-[#F4E3D3]/70 uppercase tracking-widest leading-none font-bold">Keranjang</p>
            <p className="text-sm font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
        </button>
      )}

      {/* Cart Dialog Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md w-full bg-[#FCF9F2] text-[#3E2723] border border-[#E6D5C3] p-6 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-[#3E2723] flex items-center gap-2 border-b border-[#E6D5C3] pb-3">
              <ShoppingBag className="w-6 h-6 text-[#D4A373]" />
              Keranjang Belanja
            </DialogTitle>
            <DialogDescription className="text-[#5D4037] mt-1">
              Periksa item belanjaan Anda sebelum melanjutkan ke pre-order.
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#5D4037]">
              <ShoppingCart className="w-12 h-12 text-[#E6D5C3] mx-auto mb-3" />
              <p>Keranjang Anda kosong.</p>
            </div>
          ) : (
            <div className="space-y-4 my-4 max-h-[350px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-[#E6D5C3] shadow-sm">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image 
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop'} 
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md border border-[#E6D5C3]/40"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#3E2723] text-sm truncate">{item.product.name}</h5>
                    <p className="text-xs text-[#8B5A2B] font-semibold mt-0.5">Rp {item.product.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-[#5D4037] mt-1 font-bold">Subtotal: Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full gap-2">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 border border-[#E6D5C3] rounded-sm bg-[#FAF8F5] px-1 py-0.5">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="hover:bg-[#E6D5C3]/30 text-[#8B5A2B] px-1.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="hover:bg-[#E6D5C3]/30 text-[#8B5A2B] px-1.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="border-t border-[#E6D5C3] pt-4 mt-2">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-[#3E2723] text-base">Total Belanja</span>
                <span className="font-serif font-bold text-2xl text-[#8B5A2B]">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="border-[#E6D5C3] text-[#5D4037] hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold transition-all rounded-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutOpen(true)
                  }}
                  className="flex-1 bg-[#3E2723] hover:bg-[#2A1A17] text-white font-bold transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  Lanjut ke Pre-Order
                  <ArrowRight className="w-4 h-4 text-[#D4A373]" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
