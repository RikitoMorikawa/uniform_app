import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllPosts, getPostById } from "@/lib/posts";
import BlogLayout from "@/components/blog-layout";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostById(params.id);

  if (!post) {
    return {
      title: "記事が見つかりません",
    };
  }

  return {
    title: `${post.title} | ワークウェアブログ`,
    description: post.excerpt,
    keywords: post.keywords.join(", "),
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <BlogLayout
      title={post.title}
      date={post.date}
      category={post.category}
      excerpt={post.excerpt}
    >
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </BlogLayout>
  );
}