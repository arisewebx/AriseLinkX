import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight ,Calendar, User, Clock, Share2, Copy, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS } from '@/data/blog-posts';
import BlogIllustration from '@/components/blog-illustration';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.id === parseInt(id));
  const [copied, setCopied] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollWidth(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Writing not found</h2>
        <Button onClick={() => navigate('/blog')} variant="outline" className="rounded-xl border-gray-200">
          Back to list
        </Button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* ── Progress Bar ── */}
      <div className="fixed top-0 left-0 h-[3px] bg-orange-500 z-[60] transition-all duration-150" style={{ width: `${scrollWidth}%` }} />

      {/* ── Breadcrumbs & Nav ── */}
      <div className="max-w-screen-lg mx-auto px-6 py-12 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <Link to="/blog" className="hover:text-orange-500 transition-colors">Arise Editorial</Link>
          <ChevronRight className="w-3 h-3 text-gray-200" />
          <span className="text-gray-900 truncate max-w-[200px]">{post.category}</span>
        </nav>
        <Link to="/blog" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors">
          View all
        </Link>
      </div>

      {/* ── Article Header ── */}
      <header className="max-w-3xl mx-auto px-6 mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-[1.1] mb-10 tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-gray-100 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${post.lightColor} flex items-center justify-center font-bold ${post.textColor} text-sm`}>
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{post.author}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="px-4 h-9 flex items-center gap-2 rounded-xl border border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied' : 'Share Link'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Large Illustration ── */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <BlogIllustration 
          post={post} 
          className="aspect-[21/9] w-full rounded-[3rem] border border-gray-100 shadow-sm"
        />
      </div>

      {/* ── Centered Article Content (The Reading Way) ── */}
      <article className="max-w-2xl mx-auto px-6">
        <div 
          className="prose prose-orange prose-lg max-w-none 
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:mb-8
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-li:text-gray-600 prose-li:mb-2
            prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-ul:list-disc prose-ul:pl-6
            prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Footer info */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Editorial
          </Link>
        </div>
      </article>

      {/* ── Minimal Related Posts ── */}
      <section className="bg-gray-50/50 mt-32 py-32 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">More from the Editorial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {relatedPosts.map(rp => (
              <Link 
                key={rp.id} 
                to={`/blog/${rp.id}`}
                className="group block"
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest ${rp.textColor} mb-3 block`}>{rp.category}</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors leading-tight mb-4">
                  {rp.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {rp.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
