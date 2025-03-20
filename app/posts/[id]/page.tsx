import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogLayout from "@/components/blog-layout";
import { getPostById } from "@/lib/posts";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { BlogPost } from "@/types/BlogPost";

// クライアントコンポーネントとして構造化データを動的にロード
// 正しいパスに修正
const SchemaOrg = dynamic(() => import("@/components/SchemaOrg"), { ssr: true });

interface PostParams {
  params: {
    id: string;
  };
}

// メタデータを動的に生成
export async function generateMetadata({ params }: PostParams, parent: ResolvingMetadata): Promise<Metadata> {
  // ここを修正: 誤って id をインポートした id として使用していた
  const post = (await getPostById(params.id)) as BlogPost | null;

  // 記事が見つからない場合は404用メタデータ
  if (!post) {
    return {
      title: "記事が見つかりません | ユニフォームナビ",
      description: "指定された記事は存在しないか、削除された可能性があります。",
    };
  }

  // 親のメタデータを取得（例：OGPの共通設定など）
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt || "",
    keywords: post.keywords || [],
    authors: post.author ? [{ name: post.author }] : [{ name: "ユニフォームナビ編集部" }],
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      url: `https://uniform-navi.com/posts/${params.id}`,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : previousImages,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
    alternates: {
      canonical: `https://uniform-navi.com/posts/${params.id}`,
    },
  };
}

// 静的ページの生成パラメータを設定
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    id: filename.replace(/\.(md|tsx)$/, ""),
  }));
}

export default async function PostPage({ params }: PostParams) {
  const { id } = params;
  const post = (await getPostById(id)) as BlogPost | null;

  if (!post) {
    notFound();
  }

  // マークダウンファイルからの関連記事情報とタグ情報を抽出
  let relatedPosts = [];
  let tags = post.tags || [];
  let thumbnail = post.thumbnail || "";
  let author = post.author || "ユニフォームナビ編集部";
  let updatedAt = post.updatedAt || post.date;

  try {
    const postsDirectory = path.join(process.cwd(), "posts");
    const fullPath = path.join(postsDirectory, `${id}.md`);

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      // メタデータの抽出
      if (matterResult.data.relatedPosts) {
        relatedPosts = matterResult.data.relatedPosts;
      }

      if (matterResult.data.tags) {
        tags = matterResult.data.tags;
      }

      if (matterResult.data.thumbnail) {
        thumbnail = matterResult.data.thumbnail;
      }

      if (matterResult.data.author) {
        author = matterResult.data.author;
      }

      if (matterResult.data.updatedAt) {
        updatedAt = matterResult.data.updatedAt;
      }
    }
  } catch (error) {
    console.error("メタデータの取得に失敗しました:", error);
  }

  return (
    <>
      <BlogLayout
        title={post.title}
        date={post.date}
        category={post.category}
        excerpt={post.excerpt || ""}
        relatedPosts={relatedPosts}
        thumbnail={thumbnail}
        tags={tags}
        author={author}
      >
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </BlogLayout>

      {/* 構造化データ */}
      <SchemaOrg
        type="BlogPosting"
        title={post.title}
        description={post.excerpt || ""}
        datePublished={post.date}
        dateModified={updatedAt}
        author={author}
        image={thumbnail}
        category={post.category}
        tags={tags}
      />
    </>
  );
}
