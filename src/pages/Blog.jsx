import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { BlogFooter } from '../components/BlogFooter';
import { calculateReadTime } from '../utils/readTime';

const PostCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="w-full"
  >
    <Link to={`/blog/${post.slug}`} className="block p-6 sm:p-8 rounded-2xl bg-space-card border border-space-border hover:border-space-accent/50 transition-colors duration-300 group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <p className="text-xs sm:text-sm text-white font-atkinson">
              {dayjs(post.date).format('MMM D, YYYY').toUpperCase()}
            </p>
            <span className="text-white/40">•</span>
            <p className="text-xs sm:text-sm text-white font-atkinson">
              {post.readTime} read
            </p>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-palatino truncate">{post.title}</h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-palatino line-clamp-2">{post.summary}</p>
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  </motion.div>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postFiles = import.meta.glob('../../blog/*.md', { as: 'raw' });
        const loadedPosts = [];

        for (const path in postFiles) {
          const contents = await postFiles[path]();
          const { data, content } = matter(contents);
          const slug = path.replace('../../blog/', '').replace('.md', '');
          
          // Only add non-draft posts
          if (!data.draft) {
            loadedPosts.push({
              ...data,
              slug,
              readTime: calculateReadTime(content)
            });
          }
        }

        // Sort posts by date
        loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(loadedPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="fixed inset-0 overflow-y-auto bg-space-dark">
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow pt-24 sm:pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-base sm:text-lg text-white/80 mb-8 font-atkinson"
              >
                {loading ? "Loading..." : `Kirill got too excited... He wrote a total of ${posts.length} blog${posts.length !== 1 ? 's' : ''}`}
              </motion.h1>
              
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/60 font-atkinson text-center py-12"
                >
                  Loading posts...
                </motion.div>
              ) : posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/60 font-atkinson text-center py-12"
                >
                  No posts yet. Check back soon!
                </motion.div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {posts.map((post, index) => (
                    <PostCard key={post.slug} post={post} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <BlogFooter />
      </div>
    </main>
  );
};

export default Blog;