import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Tag, Layout, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { Post } from '../../types';
import { mockPosts } from '../../lib/mockData';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [post, setPost] = useState<Partial<Post>>({
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

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setPost(data);
            setTagsInput(data.tags?.join(', ') || '');
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          const mockPost = mockPosts.find(p => p.id === id);
          if (mockPost) {
            setPost(mockPost);
            setTagsInput(mockPost.tags?.join(', ') || '');
          }
        }
      } else {
        const mockPost = mockPosts.find(p => p.id === id);
        if (mockPost) {
          setPost(mockPost);
          setTagsInput(mockPost.tags?.join(', ') || '');
        }
      }
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    
    const postData = {
      ...post,
      tags: tagsArray,
      status,
      updated_at: new Date().toISOString(),
      // Auto-generate slug if empty
      slug: post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };

    if (isSupabaseConfigured()) {
      try {
        if (id) {
          const { error } = await supabase.from('posts').update(postData).eq('id', id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('posts').insert([{ ...postData, created_at: new Date().toISOString() }]);
          if (error) throw error;
        }
        navigate('/admin');
      } catch (error) {
        console.error('Error saving post:', error);
        alert('Failed to save post. Check console for details.');
      }
    } else {
      console.log('Mock save:', postData);
      alert('Saved! (Mock mode - Supabase not configured)');
      navigate('/admin');
    }
    
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Cannot upload image.');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `featured-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images') // Assuming the bucket is named 'images'
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setPost({ ...post, featured_image_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Make sure the "images" bucket exists and is public.');
    } finally {
      setUploadingImage(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-surface-container-lowest rounded-3xl"></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-soft border border-surface-variant">
          <input
            type="text"
            placeholder="Post Title"
            className="w-full font-serif text-4xl font-medium text-on-surface bg-transparent border-none outline-none placeholder:text-outline-variant mb-6"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Excerpt</label>
            <textarea
              placeholder="A brief summary of the post..."
              className="w-full p-4 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors resize-none h-24"
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-on-surface-variant">HTML Content</label>
              <span className="text-xs text-outline bg-surface-container px-2 py-1 rounded-md">Raw HTML Mode</span>
            </div>
            <textarea
              placeholder="<h1>Paste your beautiful HTML code here...</h1>"
              className="w-full p-6 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-y min-h-[500px]"
              value={post.content_html}
              onChange={(e) => setPost({ ...post, content_html: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Sidebar Settings */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Publish Card */}
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
              <Save size={18} />
              {saving ? 'Saving...' : 'Publish Post'}
            </button>
          </div>
        </div>

        {/* Meta Card */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-soft border border-surface-variant flex flex-col gap-5">
          <h3 className="font-serif text-lg font-medium text-on-surface">Post Settings</h3>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Layout size={16} /> URL Slug
            </label>
            <input
              type="text"
              placeholder="auto-generated-if-empty"
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <ImageIcon size={16} /> Featured Image
            </label>
            
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="https://... (or upload below)"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                value={post.featured_image_url}
                onChange={(e) => setPost({ ...post, featured_image_url: e.target.value })}
              />
              
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-variant"></div>
                <span className="text-xs text-on-surface-variant uppercase font-medium">OR</span>
                <div className="h-px flex-1 bg-surface-variant"></div>
              </div>

              <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-high transition-colors cursor-pointer text-sm font-medium text-on-surface-variant hover:text-primary">
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    Upload Image
                  </>
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
                <img src={post.featured_image_url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setPost({ ...post, featured_image_url: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-md text-on-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Tag size={16} /> Category
            </label>
            <input
              type="text"
              placeholder="e.g. Design"
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
              <Tag size={16} /> Tags
            </label>
            <input
              type="text"
              placeholder="Comma separated tags"
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
