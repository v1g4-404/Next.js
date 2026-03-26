
'use client'

interface Props {
  mode: 'edit' | 'new'
  name: string
  setName: (name: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  onDelete?: () => void
  disabled: boolean;
}

export const Form: React.FC<Props> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  disabled
}) => {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">カテゴリー名</label>
          <input type="text" id="name" name="name" value={name} disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={disabled}>
            {mode === 'new' ? '作成' : '更新'}
          </button>
          {mode === 'edit' && (
            <button className="mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-red-500 ml-2"
              onClick={onDelete}
              disabled={disabled}
              type="button">
              削除
            </button>
          )}
        </div>
      </form>
    </>
  )
}