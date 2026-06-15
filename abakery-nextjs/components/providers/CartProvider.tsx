'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, amount: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  getProductQuantity: (productId: string) => number
  isMounted: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem('abakery_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart', e)
      }
    }
  }, [])

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('abakery_cart', JSON.stringify(newCart))
  }

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      const updated = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
      saveCart(updated)
    } else {
      saveCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId)
    saveCart(updated)
  }

  const updateQuantity = (productId: string, amount: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + amount
        return newQty > 0 ? { ...item, quantity: newQty } : null
      }
      return item
    }).filter(Boolean) as CartItem[]
    saveCart(updated)
  }

  const clearCart = () => {
    saveCart([])
  }

  const getProductQuantity = (productId: string) => {
    const item = cart.find(i => i.product.id === productId)
    return item ? item.quantity : 0
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      getProductQuantity,
      isMounted
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
