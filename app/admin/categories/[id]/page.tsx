'use client'

import { FormEvent, useEffect, useState } from "react"
import { Form } from '../_components/Form'
import { useParams, useRouter } from "next/navigation";
import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export default function Page() {

  const [name, setName] = useState('')
  const [isSubmiting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession()

  useEffect(() => {
    if (!token) return

    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        if (!res.ok) {
          throw new Error('カテゴリーの取得に失敗しました')
        }
        const data = await res.json()
        setName(data.category.name ?? '')
      } catch (err) {
        console.log(err)
      }
    }
    fetchCategory()
  }, [id, token])


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true)

      const body: UpdateCategoryRequestBody = { name }
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      await res.json();
      alert('更新しました')
    } catch (err) {
      alert('更新に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('削除に失敗しました');
      }
      alert('削除しました')
      router.push('/admin/categories')
    } catch (err) {
      alert('削除に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="font-bold text-xl py-4">カテゴリー編集</h1>
      <div>
        <Form
          mode="edit"
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          disabled={isSubmiting}
        />
      </div>
    </>
  )
}