
'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

export type FormValue = {
  name: string
}

interface Props {
  mode: 'edit' | 'new'
  defaultValues?: FormValue
  onSubmit: SubmitHandler<FormValue>
  onDelete?: () => void
}

export const Form: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
}) => {

  const { register, handleSubmit, reset, formState: {isSubmitting, errors} } = useForm<FormValue>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">カテゴリー名</label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
          <button type="submit" className="mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}>
            {mode === 'new' ? '作成' : '更新'}
          </button>
          {mode === 'edit' && (
            <button className="mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-red-500 ml-2"
              onClick={onDelete}
              disabled={isSubmitting}
              type="button">
              削除
            </button>
          )}
        </div>
      </form>
    </>
  )
}