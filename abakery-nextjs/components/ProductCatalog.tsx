'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart, Product } from './providers/CartProvider'
import Image from 'next/image'
import CartFloatingButton from './CartFloatingButton'
import CheckoutDialog from './CheckoutDialog'

type ProductCatalogProps = {
  products: Product[] | null
}

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const { addToCart, updateQuantity, getProductQuantity, isMounted } = useCart()

  return (
    <>
      {/* Product Catalog Grid */}
      {(!products || products.length === 0) ? (
        <p className="text-center text-[#5D4037] text-lg py-12">Belum ada menu yang tersedia. Tunggu update dari kami ya!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const qtyInCart = isMounted ? getProductQuantity(product.id) : 0
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl hover:shadow-[#D4A373]/20 transition-all border border-[#E6D5C3] bg-white group rounded-md flex flex-col justify-between">
                <div className="relative overflow-hidden w-full h-56">
                  <Image
                    src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold bg-[#FCF9F2]/90 backdrop-blur-sm text-[#8B5A2B] px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-serif text-[#3E2723] tracking-wide">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#5D4037] mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                    <p className="font-bold text-2xl text-[#D4A373]">Rp {product.price.toLocaleString('id-ID')}</p>
                  </CardContent>
                </div>
                <CardFooter className="pt-2">
                  {qtyInCart === 0 ? (
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full rounded-sm bg-[#D4A373] hover:bg-[#C28E5E] text-white font-bold transition-colors shadow-sm uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      TAMBAH KE KERANJANG
                    </Button>
                  ) : (
                    <div className="flex w-full items-center justify-between border border-[#D4A373] rounded-sm overflow-hidden bg-[#FFFDF9]">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(product.id, -1)}
                        className="rounded-none hover:bg-[#D4A373]/10 text-[#8B5A2B] w-12"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-lg text-[#3E2723]">{qtyInCart}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(product.id, 1)}
                        className="rounded-none hover:bg-[#D4A373]/10 text-[#8B5A2B] w-12"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Floating Buttons and Dialogs */}
      <CartFloatingButton />
      <CheckoutDialog />
    </>
  )
}
