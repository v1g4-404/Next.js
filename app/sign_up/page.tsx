'use client'

import { supabase } from '@/app/_libs/supabase'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '../_components/_types/Input'

export default function Page() {
  const { register, handleSubmit } = useForm<Input>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit: SubmitHandler<Input> = async ({ email, password }) => {

    setIsSubmitting(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,

      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      alert('確認メールを送信しました。')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            {...register('email')}
            type='email'
            id='email'
            placeholder='name@company.com'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            {...register('password')}
            type='password'
            id='password'
            placeholder='••••••••'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            disabled={isSubmitting}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
