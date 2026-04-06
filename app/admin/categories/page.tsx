'use client'


import { useFetch } from "@/app/_hooks/useFetch"
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route"
import Link from "next/link"

export default function Page() {

  const { data } = useFetch<CategoriesIndexResponse>('/api/admin/categories')

  const categories = data?.categories ?? []

  return (
    <>
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">記事一覧</h1>
          <button>
            <Link href='/admin/categories/new' className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">新規作成</Link>
          </button>
        </div>
        <div>
          {categories.map((category) => (
            <Link href={`/admin/categories/${category.id}`} key={category.id} className="block border-b py-6 hover:bg-gray-50 transition">
              <div className="text-xl font-bold">{category.name}</div>
            </Link>
          ))}
        </div>
      </div >
    </>
  )
}