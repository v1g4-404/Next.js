'use client'

import { CategoriesIndexResponse } from "@/app/api/admin/categories/route"
import { useEffect, useState } from "react"
import Select from "react-select"

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void
  categories: { id: number }[]
  setCategories: (categories: { id: number }[]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void
  disabled: boolean;
}

export const Form: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled
}) => {


  const [categoryOptions, setCategoryOptions] = useState<CategoriesIndexResponse['categories']>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      const { categories }: CategoriesIndexResponse = data
      setCategoryOptions(categories)
    }
    fetcher()
  }, [])

  const options = categoryOptions.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const selectedValues = options.filter((option) =>
    categories.some((c) => c.id === option.value)
  )

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block test-sm font-medium text-gray-700">タイトル</label>
          <input type="text" id="title" value={title} name="title" disabled={disabled}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3" />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">内容</label>
          <textarea name="content" value={content} id="content" disabled={disabled}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3" />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">サムネイルURL</label>
          <input name="thumbnailUrl" type="text" id="content" value={thumbnailUrl} disabled={disabled}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">カテゴリー</label>
        </div>
        <Select
          options={options}
          isMulti
          value={selectedValues}
          onChange={(selected) => setCategories(selected.map((s) => ({ id: s.value })))}
        />
        <button type="submit"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={disabled}>
          {mode === 'new' ? '作成' : '更新'}
        </button>
        {mode === 'edit' && (
          <button type="button"
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-red-500 ml-2"
            onClick={onDelete}
            disabled={disabled}>
            削除
          </button>
        )}
      </form>
    </>
  )
}