"use client"

import Link from "next/link"

export default function Banner() {
  return (
    <header className='bg-[#333] text-white p-6 flex justify-between text-base font-bold'>
      <Link href="/" className=''>Blog</Link>
      <Link href="/contact" className=''>お問い合わせ</Link>
    </header>
  )
}