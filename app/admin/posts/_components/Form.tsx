'use client'

import { CategoriesIndexResponse } from "@/app/api/admin/categories/route"
import { useEffect, useState } from "react"
import Select from "react-select"
import { supabase } from "@/app/_libs/supabase"
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  categories: { id: number }[]
  setCategories: (categories: { id: number }[]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void
  disabled: boolean
  onThumbnailImageUrlChange: (url: string) => void
  initialThumbnailImageUrl?: string
}

export const Form: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled,
  onThumbnailImageUrlChange,
  initialThumbnailImageUrl
}) => {

  const [categoryOptions, setCategoryOptions] = useState<CategoriesIndexResponse['categories']>([])
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(initialThumbnailImageUrl ?? null)
  const { token } = useSupabaseSession()

  useEffect(() => {
  if (initialThumbnailImageUrl) {
    setThumbnailImageUrl(initialThumbnailImageUrl)
  }
}, [initialThumbnailImageUrl])


  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return
    }
    const file = event.target.files[0]
    const filePath = `private/${uuidv4()}`
    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      alert(error.message)
      return
    }

    setThumbnailImageKey(data.path)

  }

  useEffect(() => {
    if (!thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
      onThumbnailImageUrlChange(publicUrl)
    }
    fetcher()
  }, [thumbnailImageKey, onThumbnailImageUrlChange])

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch('/api/admin/categories', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const data = await res.json()
      const { categories }: CategoriesIndexResponse = data
      setCategoryOptions(categories)
    }
    fetcher()
  }, [token])

  const options = categoryOptions.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const selectedValues = options.filter((option) =>
    categories.some((c) => c.id === option.value)
  )

  return (
    // returnの中は変更なし
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
          <label
            htmlFor="thumbnailImageKey"
            className="block text-sm font-medium text-gray-700"
          >


            サムネイルURL
          </label>
          <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">カテゴリー</label>
        </div>
        <Select
          instanceId="category-select"
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