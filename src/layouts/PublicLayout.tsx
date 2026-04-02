import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-variant">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen size={20} />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-on-surface">
              The Digital Curator
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Essays</Link>
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
            <a href="/admin/" className="text-sm font-medium px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors">
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-12 mt-20 border-t border-surface-variant">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <span className="font-serif font-medium text-on-surface">The Digital Curator</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} The Digital Curator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
