import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';
import BlogIllustration from '@/components/blog-illustration';

const BlogPage = () => {
  const featuredPost = BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* ── Minimalist Header ── */}
      <header className="py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">The Editorial</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight mb-8">
            Notes on <span className="text-gray-400">AriseLinkX</span>.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Exploring the intersection of branding, link management, and real-time audience analytics.
          </p>
        </div>
      </header>

      {/* ── Featured Section ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 border-b border-gray-50">
        <Link 
          to={`/blog/${featuredPost.id}`}
          className="grid md:grid-cols-2 gap-12 group"
        >
          <BlogIllustration 
            post={featuredPost} 
            className="aspect-[21/9] rounded-[2.5rem] border border-gray-100 shadow-sm"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-4">Featured Article</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 group-hover:text-orange-500 transition-colors leading-tight">
              {featuredPost.title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" />
                {featuredPost.date}
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4" />
                {featuredPost.readTime}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Minimalist Grid ── */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {regularPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group flex flex-col pt-8 border-t border-gray-100"
            >
              <BlogIllustration 
                post={post} 
                className="aspect-[16/9] rounded-2xl mb-8 border border-gray-100 shadow-sm"
              />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${post.textColor} mb-4`}>
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-500 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span>{post.readTime}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BlogPage;
