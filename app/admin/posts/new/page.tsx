'use client'

import { Form, FormValues } from '../_components/Form'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { SubmitHandler } from 'react-hook-form'

export default function Page() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { token } = useSupabaseSession()

  const onSubmit: SubmitHandler<FormValues> = async ({ title, content, categories, thumbnailImageUrl }) => {

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
        onSubmit={onSubmit}
        disabled={isSubmitting}
      />
    </>
  )
}