"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { PostIndexResponse } from "@/app/api/admin/posts/route"
import Link from "next/link"
import useSWR from "swr"

export default function Posts() {

  const { token } = useSupabaseSession()

  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
  }).then((res) => res.json())

  const { data } = useSWR<PostIndexResponse>(
    token ? '/api/admin/posts' : null,
    fetcher
  )

  const posts = data?.posts ?? []

  return (
    <>
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">記事一覧</h1>
          <button>
            <Link href='/admin/posts/new' className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">新規作成</Link>
          </button>
        </div>
        <div>
          {posts.map((post) => (
            <Link href={`/admin/posts/${post.id}`} key={post.id} className="block border-b py-6 hover:bg-gray-50 transition">
              <div>
                <div className="text-xl font-bold">{post.title}</div>
                <div className="mt-1 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div >
    </>
  )
}