import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Tag, ChevronLeft } from "lucide-react";
import Image from "next/image";

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: { categoryname: string } }): Promise<Metadata> {
  const decodedCategory = decodeURIComponent(params.categoryname);
  const categoryDisplayNames: { [key: string]: string } = {
    workwear: "作業服",
    cooling: "空調服",
    security: "警備服",
    news: "ニュース",
  };

  const displayName = categoryDisplayNames[decodedCategory] || decodedCategory;

  return {
    title: `${displayName}に関する記事一覧 | ユニフォームナビ`,
    description: `${displayName}に関する最新情報、選び方、おすすめ商品、業界トレンドなどの記事をご紹介します。`,
    alternates: {
      canonical: `https://uniform-navi.com/category/${params.categoryname}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: { categoryname: string } }) {
  const decodedCategory = decodeURIComponent(params.categoryname);
  const posts = await getAllPosts();

  // カテゴリー名の日本語マッピング
  const categoryDisplayNames: { [key: string]: string } = {
    workwear: "作業服",
    cooling: "空調服",
    security: "警備服",
    news: "ニュース",
  };

  // カテゴリーの説明文マッピング
  const categoryDescriptions: { [key: string]: string } = {
    workwear: "作業服の選び方や最新トレンド、機能性、素材、価格帯など、現場で働く人のための実用的な情報をお届けします。",
    cooling: "空調服の性能比較や選び方、メンテナンス方法など、暑さ対策に関する専門的な情報を提供しています。",
    security: "警備服の機能性や快適性、各メーカーの特徴など、警備業務に従事する方々に役立つ情報を発信しています。",
    news: "作業服業界の最新ニュースや新製品情報、市場動向など、業界の今をお伝えします。",
  };

  const displayName = categoryDisplayNames[decodedCategory] || decodedCategory;
  const description = categoryDescriptions[decodedCategory] || `${displayName}に関する最新情報や選び方のポイント、おすすめ製品などをご紹介しています。`;

  // カテゴリーでフィルタリング
  const filteredPosts = posts.filter((post) => {
    const normalizedPostCategory = post.category.toLowerCase().replace(/\s+/g, "-");
    const normalizedTargetCategory = decodedCategory.toLowerCase();

    return normalizedPostCategory === normalizedTargetCategory;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* ナビゲーション */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          トップページに戻る
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">{displayName}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </header>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-card rounded-lg shadow-md overflow-hidden border border-muted transition-all hover:shadow-lg">
                {post.thumbnail ? (
                  <Link href={`/posts/${post.id}`} className="block mt-2 h-40 overflow-hidden">
                    <Image
                      src={post.thumbnail.startsWith("/") ? post.thumbnail : `/${post.thumbnail}`}
                      alt={post.title}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="h-40 bg-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{post.category}</span>
                    <time className="text-xs text-muted-foreground">{formatDate(new Date(post.date))}</time>
                  </div>
                  <h2 className="text-xl font-semibold mt-2 mb-3 line-clamp-2">
                    <Link href={`/posts/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags &&
                      post.tags.map((tag, index) => (
                        <Link
                          key={index}
                          href={`/tag/${encodeURIComponent(tag)}`}
                          className="text-xs bg-muted px-3 py-1 rounded-full hover:bg-muted/80 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-md border border-muted">
            <h2 className="text-2xl font-semibold mb-4">記事が見つかりませんでした</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              申し訳ありませんが、「{displayName}」のカテゴリーの記事はまだありません。他のカテゴリーをご覧いただくか、新しい記事の追加をお待ちください。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              トップページに戻る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
