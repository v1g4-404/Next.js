export type ApiPost = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string
  createdAt: string // JSONだとDateは文字列になるのが普通
  updatedAt: string
  postCategories: {
    category: {
      id: number
      name: string
    }
  }[]
}