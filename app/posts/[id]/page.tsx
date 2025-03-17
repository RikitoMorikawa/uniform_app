import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getAllPosts, getPostById } from "@/lib/posts"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostById(params.id)
  
  if (!post) {
    return {
      title: "記事が見つかりません",
    }
  }

  return {
    title: `${post.title} | ワークウェアブログ`,
    description: post.excerpt,
    keywords: post.keywords.join(", "),
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function PostPage({ params }: Props) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-12 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
          <span>•</span>
          <span className="text-primary">{post.category}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-xl text-muted-foreground">{post.excerpt}</p>
      </div>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}