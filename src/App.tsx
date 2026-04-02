import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import PostView from './pages/public/PostView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="post/:slug" element={<PostView />} />
        </Route>
      </Routes>
    </Router>
  );
}
