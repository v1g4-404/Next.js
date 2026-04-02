'use client'

import { Form } from '../_components/Form'
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<{ id: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { token } = useSupabaseSession()
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget)
    const title = form.get('title')
    const content = form.get('content')


    try {
      setIsSubmitting(true)

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ title, content, categories, thumbnailImageUrl })
      })
      const data = await res.json()
      console.log(data)
      const { id } = data
      alert('作成しました')
      router.push(`/admin/posts/${id}`)
    } catch (err) {
      alert('作成に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">記事追加</h1>
      </div>
      <Form
        mode='new'
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
        token={token}
        onThumbnailImageUrlChange={setThumbnailImageUrl}
      />
    </>
  )
}