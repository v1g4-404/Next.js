"use client"

import Link from "next/link"

export default function Banner() {
  return (
    <header className='bg-gray-800 text-white h-16 px-6 flex justify-between text-base font-bold'>
      <Link href="/" className='flex items-center'>Blog</Link>
      <div className="flex items-center gap-4">
      <Link href="/contact" className=''>お問い合わせ</Link>
      <Link href="/sign_in" className=''>ログイン</Link>
      </div>
    </header>
  )
}