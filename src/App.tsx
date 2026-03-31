import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import PostView from './pages/public/PostView';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public Blog ───────────────────────────── */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<PostView />} />
          </Route>

          {/* ── Admin: Login (public) ─────────────────── */}
          <Route path="/admin/login" element={<Login />} />

          {/* ── Admin: Protected routes ───────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="editor" element={<Editor />} />
              <Route path="editor/:id" element={<Editor />} />
              <Route
                path="*"
                element={
                  <div className="p-8 text-on-surface-variant">Coming soon…</div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
