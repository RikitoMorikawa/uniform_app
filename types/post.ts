export interface Post {
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
