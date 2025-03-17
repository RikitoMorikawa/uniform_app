import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { getAllPosts } from "@/lib/posts"
import Link from "next/link"

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-4">最新の記事</h1>
      <p className="text-muted-foreground text-center mb-12">
        作業服、空調服、警備服に関する最新情報をお届けします
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <Link href={`/posts/${post.id}`}>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <time dateTime={post.date}>{formatDate(new Date(post.date))}</time>
                  <span>•</span>
                  <span className="text-primary">{post.category}</span>
                </div>
                <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}