import { Post, DashboardStats } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'The Art of Digital Curation: Finding Signal in the Noise',
    slug: 'art-of-digital-curation',
    excerpt: 'In an era of infinite information, the true value lies not in creation, but in the thoughtful selection and contextualization of existing ideas.',
    content_html: `
      <h2>The Information Deluge</h2>
      <p>We are drowning in a sea of content. Every minute, thousands of hours of video are uploaded, millions of articles are published, and countless tweets are sent into the void. In this environment, the role of the creator is shifting. We no longer need more information; we need better filters.</p>
      <p>This is where the digital curator comes in. A curator is not just a collector, but a sense-maker. They sift through the noise to find the signal, organizing disparate pieces of information into a cohesive narrative.</p>
      <blockquote>"Curation is the new creation."</blockquote>
      <h3>The Three Pillars of Curation</h3>
      <ul>
        <li><strong>Selection:</strong> The ability to identify high-quality, relevant content.</li>
        <li><strong>Contextualization:</strong> Adding your own perspective and explaining why the content matters.</li>
        <li><strong>Presentation:</strong> Delivering the curated content in an accessible and engaging format.</li>
      </ul>
      <p>By mastering these three pillars, you can build a loyal audience that trusts your taste and relies on your insights.</p>
    `,
    category: 'Philosophy',
    tags: ['Curation', 'Digital Life', 'Information'],
    featured_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000',
    status: 'published',
    views: 1250,
    likes: 342,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Minimalism in Web Design: Beyond White Space',
    slug: 'minimalism-web-design',
    excerpt: 'True minimalism isn\'t just about removing elements; it\'s about elevating the essential. How to use typography and subtle contrast to create impact.',
    content_html: '<p>Content coming soon...</p>',
    category: 'Design',
    tags: ['UI/UX', 'Minimalism', 'Typography'],
    featured_image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000',
    status: 'published',
    views: 890,
    likes: 156,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'The Future of Asynchronous Work',
    slug: 'future-async-work',
    excerpt: 'Why the best teams are moving away from real-time communication and embracing deep work through asynchronous collaboration.',
    content_html: '<p>Content coming soon...</p>',
    category: 'Productivity',
    tags: ['Remote Work', 'Deep Work'],
    featured_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
    status: 'draft',
    views: 0,
    likes: 0,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const mockStats: DashboardStats = {
  totalViews: 2140,
  totalLikes: 498,
  publishedPosts: 2,
  draftPosts: 1,
};
