'use client'

import { Form, FormValues } from "../_components/Form"
import { useParams, useRouter } from "next/navigation"
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { SubmitHandler } from "react-hook-form"
import { useFetch } from "@/app/_hooks/useFetch"

export default function Page() {

  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const { data } = useFetch<PostShowResponse>(`/api/admin/posts/${id}`)

  const defaultValues: FormValues | undefined = data?.post
    ? {
      title: data.post.title,
      content: data.post.content,
      thumbnailImageUrl: data.post.thumbnailImageUrl,
      categories: data.post.postCategories.map((pc: { category: { id: number } }) => ({ id: pc.category.id }))
    }
    : undefined

  const onSubmit: SubmitHandler<FormValues> = async ({ title, content, categories, thumbnailImageUrl }) => {

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
    }
  }

  const handleDelete = async () => {
    try {

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
        />
      </div>
    </>
  )
}