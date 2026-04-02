import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, Image as ImageIcon, Tag, Layout, UploadCloud, Loader2, Trash2, Eye,
} from 'lucide-react';
import { Post, getAllPosts, upsertPost, uploadImage } from '../../lib/supabase';
import { cn } from '../../lib/utils';

type PostDraft = Partial<Omit<Post, 'tags'>> & { tags?: string[] };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(false);

  const [post, setPost] = useState<PostDraft>({
    title: '',
    slug: '',
    content_html: '',
    excerpt: '',
    category: '',
    tags: [],
    featured_image_url: '',
    status: 'draft',
  });
  const [tagsInput, setTagsInput] = useState('');

  // Load existing post if editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const posts = await getAllPosts();
        const found = posts.find((p) => p.id === id);
        if (found) {
          setPost(found);
          setTagsInput(found.tags?.join(', ') ?? '');
        }
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!post.title?.trim()) {
      alert('Please add a title before saving.');
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const payload: Partial<Post> = {
        ...post,
        tags,
        status,
        slug: post.slug?.trim() || slugify(post.title ?? ''),
      } as Partial<Post>;
      await upsertPost(payload, id);
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to save: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setPost((p) => ({ ...p, featured_image_url: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed: ${msg}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-surface-container-lowest rounded-3xl" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main editor */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-soft border border-surface-variant">

          {/* Title */}
          <input
            type="text"
            placeholder="Post Title"
            className="w-full font-serif text-4xl font-medium text-on-surface bg-transparent border-none outline-none placeholder:text-outline-variant mb-6"
            value={post.title ?? ''}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Excerpt</label>
            <textarea
              placeholder="A brief summary shown on the homepage…"
              className="w-full p-4 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors resize-none h-24"
              value={post.excerpt ?? ''}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            />
          </div>

          {/* Content / Preview toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-on-surface-variant">
                HTML Content
              </label>
              <button
                type="button"
                onClick={() => setPreview((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Eye size={13} />
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {preview ? (
              <div
                className="prose max-w-none p-6 rounded-xl bg-surface-container-low border border-surface-variant min-h-[500px]"
                dangerouslySetInnerHTML={{ __html: post.content_html ?? '' }}
              />
            ) : (
              <textarea
                placeholder="<h2>Your content here…</h2><p>Paste raw HTML or type away.</p>"
                className="w-full p-6 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-y min-h-[500px]"
                value={post.content_html ?? ''}
                onChange={(e) => setPost({ ...post, content_html: e.target.value })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Publish */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-soft border border-surface-variant">
          <h3 className="font-serif text-lg font-medium text-on-surface mb-4">Publish</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="w-full py-3 rounded-xl font-medium text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="w-full py-3 rounded-xl font-medium text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-soft disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving…' : 'Publish Post'}
            </button>
          </div>
        </div>

        {/* Post Settings */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-soft border border-surface-variant flex flex-col gap-5">
          <h3 className="font-serif text-lg font-medium text-on-surface">Post Settings</h3>

          {/* Slug */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Layout size={16} /> URL Slug
            </label>
            <input
              type="text"
              placeholder="auto-generated-if-empty"
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              value={post.slug ?? ''}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <ImageIcon size={16} /> Featured Image
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="https://… or upload below"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                value={post.featured_image_url ?? ''}
                onChange={(e) => setPost({ ...post, featured_image_url: e.target.value })}
              />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-variant" />
                <span className="text-xs text-on-surface-variant uppercase font-medium">or</span>
                <div className="h-px flex-1 bg-surface-variant" />
              </div>

              <label className={cn(
                'flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-high transition-colors cursor-pointer text-sm font-medium text-on-surface-variant hover:text-primary',
                uploadingImage && 'opacity-60 cursor-not-allowed'
              )}>
                {uploadingImage ? (
                  <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                ) : (
                  <><UploadCloud size={16} /> Upload Image</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {post.featured_image_url && (
              <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-surface-container relative group">
                <img
                  src={post.featured_image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setPost({ ...post, featured_image_url: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-md text-on-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Tag size={16} /> Category
            </label>
            <input
              type="text"
              placeholder="e.g. Design"
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              value={post.category ?? ''}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Tag size={16} /> Tags
            </label>
            <input
              type="text"
              placeholder="Comma-separated, e.g. Design, UI"
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
