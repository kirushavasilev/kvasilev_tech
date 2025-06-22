import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AboutMe from './pages/AboutMe';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Layout from './components/Layout';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only set background for blog pages
    if (location.pathname.startsWith('/blog')) {
      document.body.setAttribute('data-page', 'blog');
    } else {
      document.body.removeAttribute('data-page');
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <RouteTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AboutMe />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
