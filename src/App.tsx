/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import PostView from './pages/public/PostView';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="post/:slug" element={<PostView />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="editor" element={<Editor />} />
          <Route path="editor/:id" element={<Editor />} />
          {/* Add a catch-all for other admin routes for now */}
          <Route path="*" element={<div className="p-8 text-on-surface-variant">Coming soon...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
