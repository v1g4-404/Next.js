'use client'

import { Form } from "../_components/Form"
import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function Page() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<{ id: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`)
        if (!res.ok) {
          throw new Error('カテゴリーの取得に失敗しました')
        }

        const data = await res.json()
        setTitle(data.post.title ?? '')
        setContent(data.post.content ?? '')
        setThumbnailUrl(data.post.thumbnailUrl ?? '')
        setCategories(data.post.postCategories.map((pc: { category: { id: number } }) => ({ id: pc.category.id })))
      } catch (err) {
        console.log(err)
      }
    }
    fetcher()
  }, [id])


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget);
    const title = form.get('title')
    const content = form.get('content')
    const thumbnailUrl = form.get('thumbnailUrl')

    try {
      setIsSubmitting(true)

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories })
      })
      await res.json();
      alert('更新しました')
    } catch (err) {
      alert('更新に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('削除に失敗しました');
      }
      alert('削除しました')
      router.push('/admin/posts')
    } catch (err) {
      alert('削除に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">記事編集</h1>
        </div>
        <Form
          mode="edit"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}