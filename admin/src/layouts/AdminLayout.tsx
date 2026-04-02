import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, PenTool } from 'lucide-react';
import { signOut } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Posts', path: '/posts' },
    { icon: PenTool, label: 'New Post', path: '/editor' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-container flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-surface-variant flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-surface-variant">
          <Link to="/" className="font-serif text-lg font-medium text-on-surface hover:text-primary transition-colors">
            The Digital Curator
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                )}
              >
                <item.icon size={18} className={isActive ? 'text-primary' : 'text-outline'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-variant">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200"
          >
            <LogOut size={18} className="text-outline" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-surface-container-lowest border-b border-surface-variant flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-serif text-xl font-medium text-on-surface">
            {navItems.find(
              (item) =>
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path))
            )?.label || 'Admin'}
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors underline underline-offset-2"
            >
              View blog ↗
            </a>
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-medium">
              A
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
