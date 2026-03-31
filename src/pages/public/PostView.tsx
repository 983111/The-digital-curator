import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Eye, Heart } from 'lucide-react';
import { Post } from '../../types';
import { mockPosts } from '../../lib/mockData';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

          if (error) throw error;
          setPost(data as Post);
        } catch (error) {
          console.error('Error fetching post:', error);
          // Fallback to mock data
          setPost(mockPosts.find(p => p.slug === slug) || null);
        }
      } else {
        // Use mock data
        setPost(mockPosts.find(p => p.slug === slug) || null);
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-8 w-24 bg-surface-container-high rounded-full mb-8"></div>
        <div className="h-16 bg-surface-container-high rounded-xl mb-6"></div>
        <div className="h-64 bg-surface-container-high rounded-3xl mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-surface-container-high rounded w-full"></div>
          <div className="h-4 bg-surface-container-high rounded w-5/6"></div>
          <div className="h-4 bg-surface-container-high rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-on-surface mb-4">Post not found</h1>
        <p className="text-on-surface-variant mb-8">The essay you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 text-sm font-medium">
        <ArrowLeft size={16} /> Back to essays
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-on-surface-variant text-sm flex items-center gap-1.5">
            <Clock size={14} />
            {format(new Date(post.created_at), 'MMMM d, yyyy')}
          </span>
        </div>
        
        <h1 className="font-serif text-4xl md:text-6xl font-medium text-on-surface mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-on-surface-variant text-sm border-b border-surface-variant pb-8">
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>{post.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} />
            <span>{post.likes.toLocaleString()} likes</span>
          </div>
        </div>
      </header>

      {post.featured_image_url && (
        <figure className="mb-16 rounded-3xl overflow-hidden shadow-soft">
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            className="w-full h-auto object-cover aspect-[21/9]"
            referrerPolicy="no-referrer"
          />
        </figure>
      )}

      {/* 
        WARNING: dangerouslySetInnerHTML is used here as requested by the user to "paste my beautiful html code".
        In a production environment with multiple untrusted authors, this would be an XSS risk and should be sanitized using DOMPurify.
        Since this is a personal blog admin, the risk is accepted.
      */}
      <div 
        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-on-surface prose-p:text-on-surface-variant prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-container prose-blockquote:border-l-primary prose-blockquote:bg-surface-container-low prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-xl prose-img:rounded-2xl prose-img:shadow-soft"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />

      <footer className="mt-20 pt-8 border-t border-surface-variant">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-surface-variant transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
