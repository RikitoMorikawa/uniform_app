"use client";

import { formatDate } from "@/lib/utils";
import { Share2, Clock, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// WorkwearSelectorをクライアントサイドのみでレンダリングするために動的インポートを使用
const WorkwearSelector = dynamic(() => import("./workwear-selector"), { ssr: false });

interface RelatedPost {
  title: string;
  slug: string;
}

interface BlogLayoutProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  thumbnail?: string;
  tags?: string[];
  author?: string;
  relatedPosts?: RelatedPost[];
  children: React.ReactNode;
}

export default function BlogLayout({
  title,
  date,
  category,
  excerpt,
  thumbnail,
  tags = [],
  author = "ユニフォームナビ編集部",
  relatedPosts = [],
  children,
}: BlogLayoutProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const formattedDate = formatDate(new Date(date));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.error("共有に失敗しました:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        {/* ナビゲーションとシェアボタン */}
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            記事一覧に戻る
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-500 text-green-600 hover:bg-green-100 transition-all hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            記事をシェア
          </button>
        </div>

        <article className="max-w-4xl mx-auto px-4 pb-16" itemScope itemType="https://schema.org/BlogPosting">
          {/* SEO用の構造化データ（非表示） */}
          <meta itemProp="headline" content={title} />
          <meta itemProp="description" content={excerpt} />
          <meta itemProp="datePublished" content={date} />
          <meta itemProp="author" content={author} />
          {tags.map((tag, index) => (
            <meta key={index} itemProp="keywords" content={tag} />
          ))}

          {thumbnail && <meta itemProp="image" content={thumbnail} />}

          {/* 記事本文 */}
          <div className="prose prose-lg dark:prose-invert max-w-none bg-card rounded-2xl p-8 shadow-lg shadow-primary/5 border border-primary/5">
            {/* 日付とカテゴリー */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 non-prose">
              <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <time dateTime={date} itemProp="datePublished">
                  {formattedDate}
                </time>
              </div>
              <Link
                href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                itemProp="articleSection"
              >
                <Tag className="h-4 w-4" />
                {category}
              </Link>
            </div>

            {/* アイキャッチ画像（あれば表示） */}
            {thumbnail && (
              <div className="mb-8 -mx-8">
                <Image src={thumbnail} alt={title} width={800} height={450} className="w-full h-auto rounded-t-lg object-cover" priority itemProp="image" />
              </div>
            )}

            {/* タイトル */}
            <h1 className="mb-6 text-3xl font-bold tracking-tight mt-0" itemProp="headline">
              {title}
            </h1>

            {/* 記事内容 */}
            <div
              className="prose-headings:font-bold
                          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-lg prose-img:shadow-md
                          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                          prose-pre:bg-muted/50 prose-pre:shadow-inner"
              itemProp="articleBody"
            >
              {children}
            </div>

            {/* タグ表示（あれば） */}
            {tags && tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 non-prose">
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs bg-muted px-3 py-1 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 著者情報（あれば） */}
            <div className="mt-8 pt-6 border-t border-muted/50 flex items-center gap-4 non-prose">
              <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center text-primary font-medium">{author[0]}</div>
              <div>
                <p className="font-medium" itemProp="author">
                  {author}
                </p>
                <p className="text-sm text-muted-foreground">ユニフォームナビ編集部</p>
              </div>
            </div>

            {/* 関連記事セクション */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-muted">
                <h3 className="text-xl font-bold mb-4">関連記事</h3>
                <ul className="space-y-2">
                  {relatedPosts.map((post, index) => (
                    <li key={index} className="hover:text-primary transition-colors">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* 作業服セレクターをページコンテンツの外に配置 */}
      <WorkwearSelector />
    </>
  );
}
