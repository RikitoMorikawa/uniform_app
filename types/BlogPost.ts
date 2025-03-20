// /Users/apple/uniform_app/types/BlogPost.ts
export interface BlogPost {
  // Post から BlogPost に名前変更
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  content: string;
  author?: string;
  tags?: string[];
  thumbnail?: string;
  updatedAt?: string;
  keywords?: string[];
}
