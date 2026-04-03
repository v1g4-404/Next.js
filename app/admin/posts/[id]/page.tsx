'use client'

import { Form } from "../_components/Form"
import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"

export default function Page() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<{ id: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useSupabaseSession()
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState('');

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        if (!res.ok) {
          throw new Error('カテゴリーの取得に失敗しました')
        }

        const data: PostShowResponse = await res.json()
        setTitle(data.post.title)
        setContent(data.post.content)
        setThumbnailImageUrl(data.post.thumbnailImageUrl)
        setCategories(data.post.postCategories.map((pc: { category: { id: number } }) => ({ id: pc.category.id })))
      } catch (err) {
        console.log(err)
      }
    }
    fetcher()
  }, [id, token])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget);
    const title = form.get('title')
    const content = form.get('content')

    try {
      setIsSubmitting(true)

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ title, content, categories, thumbnailImageUrl })
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
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
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          disabled={isSubmitting}
          onThumbnailImageUrlChange={setThumbnailImageUrl}
          initialThumbnailImageUrl={thumbnailImageUrl}
        />
      </div>
    </>
  )
}