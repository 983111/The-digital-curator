import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="editor" element={<Editor />} />
              <Route path="editor/:id" element={<Editor />} />
              <Route
                path="*"
                element={<div className="p-8 text-on-surface-variant">Coming soon…</div>}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
