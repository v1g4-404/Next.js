'use client'

import { Form, FormValue } from '../_components/Form'
import { useParams, useRouter } from "next/navigation";
import { CategoryShowResponse, UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SubmitHandler } from "react-hook-form";
import { useFetch } from "@/app/_hooks/useFetch";


export default function Page() {

  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession()

  const { data } = useFetch<CategoryShowResponse>(`/api/admin/categories/${id}`)

  const defaultValues: FormValue | undefined = data?.category
    ? { name: data.category.name }
    : undefined

  const onSubmit: SubmitHandler<FormValue> = async ({ name }) => {

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
    }
  }

  const handleDelete = async () => {
    try {

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
          defaultValues={defaultValues}
        />
      </div>
    </>
  )
}