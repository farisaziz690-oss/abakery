import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans bg-[#FCF9F2]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#E6D5C3] border-t-[#D4A373] rounded-full animate-spin mb-4"></div>
        <h2 className="text-3xl text-[#8B5A2B]" style={{ fontFamily: 'var(--font-dancing-script)' }}>
          Memanaskan oven...
        </h2>
        <p className="text-sm text-[#5D4037] mt-2 tracking-widest uppercase font-bold">Harap Tunggu</p>
      </div>
    </div>
  )
}
