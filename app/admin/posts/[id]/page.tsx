'use client'

import { Form, FormValues } from "../_components/Form"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { SubmitHandler } from "react-hook-form"
import useSWR from "swr"

export default function Page() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
  }).then((res) => res.json())

  const { data } = useSWR<PostShowResponse>(
    token ? `/api/admin/posts/${id}` : null,
    fetcher
  )

  const defaultValues: FormValues | undefined = data?.post
    ? {
      title: data.post.title,
      content: data.post.content,
      thumbnailImageUrl: data.post.thumbnailImageUrl,
      categories: data.post.postCategories.map((pc: { category: { id: number } }) => ({ id: pc.category.id }))
    }
    : undefined

  const onSubmit: SubmitHandler<FormValues> = async ({ title, content, categories, thumbnailImageUrl }) => {

    setIsSubmitting(true)

    try {
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
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onDelete={handleDelete}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}