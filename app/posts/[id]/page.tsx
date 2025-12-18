"use client"


import { MicroCmsPost } from "@/app/_components/_types/MicroCmsPost";
// import { Post } from "@/app/_components/_types/Post";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function PostDetail() {
  const [loading, setLoading] = useState<boolean>(true)
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<MicroCmsPost | null>(null)

  useEffect(() => {
    const fetcher = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {

        setLoading(true)
        const res = await fetch(
          `https://0ild99kl03.microcms.io/api/v1/posts/${id}`,// microCMSのエンドポイント
          {
            headers: {
              'X-MICROCMS-API-KEY': 'fhS8z6y8bhEU5ecUZqCwyoAceQBuP2YbYqq0', // APIキーをセット
            },
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json()
        setPost(data) // dataをそのままセット
        setLoading(false)

      } catch (err) {
        console.error("Error", err)
      } finally {
        setLoading(false)
      }
    }

    fetcher()
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        読み込み中...
      </div>
    )
  }

  if (!post) {
    return <div className="text-center py-10 text-gray-500 text-lg">記事が見つかりませんでした</div>
  }

  return (
    <div className='mx-auto my-10 max-w-[800px] flex flex-col p-4'>
      <div className=''>
        <Image src={post.thumbnail.url} width={800} height={400} alt="画像" />
      </div>
      <div className='p-4'>
        <div className='flex justify-between'>
          <div className="text-[#888] text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex">
            {post.categories.map((arr) => (
              <div className="block py-[3.2px] px-[6.4px] mr-2 text-[#0066cc] border border-current rounded-md text-xs" key={arr.id}>
                {arr.name}
              </div>
            ))}
          </div>
        </div>
        <div className='mt-2 mb-4 text-2xl'>{post.title}</div>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}