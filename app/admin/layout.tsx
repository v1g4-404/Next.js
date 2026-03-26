"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <>
      <aside className="fixed left-0 bottom-0 top-16 w-72 bg-gray-100 border-r text-black">
        <Link href="/admin/posts" className={`p-4 block ${isSelected("/admin/posts") && "bg-blue-100"}`}>記事一覧</Link>
        <Link href="/admin/categories" className={`p-4 block ${isSelected("/admin/categories") && "bg-blue-100"}`}>カテゴリー一覧</Link>
      </aside>
      <div className="ml-72 p-4">{children}</div>
    </>
  )
}