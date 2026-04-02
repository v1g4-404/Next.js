'use client'

import { FormEvent, useState } from "react"
import { Form } from "../_components/Form"
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {

  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name');

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ name })
      })
      const data = await res.json();
      const { id } = data
      alert('作成しました')
      router.push(`/admin/categories/${id}`)
    } catch (err) {
      alert('作成に失敗しました')
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="font-bold text-xl py-4">カテゴリー作成</h1>
      <div>
        <Form
          mode="new"
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}