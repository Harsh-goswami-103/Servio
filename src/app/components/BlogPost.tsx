import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { motion, useReducedMotion } from 'motion/react';
import { posts } from '../lib/blogData';

const categoryColors: Record<string, string> = {
  Business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Performance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  SEO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Strategy: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Copywriting: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const reduce = useReducedMotion();

  const post = posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: 0.08 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}
            >
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500">{post.date}</p>

          <hr className="mt-8 border-gray-200 dark:border-slate-800" />
        </motion.header>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: 0.2 }}
          className="prose prose-gray dark:prose-invert prose-lg max-w-none"
        >
          {post.body.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2
                  key={i}
                  className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'p') {
              return (
                <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={i} className="space-y-2 mb-5 pl-5 list-disc">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: 0.35 }}
          className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-900/50 p-8 text-center"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to build something great?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Get a free quote and see how Servio can help your business online.
          </p>
          <Link
            to="/#contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get a Free Quote
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
