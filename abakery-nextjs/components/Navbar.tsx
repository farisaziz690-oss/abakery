'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="py-4 px-6 border-b border-[#E6D5C3] fixed top-0 w-full bg-[#FCF9F2]/95 backdrop-blur-md z-50 text-[#3E2723] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="#home" className="text-2xl font-bold tracking-wider hover:text-[#D4A373] transition-colors">
            A&apos;Bakery
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-8 justify-center items-center">
          <Link href="#home" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Home</Link>
          <Link href="#about" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Tentang Kami</Link>
          <Link href="#menu" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Menu</Link>
          <Link href="#reviews" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Ulasan</Link>
          <Link href="#faq" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">FAQ</Link>
          <Link href="#location" className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest">Lokasi</Link>
        </nav>

        {/* Right: Admin Link (Desktop) */}
        <div className="hidden md:flex justify-end">
          <Link href="/admin/login" className="text-sm font-medium hover:text-[#D4A373] transition-colors uppercase tracking-widest">
            Admin Login
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#3E2723] hover:text-[#D4A373] transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FCF9F2] border-b border-[#E6D5C3] shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="#home" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">Home</Link>
          <Link href="#about" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">Tentang Kami</Link>
          <Link href="#menu" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">Menu</Link>
          <Link href="#reviews" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">Ulasan</Link>
          <Link href="#faq" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">FAQ</Link>
          <Link href="#location" onClick={() => setIsOpen(false)} className="text-sm font-bold hover:text-[#D4A373] transition-colors uppercase tracking-widest block">Lokasi</Link>
          <div className="border-t border-[#E6D5C3] pt-4 mt-2">
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-[#D4A373] transition-colors uppercase tracking-widest block">
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
