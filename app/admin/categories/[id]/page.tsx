'use client'

import { useState } from "react"
import { Form, FormValue } from '../_components/Form'
import { useParams, useRouter } from "next/navigation";
import { CategoryShowResponse, UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SubmitHandler } from "react-hook-form";
import useSWR from "swr";


export default function Page() {

  const [isSubmiting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession()


  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
  }).then((res) => res.json())

  const { data } = useSWR<CategoryShowResponse>(
    token ? `/api/admin/categories/${id}` : null,
    fetcher
  )

  const defaultValues: FormValue | undefined = data?.category
    ? { name: data.category.name }
    : undefined

  const onSubmit: SubmitHandler<FormValue> = async ({ name }) => {
    setIsSubmitting(true)


    try {
      const body: UpdateCategoryRequestBody = { name }
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        }
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
          onSubmit={onSubmit}
          onDelete={handleDelete}
          disabled={isSubmiting}
          defaultValues={defaultValues}
        />
      </div>
    </>
  )
}