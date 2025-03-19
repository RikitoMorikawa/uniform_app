import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { Tag, Clock, Search } from "lucide-react";
import SearchBar from "@/components/search-bar";

interface SearchParams {
  title?: string;
  category?: string;
  date?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getAllPosts();
  
  // 検索条件に基づいてフィルタリング
  const filteredPosts = posts.filter((post) => {
    // タイトルでフィルタリング
    if (searchParams.title && !post.title.toLowerCase().includes(searchParams.title.toLowerCase())) {
      return false;
    }
    
    // カテゴリーでフィルタリング
    if (searchParams.category && searchParams.category !== "all") {
      const normalizedPostCategory = post.category.toLowerCase().replace(/[空調服|作業服|警備服]/, '');
      const normalizedSearchCategory = searchParams.category.toLowerCase();
      
      switch (normalizedSearchCategory) {
        case 'workwear':
          if (!normalizedPostCategory.includes('作業服')) return false;
          break;
        case 'coolingwear':
          if (!normalizedPostCategory.includes('空調服')) return false;
          break;
        case 'securitywear':
          if (!normalizedPostCategory.includes('警備服')) return false;
          break;
      }
    }
    
    // 日付でフィルタリング
    if (searchParams.date) {
      const postDate = new Date(post.date).toISOString().split('T')[0];
      if (postDate !== searchParams.date) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="container py-12">
        <div className="relative mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            最新の記事
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            作業服、空調服、警備服に関する最新情報をお届けします
          </p>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              検索条件に一致する記事が見つかりませんでした。
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card via-card/95 to-muted/30 border-primary/5">
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        <time dateTime={post.date}>
                          {formatDate(new Date(post.date))}
                        </time>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <Tag className="h-4 w-4" />
                        <span>{post.category}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                      {post.title}
                    </h2>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}