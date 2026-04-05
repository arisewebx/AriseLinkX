import React from 'react';

const BlogIllustration = ({ post, className }) => {
  // Use existing premium PNGs for the first 4 posts
  if (post.id <= 4 && post.image) {
    return (
      <div className={`${className} overflow-hidden bg-gray-50`}>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
    );
  }

  // Generate ultra-premium 3D-CSS "Glassmorphism" scenes for IDs > 4
  const Icon = post.icon;
  
  return (
    <div className={`${className} relative flex items-center justify-center overflow-hidden bg-white`}>
      {/* ── Level 1: Vibrant Mesh Background ── */}
      <div className={`absolute inset-0 opacity-20 ${post.lightColor} mix-blend-multiply`} />
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-white via-transparent to-transparent opacity-60 rotate-12`} />
        {/* Dynamic Blobs */}
        <div className={`absolute top-10 left-10 w-48 h-48 rounded-full ${post.color} opacity-10 blur-[80px] animate-pulse`} />
        <div className={`absolute bottom-20 right-20 w-64 h-64 rounded-full ${post.color} opacity-5 blur-[100px]`} />
      </div>

      {/* ── Level 2: Technical Grid/Circuitry ── */}
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
         <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20 H100 M0 50 H100 M0 80 H100 M20 0 V100 M50 0 V100 M80 0 V100" stroke="currentColor" strokeWidth="0.1" fill="none" className={post.textColor} />
         </svg>
      </div>

      {/* ── Level 3: Floating "Glass" Panes ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Large Central Pane */}
        <div className="w-[80%] h-[60%] bg-white/10 backdrop-blur-md border border-white/30 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transform -rotate-3 animate-float-slow transition-transform group-hover:rotate-0 duration-1000 relative">
           <div className="absolute top-6 left-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
           </div>
           {/* Shimmer effect */}
           <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
           </div>
        </div>
        
        {/* Secondary Offset Panes */}
        <div className={`absolute top-1/4 right-10 w-32 h-32 bg-gradient-to-br ${post.color} opacity-10 rounded-full blur-2xl animate-orbit`} />
        <div className="absolute bottom-1/4 left-10 w-24 h-12 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full rotate-12 animate-float" />
      </div>

      {/* ── Level 4: 3D Focal Point (The Icon) ── */}
      <div className="relative z-20 flex flex-col items-center gap-8 group-hover:scale-110 transition-transform duration-700">
        <div className={`relative ${post.color} w-36 h-36 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.15)] group-hover:shadow-[0_45px_100px_rgba(0,0,0,0.2)] transition-shadow duration-700`}>
           {/* Internal Glassmorphism */}
           <div className="absolute inset-2 rounded-[2rem] bg-gradient-to-br from-white/30 to-transparent border border-white/20" />
           
           {/* 3D Shadows */}
           <Icon 
             className="w-16 h-16 text-white drop-shadow-[0_10px_20px_rgba(255,255,255,0.4)] relative z-10" 
           />

           {/* Orbiting particles */}
           <div className="absolute -inset-4 border border-white/10 rounded-full animate-orbit opacity-50" />
        </div>
        
        {/* ── Level 5: Branding Integration ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-px bg-gray-200" />
             <span className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em] opacity-80">AriseLinkX</span>
             <div className="w-12 h-px bg-gray-200" />
          </div>
          <div className={`${post.lightColor} ${post.textColor} text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-current/20 backdrop-blur-sm`}>
            {post.category} Focus
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogIllustration;
