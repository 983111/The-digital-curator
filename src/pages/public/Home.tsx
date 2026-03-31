import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Clock } from 'lucide-react';
import { Post, getPublishedPosts } from '../../lib/supabase';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-96 bg-surface-container-high rounded-3xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-surface-container-high rounded-3xl" />
          <div className="h-64 bg-surface-container-high rounded-3xl" />
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      {/* Hero */}
      <section className="mb-24 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-on-surface mb-6 leading-tight">
          Curating the <span className="text-primary italic">digital</span> landscape.
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed">
          Essays on design, technology, and the art of finding signal in the noise.
        </p>
      </section>

      {/* No posts state */}
      {posts.length === 0 && (
        <div className="text-center py-24 text-on-surface-variant">
          <p className="text-lg">No essays published yet. Check back soon.</p>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-24">
          <Link to={`/post/${featuredPost.slug}`} className="group block">
            <div className="relative rounded-[2rem] overflow-hidden bg-surface-container-lowest shadow-soft group-hover:shadow-hover transition-all duration-500">
              {featuredPost.featured_image_url && (
                <div className="aspect-[21/9] w-full relative">
                  <img
                    src={featuredPost.featured_image_url}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                </div>
              )}
              <div className={`${featuredPost.featured_image_url ? 'absolute bottom-0 left-0 right-0' : ''} p-8 md:p-12`}>
                <div className="flex items-center gap-4 mb-4">
                  {featuredPost.category && (
                    <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-on-primary text-xs font-semibold uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                  )}
                  <span className={`text-sm flex items-center gap-1.5 ${featuredPost.featured_image_url ? 'text-surface/80' : 'text-on-surface-variant'}`}>
                    <Clock size={14} />
                    {format(new Date(featuredPost.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <h2 className={`font-serif text-3xl md:text-5xl font-medium mb-4 leading-tight group-hover:text-primary-container transition-colors ${featuredPost.featured_image_url ? 'text-surface' : 'text-on-surface'}`}>
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className={`text-lg max-w-2xl line-clamp-2 font-light ${featuredPost.featured_image_url ? 'text-surface/90' : 'text-on-surface-variant'}`}>
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-serif text-3xl font-medium text-on-surface">Recent Essays</h3>
            <Link to="/archive" className="flex items-center gap-2 text-primary font-medium hover:text-primary-container transition-colors group">
              View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/post/${post.slug}`} className="group flex flex-col h-full">
                <div className="rounded-3xl overflow-hidden bg-surface-container-lowest shadow-soft group-hover:shadow-hover transition-all duration-500 flex-1 flex flex-col">
                  {post.featured_image_url && (
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      {post.category && (
                        <span className="text-primary text-xs font-semibold uppercase tracking-wider">{post.category}</span>
                      )}
                      {post.category && <span className="w-1 h-1 rounded-full bg-outline-variant" />}
                      <span className="text-on-surface-variant text-sm flex items-center gap-1.5">
                        <Clock size={14} />
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h4 className="font-serif text-2xl font-medium text-on-surface mb-3 leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-on-surface-variant line-clamp-3 flex-1 font-light leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
