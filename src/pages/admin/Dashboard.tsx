import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Heart, FileText, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { Post, DashboardStats, getAllPosts, deletePost } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalLikes: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setStats({
        totalViews: fetchedPosts.reduce((s, p) => s + (p.views || 0), 0),
        totalLikes: fetchedPosts.reduce((s, p) => s + (p.likes || 0), 0),
        publishedPosts: fetchedPosts.filter((p) => p.status === 'published').length,
        draftPosts: fetchedPosts.filter((p) => p.status === 'draft').length,
      });
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deletePost(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const statCards = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-primary' },
    { label: 'Total Likes', value: stats.totalLikes.toLocaleString(), icon: Heart, color: 'text-red-500' },
    { label: 'Published', value: stats.publishedPosts, icon: FileText, color: 'text-green-600' },
    { label: 'Drafts', value: stats.draftPosts, icon: Edit3, color: 'text-orange-500' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-container-lowest rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-surface-container-lowest rounded-3xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-medium text-on-surface">Overview</h2>
        <Link
          to="/admin/editor"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-soft"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest p-6 rounded-3xl shadow-soft border border-surface-variant flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-on-surface-variant">{stat.label}</span>
              <div className={cn('p-2 rounded-xl bg-surface-container', stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="font-serif text-4xl font-medium text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-soft border border-surface-variant overflow-hidden">
        <div className="p-6 border-b border-surface-variant flex items-center justify-between">
          <h3 className="font-serif text-xl font-medium text-on-surface">All Posts</h3>
          <span className="text-sm text-on-surface-variant">{posts.length} posts</span>
        </div>

        {posts.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant">
            <FileText size={40} className="mx-auto mb-4 text-outline-variant" />
            <p className="font-medium mb-2">No posts yet</p>
            <p className="text-sm">Create your first post to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-on-surface mb-0.5 line-clamp-1">{post.title}</div>
                      <div className="text-xs text-on-surface-variant">{post.category || '—'}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        )}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{post.views.toLocaleString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/editor/${post.id}`}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === post.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
