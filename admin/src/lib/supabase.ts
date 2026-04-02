import { createClient } from '@supabase/supabase-js';

// ─── Supabase Config ────────────────────────────────────────────
// These are your project's public-safe keys. Safe to ship in frontend.
// Project: wjzlxdfgppoopylxawcw (ap-south-1)
const SUPABASE_URL = 'https://wjzlxdfgppoopylxawcw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqemx4ZGZncHBvb3B5bHhhd2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NzAxODEsImV4cCI6MjA5MDU0NjE4MX0.9rS8cVhHt-z6VXYsczhqZ8x1_a5xRXcsf9nHYEfayzA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ─── Types ──────────────────────────────────────────────────────
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

// ─── Auth helpers ────────────────────────────────────────────────
export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

// ─── Post helpers ────────────────────────────────────────────────
export const getPublishedPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Post[]) ?? [];
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) return null;
  return data as Post;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Post[]) ?? [];
};

export const upsertPost = async (
  post: Partial<Post>,
  id?: string
): Promise<Post> => {
  if (id) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Post;
  } else {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...post, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data as Post;
  }
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
};

export const incrementViews = async (id: string): Promise<void> => {
  await supabase.rpc('increment_views', { post_id: id }).maybeSingle();
};

export const uploadImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `blog-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
};
