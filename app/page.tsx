"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
// import { Post } from "./_components/_types/Post";
import { MicroCmsPost } from "./_components/_types/MicroCmsPost";


export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [posts, setPosts] = useState<MicroCmsPost[]>([])

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch('https://0ild99kl03.microcms.io/api/v1/posts', {// 管理画面で取得したエンドポイントを入力してください。
          headers: { // fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
            'X-MICROCMS-API-KEY': 'fhS8z6y8bhEU5ecUZqCwyoAceQBuP2YbYqq0', // 管理画面で取得したAPIキーを入力してください。
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const { contents } = await res.json()
        setPosts(contents)

      } catch (err) {
        console.error("Error", err)
      } finally {
        setLoading(false)
      }
    }

    fetcher()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        読み込み中...
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="text-center py-10 text-gray-500 text-lg">記事が見つかりませんでした</div>
  }

  return (
    <div>
      <ul className='block mt-4 mb-4 pl-10'>
        {posts.map((post) => (
          <li className='flex flex-col' key={post.id}>
            <Link href={`posts/${post.id}`} className='cursor-pointer'>
              <div className="p-4 mb-8 border max-w-2xl mx-auto flex flex-col">
                <div className='flex justify-between'>
                  <p className="text-[#888] text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex">
                    {post.categories.map((arr) => (
                      <span key={arr.id} className="block py-[3.2px] px-[6.4px] mr-2 text-[#0066cc] border border-current rounded-md text-xs">
                        {arr.name}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="mt-2 mb-4 text-2xl">{post.title}</h2>

                <div
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </Link>
          </li>
        ))
        }
      </ul>
    </div >
  )
}
