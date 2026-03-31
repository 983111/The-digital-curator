import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Eye, Heart } from 'lucide-react';
import { Post, getPostBySlug, supabase } from '../../lib/supabase';

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then(async (found) => {
        setPost(found);
        // Increment view count silently
        if (found) {
          await supabase
            .from('posts')
            .update({ views: (found.views ?? 0) + 1 })
            .eq('id', found.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-8 w-24 bg-surface-container-high rounded-full mb-8" />
        <div className="h-16 bg-surface-container-high rounded-xl mb-6" />
        <div className="h-64 bg-surface-container-high rounded-3xl mb-12" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-surface-container-high rounded" style={{ width: `${90 - i * 12}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-on-surface mb-4">Post not found</h1>
        <p className="text-on-surface-variant mb-8">This essay doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to essays
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          {post.category && (
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
          )}
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
            <span>{(post.views + 1).toLocaleString()} views</span>
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

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />

      {post.tags?.length > 0 && (
        <footer className="mt-20 pt-8 border-t border-surface-variant">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
