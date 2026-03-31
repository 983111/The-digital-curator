export interface Post {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalViews: number;
  totalLikes: number;
  publishedPosts: number;
  draftPosts: number;
}
