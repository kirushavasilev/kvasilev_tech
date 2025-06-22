import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogFooter } from '../components/BlogFooter';
import { BlogImage } from '../components/BlogImage';
import { calculateReadTime } from '../utils/readTime';
import { ToolsShowcase } from '../components/ToolIcon';

// Icons
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const TimeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const ExternalLinkButton = ({ href, icon, text }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-space-border hover:bg-space-card transition-colors duration-200">
        {icon}
        <span className="text-sm font-medium">{text}</span>
    </a>
)

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postModule = await import(`../../blog/${slug}.md?raw`);
        const { data, content } = matter(postModule.default);
        
        // Prevent access to draft posts
        if (data.draft) {
          setError("This post is not available yet.");
          setLoading(false);
          return;
        }

        setPost({
          ...data,
          content,
          readTime: calculateReadTime(content)
        });
      } catch (error) {
        console.error('Failed to load post:', error);
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 overflow-y-auto bg-space-dark"
      >
        <div className="min-h-screen flex flex-col items-center pt-20 sm:pt-32 text-white font-palatino px-4">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              Loading...
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              {error} <Link to="/blog" className="ml-2 underline">Go back to posts</Link>
            </motion.div>
          ) : post && (
            <>
              <article className="w-full max-w-3xl flex-1">
                <motion.header 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 sm:mb-12"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="text-xs sm:text-sm text-white/60 font-atkinson">
                        {dayjs(post.date).format('MMM D, YYYY').toUpperCase()}
                      </p>
                    </div>
                    <span className="text-white/40">•</span>
                    <div className="flex items-center gap-2">
                      <TimeIcon />
                      <p className="text-xs sm:text-sm text-white/60 font-atkinson">
                        {post.readTime} read
                      </p>
                    </div>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-2xl sm:text-4xl font-bold mb-4 font-palatino"
                  >
                    {post.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="text-lg sm:text-xl text-white/80 leading-relaxed font-palatino mb-6 sm:mb-8"
                  >
                    {post.summary}
                  </motion.p>
                  {post.tools && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="flex flex-wrap gap-2"
                    >
                      <ToolsShowcase tools={post.tools} />
                    </motion.div>
                  )}
                </motion.header>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="prose prose-invert prose-sm sm:prose-lg max-w-none"
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, src, alt, title }) => (
                        <BlogImage src={src} alt={alt} title={title} />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </motion.div>
              </article>
              <motion.footer 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="w-full mt-12 sm:mt-16"
              >
                <BlogFooter />
              </motion.footer>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Post; 